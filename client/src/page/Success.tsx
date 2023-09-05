import { Button, Result, Skeleton, Typography } from "antd"
// import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"
import { checkUserExists } from "../database/firebaseUtil";
import { useViewport } from "../util";
import { IoCopyOutline } from 'react-icons/io5'
// import { updateRecord } from "../database/firebaseUtil";

export const Success: React.FC<any> = () => {
    const { refId } = useParams();
    const [loading, setLoading] = useState(true);
    const [regID, setRegID] = useState("");
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
    useEffect(() => {
        checkUserExists(refId as string)
            .then((document: any) => {
                setLoading(false)
                if (!document.exists()) {
                    navigate("/")
                } else {
                    setRegID(document.data().registration_id);
                }
            }).catch((error: any) => navigate("/"))
    }, [refId])
    const { width } = useViewport();

    return (
        <>
            {loading ? <Skeleton /> :
                <Result
                    status="success"
                    title={`Successfully Registered in GRPAC with reference number: `}
                    subTitle={<Typography.Text code copyable={{
                        icon: <IoCopyOutline size={24} />,
                    }} style={{ fontSize: width > 768 ? 30 : 20 }}>{regID}</Typography.Text>}
                    extra={[
                        <Button key="donate" type="primary" >
                            <Typography.Link href="https://okcr.in/06ALwwW" target="_blank">Donate now</Typography.Link>
                        </Button>,
                        <Link key="home" to="/"><Button type="primary">Go to Home</Button></Link>,
                    ]}
                />
            }</>
    )
}
