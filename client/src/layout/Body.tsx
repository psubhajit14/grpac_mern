import { Card, Row } from "antd"
import { Content } from "antd/es/layout/layout"
import { createContext, useState } from "react";
import { RouterComponent } from "../routes"
import { Payment } from "../util/Payment";
import { paymentContext } from "../util/state";
import Banner from '../assets/banner.jpeg'
import { useViewport } from "../util";

export const Body: React.FC<any> = () => {
    const [open, setOpen] = useState(false);
    const [uid, setUid] = useState();

    const { width } = useViewport();
    return (
        <Content style={{ width: '100%', height: "120vh", padding: `8px ${width > 768 ? "24px" : "0px"}`, overflow: 'scroll', backgroundColor: "white" }}>
            <Card style={{ backgroundColor: "#fcf6a9", }}
                cover={<img alt="example" src={Banner} style={{ boxShadow: "0px 4px 20px rgba(0,0,0,0.2)" }} />}>
                <paymentContext.Provider value={{ open: open, setOpenModal: setOpen, uid: uid, setUid: setUid }}>
                    <Payment />
                    <RouterComponent />
                </paymentContext.Provider>
            </Card>
        </Content>
    )
}