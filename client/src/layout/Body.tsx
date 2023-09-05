import { Card, Row } from "antd"
import { Content } from "antd/es/layout/layout"
import { createContext, useState } from "react";
import { RouterComponent } from "../routes"
import { Payment } from "../util/Payment";
import { paymentContext } from "../util/state";
import Banner from '../assets/banner.jpeg'

export const Body: React.FC<any> = () => {
    const [open, setOpen] = useState(false);
    const [uid, setUid] = useState();
    return (
        <Content style={{ margin: "16px", width: '100%', height: "85vh", overflow: 'scroll' }}>
            <Card style={{ marginRight: "32px" }}
                cover={<img alt="example" src={Banner} />}>
                <paymentContext.Provider value={{ open: open, setOpenModal: setOpen, uid: uid, setUid: setUid }}>
                    <Payment />
                    <RouterComponent />
                </paymentContext.Provider>
            </Card>
        </Content>
    )
}