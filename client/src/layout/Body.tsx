import { Card } from "antd"
import { Content } from "antd/es/layout/layout"
import { useState } from "react";
import { RouterComponent } from "../routes"
import Banner from '../assets/banner.jpeg'
import { useViewport } from "../util";

export const Body: React.FC<any> = () => {
    const [open, setOpen] = useState(false);
    const [uid, setUid] = useState();
    const { width } = useViewport();
    return (
        <Content style={{ width: '100%', height: "100%", padding: `8px ${width > 768 ? "24px" : "0px"}`, overflow: 'scroll', backgroundColor: "white" }}>
            <Card style={{ backgroundColor: "#fcf6a9", }}
                cover={<img alt="example" src={Banner} style={{ boxShadow: "0px 4px 20px rgba(0,0,0,0.2)" }} />}>
                <RouterComponent />
            </Card>
        </Content>
    )
}