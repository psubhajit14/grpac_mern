import { Button, Col, Dropdown, Row, Space, theme, Typography } from "antd"
import { Header } from "antd/es/layout/layout";
import { AiOutlineMenuUnfold, AiOutlineMenuFold, AiOutlineHome } from "react-icons/ai"
import { useViewport } from "../util";
import { Navigation, NavigationMobile } from "./Navigation";
import LOGO from '../assets/logo.png'
import { IoArrowDownOutline } from "react-icons/io5";
import { DownloadOutlined, DownOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { BsTable } from "react-icons/bs";
import type { MenuProps } from 'antd';

export const Head: React.FC<any> = ({ collapsed, setCollapsed }) => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const { width } = useViewport();

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
            {(width > 768) ? <Button
                type="text"
                icon={collapsed ? <AiOutlineMenuUnfold /> : <AiOutlineMenuFold />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                    fontSize: '24px',
                    width: 64,
                    height: 64,
                }}

            /> :
                <Row style={{ width: "90vw", height: 56, alignItems: "center", justifyContent: "space-between" }}>
                    <img src={LOGO} height={"90%"} />
                    <Typography.Title style={{ fontSize: 24 }} >
                        GRPAC
                    </Typography.Title>
                    <NavigationMobile />
                </Row>}
        </Header>
    )
}