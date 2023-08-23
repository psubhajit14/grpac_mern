import { Typography, Menu } from "antd"
import Sider from "antd/es/layout/Sider"
import { useState } from "react"
import { AiOutlineHome } from "react-icons/ai"
import { BsTable } from "react-icons/bs"
import { MdPayment } from "react-icons/md"
import { Link } from "react-router-dom"

export const Navigation: React.FC<any> = ({ collapsed }) => {

    return (
        <Sider collapsible collapsed={collapsed} style={{ padding: 0 }}>
            <Typography.Title style={{ textAlign: 'center', fontSize: 24, color: 'white' }}>{collapsed ? null : "GRPAC"}</Typography.Title>
            <Menu
                theme='dark'
                defaultValue={1}
                items={[
                    {
                        label: 'Home',
                        icon: <Link to="/"><AiOutlineHome /></Link>,
                        key: 1,
                    },
                    {
                        label: 'Dashboard',
                        icon: <Link to="/dashboard"> <BsTable /></Link>,
                        key: 2,
                    },
                    {
                        label: 'Payment Details',
                        icon: <MdPayment />,
                        key: 3
                    }
                ]}>
            </Menu>
        </Sider>

    )
}