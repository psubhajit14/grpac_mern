import { Card } from "antd"
import { Content } from "antd/es/layout/layout"
import { useCallback, useState } from "react";
import { RouterComponent } from "../routes"
import Banner from '../assets/banner.jpeg'
import { useViewport } from "../util";
import { useLocation } from "react-router-dom";

export const Body: React.FC<any> = () => {
    const [open, setOpen] = useState(false);
    const [uid, setUid] = useState();
    const { width } = useViewport();
    const location = useLocation();

    const getPadding = useCallback(() => {
        if (location.pathname.includes('/news')) {
            return `0px ${width > 768 ? "24px" : "0px"}`

        } else {
            return `8px ${width > 768 ? "24px" : "0px"}`

        }
    }, [location])
    console.log('location', location.pathname.includes('/news'))
    return (
        <Content style={{ width: '100%', height: "100%", padding: getPadding(), overflow: 'scroll', backgroundColor: "white" }}>
            <Card style={{ background: "linear-gradient(105deg, #FFFCD9 0%, rgba(255, 252.13, 214.62, 0.11) 91%)" }}
                cover={<img alt="example" src={Banner} style={{ boxShadow: "0px 4px 20px rgba(0,0,0,0.2)" }} />}>
                <RouterComponent />
            </Card>
        </Content>
    )
}