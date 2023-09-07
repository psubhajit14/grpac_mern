import React, { useContext, useEffect, useState } from "react";

import { auth } from "../database/firebaseUtil";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button, Card, Col, Divider, Form, Input, message, Modal, Row, Space, Typography } from "antd";
import { IoCaretBackCircleOutline } from 'react-icons/io5'
import { Link, useNavigate } from "react-router-dom";
import '../styles/divider.css'
import { FcGoogle } from 'react-icons/fc'
import { signInWithGoogle } from "../database/authUtil";
import { paymentContext } from "../util/state";

export const Login: React.FC<any> = () => {
    const navigate = useNavigate();
    const [formType, setFormType] = useState<"Login" | "Sign Up" | "Reset Password">("Login")
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
                    <Button type="primary" style={{ padding: "5px", overflow: "visible", "borderRadius": "50%" }} onClick={() => navigate("/", { replace: true })} icon={<IoCaretBackCircleOutline size={"20px"} />} />
                    <Typography.Title style={{ fontSize: 32 }}>{formType}</Typography.Title>
                    <Form style={{ paddingTop: '24px' }} onFinish={(val) => { console.log(val) }}>
                        {formType != "Reset Password" && <Form.Item name="name" rules={[
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
                        {formType == "Sign Up" && <Form.Item name="password"
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

                        <Row justify={"space-between"} style={{ margin: 0, padding: '8px 0px' }}><Typography.Link strong onClick={() => setFormType("Reset Password")}>Forgot Password ?</Typography.Link>
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