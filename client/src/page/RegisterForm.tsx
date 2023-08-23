import { Form, Input, Radio, Select, Button, message } from "antd"
import { data } from "../data"

import { createRecord } from "../database/firebaseUtil"
import { useState } from "react"
import { useNavigate } from "react-router-dom"



export const RegisterForm: React.FC<any> = () => {

    const navigate = useNavigate();
    const [formInstance] = Form.useForm();
    const district = Form.useWatch("district", formInstance);
    const block = Form.useWatch("block", formInstance);
    const { resetFields, } = formInstance;
    const [loading, setLoading] = useState(false)

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


    return (
        <Form style={{ width: "80%" }}
            layout="horizontal"
            labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}
            onFinish={(val) => handleSubmit(val)}
            form={formInstance}
            scrollToFirstError
        >
            <Form.Item name='name' label="Name" rules={[
                { required: true, message: 'Please input your username!' }
            ]} hasFeedback>
                <Input />
            </Form.Item>
            <Form.Item name='email' label="Email" rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please input valid email!' }
            ]} hasFeedback>
                <Input type='email' inputMode="email" />
            </Form.Item>
            <Form.Item name="gender" label="Gender" initialValue={"male"}>
                <Radio.Group buttonStyle={'solid'}>
                    <Radio.Button value="male">Male</Radio.Button>
                    <Radio.Button value="female">Female</Radio.Button>
                    <Radio.Button value="other">Do not prefer to say</Radio.Button>
                </Radio.Group>
            </Form.Item>
            <Form.Item name='mobileNo' label="Mobile No" rules={[
                { required: true, message: 'Please input your mobile number!' },
                { pattern: RegExp("^\\d{10}$"), message: 'Please input valid 10 digit mobile number!' },
            ]} hasFeedback>
                <Input addonBefore="+91" type='number' inputMode="tel" />
            </Form.Item>
            <Form.Item name='occupation' label="Occupation" rules={[
                { required: true, message: 'Please select your occupation!' }
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
                { required: true, message: 'Please select your district!' }
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
                { required: true, message: 'Please select your block!' }
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
                { required: true, message: 'Please input your mouza!' },
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
                { required: true, message: 'Please input your Pincode!' },
                { pattern: RegExp("^\\d{6}$"), message: 'Please input valid 6 digit Pincode!' },
            ]} hasFeedback>
                <Input type='number' inputMode="tel" />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 20, offset: 4 }} style={{ paddingTop: 8 }}>
                <Button type='primary' htmlType='submit' loading={loading}>Register</Button>
            </Form.Item>
        </Form>
    )
} 