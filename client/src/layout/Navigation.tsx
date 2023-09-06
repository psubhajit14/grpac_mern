import { DownOutlined } from "@ant-design/icons"
import { Typography, Menu, Dropdown, MenuProps, Space, Button } from "antd"
import Sider from "antd/es/layout/Sider"
import { useState } from "react"
import { RxPerson } from "react-icons/rx"
import { BsPerson, BsPersonFill, BsTable } from "react-icons/bs"
import { MdDetails, MdLogout, MdPayment, MdPerson } from "react-icons/md"
import { Link, useNavigate } from "react-router-dom"
import { GiHamburgerMenu } from 'react-icons/gi'
import { TbListDetails, TbHome2 } from 'react-icons/tb'

export const Navigation: React.FC<any> = ({ collapsed }) => {

    return (
        <Sider collapsible collapsed={collapsed} style={{ padding: 0 }}>
            <Typography.Title style={{ textAlign: 'center', fontSize: 24, color: 'white' }}>{collapsed ? null : "GRPAC"}</Typography.Title>
            <Menu
                style={{ minHeight: "90vh" }}
                theme="dark"
                defaultValue={1}
                items={
                    [
                        {
                            label: 'Home',
                            icon: <Link to="/"><TbHome2 /></Link>,
                            key: 1,
                        },
                        {
                            label: 'Dashboard',
                            icon: <Link to="/dashboard"> <BsTable /></Link>,
                            key: 2,
                        },
                        // {
                        //     label: 'Payment Details',
                        //     icon: <MdPayment />,
                        //     key: 3
                        // }
                    ]} >
            </Menu >
        </Sider>

    )
}

export const NavigationMobile: React.FC<any> = () => {
    const navigate = useNavigate();
    const items: MenuProps['items'] = [
        {
            label: 'Home',
            icon: <TbHome2 size={16} />,
            key: 1,
        },
        {
            label: 'Dashboard',
            icon: <BsTable size={16} />,
            key: 2,
        },
        {
            label: 'User',
            icon: <RxPerson size={16} />,
            key: 3,
            children: [
                {
                    key: '2-1',
                    label: 'User Profile',
                    icon: <TbListDetails />
                },
                {
                    key: '2-2',
                    label: 'Logout',
                    icon: <MdLogout />
                },
            ],
        }
    ]
    const menuProps = {
        items,
        onClick: (e: any) => {
            console.log(e.key)
            switch (e.key) {
                case "1":
                    navigate("/");
                    break;
                case "2":
                    navigate("/dashboard");
                    break;
                default:
                    break;
            }
        }
    }
    return (
        <Dropdown menu={menuProps}>
            <GiHamburgerMenu size={24} />
        </Dropdown>
    )
}