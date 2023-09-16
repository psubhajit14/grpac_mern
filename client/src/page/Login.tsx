import React, { useCallback, useState } from "react";

import { Avatar, Button, Col, Divider, Form, Input, message, Modal, Row, Typography } from "antd";
import { RxCross2 } from 'react-icons/rx'
import { useNavigate } from "react-router-dom";
import '../styles/divider.css'
import { FcGoogle } from 'react-icons/fc'
import { logInWithEmailAndPassword, registerWithEmailAndPassword, sendPasswordReset, signInWithGoogle } from "../database/authUtil";

export const Login: React.FC<any> = () => {
    const navigate = useNavigate();
    const [formType, setFormType] = useState<"Login" | "Sign Up" | "Reset Password">("Login")
    const onSuccess = () => {
        navigate("/dashboard")
    }
    const handleSubmit = useCallback((val: any) => {
        switch (formType) {
            case "Login":
                logInWithEmailAndPassword(val?.email, val?.password, onSuccess);
                break;
            case "Sign Up":
                registerWithEmailAndPassword(val?.name, val?.email, val?.password, onSuccess);
                break;
            case "Reset Password":
                sendPasswordReset(val?.email, () => setFormType("Login"))
                break;
            default:
                return
        }
    }, [formType])
    return (
        <>
            <Modal
                centered
                open={true}
                footer={null}
                closeIcon={null}
                bodyStyle={{ padding: "24px 0px" }}
            >
                <Col span={24} style={{ padding: '0px 24px' }}>
                    <Avatar style={{ padding: "3px", "borderRadius": "15px", width: '30px', height: '30px', backgroundColor: 'black' }} onClick={() => navigate("/", { replace: true })} icon={<RxCross2 size={"20px"} />} />
                    <Typography.Title style={{ fontSize: 32 }}>{formType}</Typography.Title>
                    <Form style={{ paddingTop: '24px' }} onFinish={(val) => { handleSubmit(val) }}>
                        {formType == "Sign Up" && <Form.Item name="name" rules={[
                            {
                                required: true, message: "Please enter Your Name!"
                            }]} hasFeedback>
                            <Input placeholder="Name" />
                        </Form.Item >}
                        <Form.Item name="email" rules={[
                            {
                                required: true, message: "Please enter Your Email-ID!"
                            },
                            {
                                type: "email", message: "Please enter valid Email-ID!"
                            }]} hasFeedback>
                            <Input type="email" placeholder="Email-ID" />
                        </Form.Item >
                        {formType !== "Reset Password" && <Form.Item name="password"
                            rules={[
                                {
                                    required: true, message: "Please enter your password!"
                                },
                                {
                                    min: 8, message: "Please enter at least 8 character!"
                                }
                            ]} hasFeedback>
                            <Input.Password placeholder="Password" />
                        </Form.Item>}

                        <Form.Item wrapperCol={{ span: 24 }} style={{ marginBottom: 0 }}>
                            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>{formType}</Button>
                        </Form.Item>

                        <Row justify={"space-between"} style={{ margin: 0, padding: '8px 0px' }}>{formType !== "Reset Password" ? <Typography.Link strong onClick={() => setFormType("Reset Password")}>Forgot Password ?</Typography.Link> : <Typography.Text></Typography.Text>}
                            {formType === "Login" ?
                                <Typography.Paragraph strong>Not a user ? <Typography.Link underline onClick={() => setFormType("Sign Up")}>Sign Up</Typography.Link></Typography.Paragraph>
                                : <Typography.Paragraph strong>Already a user ? <Typography.Link underline onClick={() => setFormType("Login")}>Sign In</Typography.Link></Typography.Paragraph>
                            }
                        </Row>
                    </Form>
                    <Divider style={{ fontSize: 12, marginBottom: '8px', marginTop: 0 }}>or</Divider>
                    <Button type="default" style={{ "width": "100%", display: "flex", alignItems: "center", justifyContent: "center", columnGap: 8 }} onClick={() => {
                        signInWithGoogle(() => {
                            message.success("Logged in with Google Successfully", 5);
                            navigate("/dashboard", { replace: true });
                        }
                        )
                    }} ><FcGoogle size={24} alignmentBaseline="middle" /><Typography.Text style={{ fontSize: 16, }}>Sign in with Google</Typography.Text></Button>

                </Col>
            </Modal>
            <></>
        </>
    );
}