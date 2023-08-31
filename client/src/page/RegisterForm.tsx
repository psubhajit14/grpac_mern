import { Form, Input, Radio, Select, Button, message, Space, Typography, Divider, Row } from "antd"
import { data } from "../data"

import { createRecord } from "../database/firebaseUtil"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useViewport } from "../util"
import { paymentContext } from "../util/state"
import { onSignup } from "../database/authUtil"
import { RiCheckDoubleLine } from 'react-icons/ri'



export const RegisterForm: React.FC<any> = () => {

    const navigate = useNavigate();
    const [formInstance] = Form.useForm();
    const district = Form.useWatch("district", formInstance);
    const block = Form.useWatch("block", formInstance);
    const phoneNumber = Form.useWatch("mobileNo", formInstance);

    const uuid = Form.useWatch("uuid", formInstance);
    const { resetFields, setFieldValue, validateFields } = formInstance;
    const [loading, setLoading] = useState(false)
    const { width } = useViewport();
    const [active, setActive] = useState(true);

    const { setOpenModal, uid, setUid } = useContext(paymentContext);
    useEffect(() => {
        setUid && setUid(undefined)
        resetFields()
    }, [])

    const handleSubmit = (testdata: any) => {
        testdata = {
            ...testdata,
            donated: 0,
        }
        const onSuccess = (id: string) => {
            message.success("successfully data pushed to firebase");
            resetFields()
            navigate(`/success/${id}`)
        }
        const onError = (error: any) => {
            console.log(error)
            message.error("issue connecting to firebase");
        }
        createRecord(testdata, setLoading, onSuccess, onError)
    }

    useEffect(() => {
        (async () => {
            if (uid !== undefined) {
                setFieldValue("uuid", uid)
                await validateFields().then((value) => { }, (error) => { });
            }
        })()
    }, [uid, setFieldValue])

    return (
        <><Row justify={width > 768 ? "center" : "start"} style={{
            marginBottom: width > 468 ? 24 : 0
        }}><Typography.Title>Registration Form</Typography.Title></Row>
            <Form style={{ width: "80%" }}
                layout={width > 768 ? "horizontal" : "vertical"}
                labelCol={{ span: width > 768 ? 6 : 24 }} wrapperCol={{ span: width > 768 ? 18 : 24 }}
                onFinish={(val) => handleSubmit(val)}
                form={formInstance}
                scrollToFirstError
                onFieldsChange={(_, fields: any) => {
                    setActive(fields.find((item: any) => item.name[0] === 'mobileNo').errors.length !== 0)
                }}
            >
                <Form.Item name='name' label="Fullname" rules={[
                    { required: true, message: 'Name is required!' }
                ]} hasFeedback>
                    <Input />
                </Form.Item>
                <Form.Item name='email' label="Email" rules={[
                    { required: true, message: 'Email is required!' },
                    { type: 'email', message: 'Email is invalid!' }
                ]} hasFeedback>
                    <Input type='email' inputMode="email" />
                </Form.Item>
                <Form.Item name="gender" label="Gender" initialValue={"male"}>
                    <Radio.Group options={[{
                        'label': 'Male',
                        'value': 'male'
                    }, {
                        'label': 'Female',
                        'value': 'female'
                    }, {
                        'label': 'Do no Prefer to say',
                        'value': 'other'
                    }]}
                        style={{ display: "flex", flexDirection: width > 568 ? "row" : "column" }}
                        optionType={width > 568 ? "button" : "default"}
                    />
                </Form.Item>
                <Form.Item name='mobileNo' label="Mobile No"
                    rules={[
                        { required: true, message: 'Mobile No is required!' },
                        { pattern: RegExp("^\\d{10}$"), message: "Mobile No should be 10 digit!" },
                    ]} hasFeedback >
                    <Input addonBefore="+91" type='number' inputMode="tel" />
                </Form.Item>
                <Form.Item name="uuid"
                    wrapperCol={{ span: width > 768 ? 20 : 24, offset: width > 768 ? 6 : 0 }}
                    rules={[
                        { required: true, message: 'Mobile verification is required!' },
                    ]} >
                    {(uuid === undefined) ?
                        <Button disabled={active} onClick={() => {
                            onSignup(phoneNumber, () => { }, () => { message.success("OTP Sent to your mobile numeber.", 2) })
                            setOpenModal && setOpenModal(true)
                        }} style={{ margin: '8px 0px' }} type="primary">Verify phone number</Button> :

                        <Space><Typography.Text type="success">Mobile No verified Successfully</Typography.Text><RiCheckDoubleLine color="#52c41a" size={24} /></Space>
                    }
                </Form.Item>
                <Form.Item name='occupation' label="Occupation" rules={[
                    { required: true, message: 'Occupation is required!' }
                ]} hasFeedback>
                    <Select
                        showSearch
                        placeholder="Search to Select"
                        optionFilterProp="children"
                        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        options={data.occupationList}
                    />
                </Form.Item>
                <Form.Item name='district' label="District" rules={[
                    { required: true, message: 'District is required!' }
                ]} hasFeedback>
                    <Select
                        showSearch
                        onChange={() => resetFields(["block", "mouza"])}
                        placeholder="Search to Select"
                        optionFilterProp="children"
                        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        options={data.districtList}
                    />
                </Form.Item>
                <Form.Item name='block' label="Block" rules={[
                    { required: true, message: 'Block is required!' }
                ]} hasFeedback>
                    <Select
                        onChange={() => resetFields(["mouza"])}
                        showSearch
                        placeholder="Search to Select"
                        optionFilterProp="children"
                        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        options={data.blocks?.find((item: any) =>
                            item.district == district
                        )?.blockList}
                    />
                </Form.Item>
                <Form.Item name='mouza' label="Mouza" rules={[
                    { required: true, message: 'Mouza is required!' },
                ]} hasFeedback>
                    {data.mouzas?.find((item: any) => item.block == block)
                        ? <Select
                            showSearch
                            placeholder="Search to Select"
                            optionFilterProp="children"
                            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                            filterSort={(optionA, optionB) =>
                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                            }
                            options={data.mouzas?.find((item: any) =>
                                item.block == block
                            )?.mouzaList}
                        /> : <Input />
                    }
                </Form.Item>
                <Form.Item name='pin' label="Pin Code" rules={[
                    { required: true, message: 'Pin Code is required!' },
                    { pattern: RegExp("^\\d{6}$"), message: 'Pin should be 6 digit!' },
                ]} hasFeedback>
                    <Input type='number' inputMode="tel" />
                </Form.Item>

                <Form.Item wrapperCol={{ span: width > 768 ? 20 : 24, offset: width > 768 ? 6 : 0 }} style={{ paddingTop: 8 }}>
                    <Button type='primary' htmlType='submit' loading={loading}>Register</Button>
                </Form.Item>
            </Form>
        </>
    )
} 