import { Button, Layout, Result } from "antd";
import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import { DataGrid } from "./page/DataGrid";
import { Login } from "./page/Login";
import { RegisterForm } from "./page/RegisterForm";
import { Success } from "./page/Success";
import { PaymentDetails } from "./page/PaymentDetails";
import NewsFeed from "./page/NewsFeed";

export const RouterComponent: React.FC<any> = () => {
    return (
        <Routes>
            <Route index element={<RegisterForm />} />
            <Route path="dashboard" element={<DataGrid />} />
            <Route path="payment" element={<PaymentDetails />} />
            <Route path="user" element={<Login />} />
            <Route path="news/feed" element={<NewsFeed />} />
            <Route path="success/:refId" element={<Success />} />
            <Route path="*" element={<Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={<Button type="primary"><Link to="/">Back Home</Link></Button>}
            />} />
        </Routes>
    )
}