import { Button, Result } from "antd"
import axios from "axios";
import { useState } from "react";
import { Link, useParams } from "react-router-dom"
import { updateRecord } from "../database/firebaseUtil";

export const Success: React.FC<any> = () => {
    const { refId } = useParams();
    const [loading, setLoading] = useState(false)
    const handlePayment = async (price: string) => {
        try {
            const orderURL = "http://localhost:8080/api/payment/orders";
            const { data: { data } } = await axios.post(orderURL, { amount: price });
            const options = {
                key: process.env.REACT_APP_RAZOR_PAY_KEY,
                amount: data.amount,
                currency: data.currency,
                order_id: data.id,
                name: "GRPAC",
                description: "Enter the amount of your choice minimum 100/-",
                image: 'https://indianrailways.gov.in/railwayboard/uploads/directorate/coaching/TAG_2022-23/TAG_2022.jpg',
                handler: async (res: any) => {
                    try {
                        const verifyURL = "http://localhost:8080/api/payment/verify";
                        // console.log(res)
                        await axios.post(verifyURL, res);
                        const paymentData = {
                            userRefId: refId,
                            donated: price,
                            payment_id: res.razorpay_payment_id,
                            at: new Date(),
                        }
                        updateRecord(paymentData, setLoading, null, null)
                    } catch (error) {
                        console.error(error)
                    }
                }

            }
            const rzpay = new (window as any).Razorpay(options);
            rzpay.open();
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <Result
            status="success"
            title={`Successfully Registered in GRPAC with reference number: ${refId}`}
            subTitle="if u want to donate some money for the cause please click the button below : "
            extra={[
                <Button type="primary" key="donate" onClick={() => handlePayment("32")}>
                    Donate now
                </Button>,
                <Link key="home" to="/"><Button >Go to Home</Button></Link>,
            ]}
        />
    )
}
