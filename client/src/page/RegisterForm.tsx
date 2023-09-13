import { Form, Input, Radio, Select, Button, message, Typography, Row } from "antd"
import { data, translated } from "../data"

import { createRecord } from "../database/firebaseUtil"
import { useCallback, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useViewport } from "../util"
import { useTranslation } from "react-i18next"



export const RegisterForm: React.FC<any> = () => {

    const navigate = useNavigate();
    const [formInstance] = Form.useForm();
    const district = Form.useWatch("district", formInstance);
    const block = Form.useWatch("block", formInstance);
    const inputRef = useRef(null);
    const { resetFields } = formInstance;
    const [loading, setLoading] = useState(false)
    const { width } = useViewport();
    const [otherInput, setOtherInput] = useState(false)
    const [t] = useTranslation('common', { keyPrefix: 'registration_form' });

    useEffect(() => {
        resetFields()
    }, [resetFields])

    const handleSubmit = useCallback((testdata: any) => {
        testdata = {
            ...testdata,
            email: testdata.email === undefined ? "" : testdata.email,

            occupation: testdata.occupation === "Other" ? (inputRef.current as any).input.value : testdata.occupation,
            donated: 0,
        }
        // console.log((inputRef.current as any).input.value)

        console.log(testdata)
        const onSuccess = (id: string) => {
            message.success("successfully data pushed to firebase", 2);
            resetFields()
            navigate(`/success/${id}`)
        }
        const onError = (error: any) => {
            console.log(error)
            message.error(error.message, 2);
        }
        createRecord(testdata, setLoading, onSuccess, onError)
    }, [inputRef, resetFields, navigate])

    return (
        <><Row justify={width > 768 ? "center" : "start"} style={{
            marginBottom: width > 468 ? 24 : 0
        }}><Typography.Title>{t('title')}</Typography.Title></Row>

            <Form style={{ width: "80%" }}
                layout={width > 768 ? "horizontal" : "vertical"}
                labelCol={{ span: width > 768 ? 6 : 24 }} wrapperCol={{ span: width > 768 ? 18 : 24 }}
                onFinish={(val) => handleSubmit(val)}
                form={formInstance}
                scrollToFirstError
            >
                <Form.Item name='name' label={t('name.label')} rules={[
                    { required: true, message: 'Name is required!' }
                ]} hasFeedback>
                    <Input />
                </Form.Item>
                <Form.Item name='email' label={t('email.label')} rules={[
                    { type: 'email', message: 'Email is invalid!' }
                ]} hasFeedback>
                    <Input type='email' inputMode="email" />
                </Form.Item>
                <Form.Item name="gender" label={t('gender.label')} initialValue={"male"}>
                    <Radio.Group options={translated(t).gender}
                        optionType={"button"}
                    />
                </Form.Item>
                <Form.Item name='mobileNo' label={t('mobileNo.label')}
                    rules={[
                        { required: true, message: 'Mobile No is required!' },
                        { pattern: RegExp("^\\d{10}$"), message: "Mobile No should be 10 digit!" },
                    ]} hasFeedback >
                    <Input addonBefore="+91" type='number' inputMode="tel"
                    // onChange={() => {
                    //     setUid && setUid(undefined);
                    //     setFieldValue("uuid", undefined)
                    // }} 
                    />
                </Form.Item>
                {/* <Form.Item name="uuid"
                            wrapperCol={{ span: width > 768 ? 20 : 24, offset: width > 768 ? 6 : 0 }}
                            rules={[
                                { required: true, message: 'Mobile verification is required!' },
                            ]} >
                            <Space><Button disabled={active} loading={loading} onClick={() => {
                                onSignup(phoneNumber, setLoading, () => { setActive(false); message.success("OTP Sent to your mobile numeber.", 2) })
                                setOpenModal && setOpenModal(true)
                            }} style={{ margin: '0px', display: "inline" }} type="primary">Verify phone number</Button>{uuid != undefined && <Typography.Text type="success">Mobile No verified Successfully</Typography.Text>}</Space>

                        </Form.Item> */}
                <Form.Item name='occupation' label={t('occupation.label')} style={{ marginBottom: 4 }} rules={[
                    { required: true, message: 'Occupation is required!' }
                ]} hasFeedback>
                    <Select
                        onChange={(value, _) => {
                            if (value === "Other") {
                                setOtherInput(true)
                            } else {
                                setOtherInput(false)
                            }
                        }}
                        placeholder="Click to Select"
                        optionFilterProp="children"
                        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        options={translated(t).occupationList}
                    />
                </Form.Item>

                {otherInput &&
                    <Form.Item label=" " style={{ marginBottom: 0 }} colon={false} >
                        <Input required ref={inputRef} placeholder="Please type your occupation" />
                    </Form.Item>}

                <Form.Item name='district' style={{ marginTop: 24 }} label={t('district.label')} rules={[
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
                <Form.Item name='block' label={t('block.label')} rules={[
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
                            item.district === district
                        )?.blockList}
                    />
                </Form.Item>
                <Form.Item name='mouza' label={t('mouza.label')} hasFeedback>
                    {data.mouzas?.find((item: any) => item.block === block)
                        ? <Select
                            showSearch
                            placeholder="Search to Select"
                            optionFilterProp="children"
                            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                            filterSort={(optionA, optionB) =>
                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                            }
                            options={data.mouzas?.find((item: any) =>
                                item.block === block
                            )?.mouzaList}
                        /> : <Input />
                    }
                </Form.Item>
                <Form.Item name='pin' label={t('pin.label')} rules={[
                    { required: true, message: 'Pin Code is required!' },
                    { pattern: RegExp("^\\d{6}$"), message: 'Pin should be 6 digit!' },
                ]} hasFeedback>
                    <Input type='number' inputMode="tel" />
                </Form.Item>

                <Form.Item wrapperCol={{ span: width > 768 ? 20 : 24, offset: width > 768 ? 6 : 0 }} style={{ paddingTop: 8 }}>
                    <Button type='primary' htmlType='submit' loading={loading}>{t('register')}</Button>
                </Form.Item>
            </Form>
            {/* <Col span={width > 768 ? 4 : 6}>
                    <Ad dangerouslySetInnerHTML={{
                        __html: `<ins class="adsbygoogle"
                            style="display:block"
                            data-ad-client="ca-pub-3724971157141240"
                            data-ad-slot="1556359985"
                            data-ad-format="auto"
                            data-full-width-responsive="true"></ins>`}} />
                </Col> */}
            {/* <Row>
                <Ad dangerouslySetInnerHTML={{
                    __html: `<ins class="adsbygoogle"
                        style="display:block"
                        data-ad-client="ca-pub-3724971157141240"
                        data-ad-slot="5813500897"
                        data-ad-format="auto"
                        data-full-width-responsive="true"></ins>`}} />
            </Row> */}
        </>
    )
} 