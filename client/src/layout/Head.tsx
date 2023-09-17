import { Button, Row, Switch, theme, Typography } from "antd"
import { Header } from "antd/es/layout/layout";
import { AiOutlineMenuUnfold, AiOutlineMenuFold } from "react-icons/ai"
import { useViewport } from "../util";
import { NavigationMobile } from "./Navigation";
import LOGO from '../assets/logo.png'
import { useTranslation } from "react-i18next";

export const Head: React.FC<any> = ({ collapsed, setCollapsed }) => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const { width } = useViewport();
    const { i18n } = useTranslation();
    return (
        <Header style={{
            background: colorBgContainer,
            padding: (width > 768) ? 0 : 24,
            top: 0,
            height: 56,
            zIndex: 1,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: "space-between"
        }}>
            {(width > 768) ? <div style={{ width: '100%', display: "flex", gap: 8, alignItems: "center", justifyContent: "space-between" }}>
                <Button
                    type="text"
                    icon={collapsed ? <AiOutlineMenuUnfold /> : <AiOutlineMenuFold />}
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                        fontSize: '24px',
                        width: 64,
                        height: 64,
                    }}

                /><Switch style={{ marginRight: 24 }} checkedChildren="EN" unCheckedChildren="বাংলা" defaultChecked onChange={(checked, _) => i18n.changeLanguage(checked ? 'en' : 'bn')} /> </div> :
                <Row style={{ width: "90vw", height: 56, alignItems: "center", justifyContent: "space-between" }}>
                    <img src={LOGO} height={"90%"} />
                    <Typography.Title style={{ fontSize: 24 }} >
                        GRPAC
                    </Typography.Title>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <Switch checkedChildren="EN" unCheckedChildren="বাং" defaultChecked onChange={(checked, _) => i18n.changeLanguage(checked ? 'en' : 'bn')} />
                        <NavigationMobile />
                    </div>
                </Row>}
        </Header>
    )
}