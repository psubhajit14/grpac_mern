import { Alert, Button, Col, Drawer, Form, message, QRCode, Result, Row, Skeleton, Space, Typography, Upload, UploadProps } from "antd"
// import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"
import { checkUserExists, createPayment, customUpload } from "../database/firebaseUtil";
import { useViewport } from "../util";
import { IoCopyOutline } from 'react-icons/io5'
import { useTranslation } from "react-i18next";
import '../styles/qrcode.css'
import LOGO from '../assets/logo.png'
import { UploadOutlined } from "@ant-design/icons";
import { ImageCompressor } from "../util/fileCompress";
// import { updateRecord } from "../database/firebaseUtil";

export const Success: React.FC<any> = () => {
    const { refId } = useParams();
    const [t] = useTranslation('common', { keyPrefix: 'success' });

    const [loading, setLoading] = useState(false);
    const [regID, setRegID] = useState("GRPAC-000010");
    // const [loading, setLoading] = useState(false)
    // const handlePayment = async (price: string) => {
    //     const baseURL = "https://grpac-mern.vercel.app/api/payment/";
    //     try {
    //         const orderURL = "orders";
    //         const { data: { data } } = await axios.post(baseURL + orderURL, { amount: price });
    //         const options = {
    //             key: process.env.REACT_APP_RAZOR_PAY_KEY,
    //             amount: data.amount,
    //             currency: data.currency,
    //             order_id: data.id,
    //             name: "GRPAC",
    //             description: "Enter the amount of your choice minimum 100/-",
    //             image: 'https://indianrailways.gov.in/railwayboard/uploads/directorate/coaching/TAG_2022-23/TAG_2022.jpg',
    //             handler: async (res: any) => {
    //                 try {
    //                     const verifyURL = baseURL + "verify";
    //                     // console.log(res)
    //                     await axios.post(verifyURL, res);
    //                     const paymentData = {
    //                         userRefId: refId,
    //                         donated: price,
    //                         payment_id: res.razorpay_payment_id,
    //                         at: new Date(),
    //                     }
    //                     updateRecord(paymentData, setLoading, null, null)
    //                 } catch (error) {
    //                     console.error(error)
    //                 }
    //             }

    //         }
    //         const rzpay = new (window as any).Razorpay(options);
    //         rzpay.open();
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
    const navigate = useNavigate();
    // useEffect(() => {
    //     checkUserExists(refId as string)
    //         .then((document: any) => {
    //             setLoading(false)
    //             if (!document.exists()) {
    //                 navigate("/")
    //             } else {
    //                 setRegID(document.data().registration_id);
    //             }
    //         }).catch((error: any) => navigate("/"))
    // }, [refId])
    const { width } = useViewport();
    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };


    const DrawerContent = () => {
        const [uploadFile, setUploadFile] = useState<any>();
        const props: UploadProps = {
            beforeUpload: (file: any, _) => {
                const compressedFile = ImageCompressor.uploadImage(file, setUploadFile);
                return compressedFile;
            },
            accept: 'image/jpg, image/png, image/jpeg',
            onRemove: (file: any) => {
                setUploadFile(null);
            },
            listType: "text",
            previewFile: uploadFile,
        };
        return (
            <Row wrap gutter={32}>
                <Col><a href={"https://okcr.in/06ALwwW"} target={"_blank"}>
                    <QRCode value={"https://okcr.in/06ALwwW"} icon={LOGO} /></a></Col>
                <Col style={{ marginTop: 24 }}>
                    <Form onFinish={(val) => {
                        console.log("Drawer submit: ", val)
                        setLoading(true);
                        customUpload({
                            onError: () => message.error("Error uploading in firebase", 5),
                            onSuccess: (downloadURL: string) => {
                                message.success(`Payment transaction recorded successfully for: ${regID}`, 5);
                                createPayment(
                                    downloadURL,
                                    regID,
                                    setLoading,
                                    () => { setOpen(false); message.success("Payment prrof uploaded successfully", 5) },
                                    () => { message.error("Error uploading image. Please try again.", 5) },
                                );
                                setOpen(false)
                                setUploadFile(null)
                                setLoading(false)
                            },
                            file: uploadFile,
                        });
                    }}>

                        <Row><Typography.Text strong style={{ fontSize: width > 768 ? 20 : 16 }}>{t('drawer.subtitle')}</Typography.Text></Row>
                        <Row>{t('drawer.subtitle2')}</Row>
                        <br />
                        <Alert showIcon message={t('drawer.message')} type="warning" style={{ width: "fit-content" }} />
                        <Form.Item name={"image"} required hasFeedback>
                            <Upload  {...props}>
                                <Button style={{ marginTop: 24 }} icon={<UploadOutlined />}>{t('drawer.button')}</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item>
                            {uploadFile && <Button type="primary" htmlType="submit" loading={loading}>Submit</Button>}
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        )
    };

    return (
        <>
            {loading ? <Skeleton /> :
                <>
                    <Drawer
                        title={t('drawer.title')}
                        style={{ backgroundColor: "#fcf6a9" }}
                        placement="bottom"
                        width={"100%"}
                        open={open}
                        closable={true}
                        maskClosable={false}
                        onClose={onClose}
                        headerStyle={{ backgroundColor: "#eae04f" }}
                    // onClose={onClose}
                    >
                        <DrawerContent />
                    </Drawer>
                    <Result
                        status="success"
                        title={t('title')}
                        subTitle={<Typography.Text code copyable style={{ fontSize: width > 768 ? 30 : 20 }}>{regID}</Typography.Text>}
                        extra={[
                            <Button key="donate" type="primary" style={{ backgroundColor: "darkgreen" }} onClick={showDrawer}>
                                {t('donate')}
                            </Button>,
                            <Link key="home" to="/"><Button type="primary">{t('home')}</Button></Link>,
                        ]}
                    />
                </>
            }</>
    )
}
//href="https://okcr.in/06ALwwW"
