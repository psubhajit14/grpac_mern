import React from "react";

import { auth } from "../database/firebaseUtil";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button, Card, Col, Divider, Form, Input, Modal, Row, Typography } from "antd";
import { IoCaretBackCircleOutline } from 'react-icons/io5'
import { useNavigate } from "react-router-dom";
import '../styles/divider.css'
import { FcGoogle } from 'react-icons/fc'
import { signInWithGoogle } from "../database/authUtil";

export const Login: React.FC<any> = () => {

    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();
    return (
        <>
            <Modal
                centered
                open={true}
                footer={null}
                closeIcon={null}
                bodyStyle={{ "backgroundColor": "#001529", padding: "24px 0px" }}
            >
                <Col span={24} style={{ padding: '0px 24px' }}>
                    <Button type="primary" style={{ padding: "5px", overflow: "visible", "borderRadius": "50%" }} onClick={() => navigate("/", { replace: true })} icon={<IoCaretBackCircleOutline size={"20px"} />} />
                    <Typography.Title style={{ fontSize: 24, color: "white" }}>Login</Typography.Title>
                    <Form style={{ paddingTop: '24px' }}>
                        <Form.Item name="name" rules={[
                            {
                                required: true, message: "Please enter Your Name!"
                            }]} hasFeedback>
                            <Input placeholder="Name" />
                        </Form.Item >
                        <Form.Item name="email" rules={[
                            {
                                required: true, message: "Please enter Your Email-ID!"
                            },
                            {
                                type: "email", message: "Please enter valid Email-ID!"
                            }]} hasFeedback>
                            <Input type="email" placeholder="Email-ID" />
                        </Form.Item >
                        <Form.Item name="password" rules={[
                            {
                                required: true, message: "Please enter your password!"
                            },
                            {
                                min: 8, message: "Please enter at least 8 character!"
                            }
                        ]} hasFeedback>
                            <Input type="password" placeholder="Password" />
                        </Form.Item>
                        <Row gutter={10}>
                            <Col span={12}>
                                <Form.Item wrapperCol={{ span: 24 }}>
                                    <Button type="primary" style={{ width: '100%' }}>Login</Button>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item wrapperCol={{ span: 24 }}>
                                    <Button type="default" style={{ "width": "100%" }} icon={<FcGoogle size={24} />} onClick={signInWithGoogle} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <Divider style={{ color: "white", fontSize: "12px", }}>or</Divider>

                    <Row justify={"space-between"} style={{ padding: '8px 0px' }}><Typography.Link strong>Forgot Password ?</Typography.Link><Typography.Paragraph strong style={{ "color": "white" }}>Not a user ? <Typography.Link underline>Sign Up</Typography.Link></Typography.Paragraph></Row>
                </Col>
            </Modal>
            <></>
        </>
    );
}