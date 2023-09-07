import { DownOutlined } from "@ant-design/icons"
import { Typography, Menu, Dropdown, MenuProps, Space, Button } from "antd"
import Sider from "antd/es/layout/Sider"
import { useCallback, useState } from "react"
import { RxPerson } from "react-icons/rx"
import { BsPerson, BsPersonFill, BsTable } from "react-icons/bs"
import { MdDetails, MdLogout, MdPayment, MdPerson } from "react-icons/md"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { GiHamburgerMenu } from 'react-icons/gi'
import { TbListDetails, TbHome2, TbLogout, TbLogin } from 'react-icons/tb'
import { logout } from "../database/authUtil"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../database/firebaseUtil"

export const Navigation: React.FC<any> = ({ collapsed }) => {

    const [user] = useAuthState(auth);
    return (
        <Sider collapsible collapsed={collapsed} style={{ padding: 0 }}>
            <Typography.Title style={{ textAlign: 'center', fontSize: 24, color: 'white' }}>{collapsed ? null : "GRPAC"}</Typography.Title>
            <Menu
                style={{ minHeight: "90vh" }}
                theme="dark"
                selectable={false}
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
                        {
                            label: (user ? 'Logout' : 'Log in'),
                            icon: (user ? <Link to="/user" onClick={() => logout()}><TbLogout /></Link> : <Link to="/user"><TbLogin /></Link>),
                            key: 3
                        }
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
                    key: '3-1',
                    label: 'User Profile',
                    icon: <TbListDetails />
                },
                {
                    key: '3-2',
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
                case "3-2":
                    logout();
                    navigate("/user");
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