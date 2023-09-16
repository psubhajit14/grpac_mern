import { Typography, Menu, Dropdown, MenuProps } from "antd"
import Sider from "antd/es/layout/Sider"
import { BsTable } from "react-icons/bs"
import { MdLogin, MdLogout, MdPayment } from "react-icons/md"
import { FaRegNewspaper } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import { GiHamburgerMenu } from 'react-icons/gi'
import { TbHome2, TbLogout, TbLogin } from 'react-icons/tb'
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
                            label: 'Payment Details',
                            icon: <Link to="/payment"> <MdPayment /></Link>,
                            key: 3,
                        },
                        {
                            label: 'News',
                            icon: <Link to="/news/feed"> <FaRegNewspaper /></Link>,
                            key: 4,
                        },
                        {
                            label: (user ? 'Logout' : 'Log in'),
                            icon: (user ? <Link to="/user" onClick={() => logout()}><TbLogout /></Link> : <Link to="/user"><TbLogin /></Link>),
                            key: 5
                        }
                    ]} >
            </Menu >
        </Sider>

    )
}

export const NavigationMobile: React.FC<any> = () => {
    const navigate = useNavigate();
    const [user] = useAuthState(auth);

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
            label: 'Payment Details',
            icon: <MdPayment size={16} />,
            key: 3,
        },
        {
            label: 'News',
            icon: <FaRegNewspaper size={16} />,
            key: 4,
        },
        {
            label: user !== null ? 'Logout' : 'Login',
            icon: user !== null ? <MdLogout /> : <MdLogin />,
            key: 5
        }
    ]
    const menuProps = {
        items,
        onClick: (e: any) => {
            // console.log(e.key)
            switch (e.key) {
                case "1":
                    navigate("/");
                    break;
                case "2":
                    navigate("/dashboard");
                    break;
                case "3":
                    navigate("/payment");
                    break;
                case "4":
                    navigate("/news/feed");
                    break;
                case "5":
                    if (user) {
                        logout();
                    }
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