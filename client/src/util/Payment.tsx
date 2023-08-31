import { Button, Form, Input, message, Modal, Space } from "antd"
import { useContext, useRef, useState } from "react";
import { onOTPVerify, onSignup } from "../database/authUtil";
import { paymentContext } from "./state";

export const Payment: React.FC<any> = () => {
    const { open, setOpenModal, setUid } = useContext(paymentContext);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState("");
    return (
        <>
            <div id="recaptcha-container"></div>
            <Modal
                forceRender
                title={"Enter 6 digit OTP(One Time Password): "}
                open={open}
                okText="Verify OTP"
                onOk={() => {
                    onOTPVerify(input, setLoading,
                        (user) => {
                            setUid && setUid(user.uid);
                            message.success(("OTP verified successfully for " + user.phoneNumber), 2)
                            setOpenModal && setOpenModal(false);
                        })
                }}
                confirmLoading={loading}
                onCancel={() => { setOpenModal && setOpenModal(false) }}
            ><Input value={input} onChange={(e) => setInput(e.target.value)} /></Modal>
        </>
    )
}

