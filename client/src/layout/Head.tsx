import { Button, theme } from "antd"
import { Header } from "antd/es/layout/layout";
import { AiOutlineMenuUnfold, AiOutlineMenuFold } from "react-icons/ai"
import { useViewport } from "../util";

export const Head: React.FC<any> = ({ collapsed, setCollapsed }) => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const { width } = useViewport();
    return (
        <Header style={{ padding: 0, background: colorBgContainer }}>
            {(width > 768) && <Button
                type="text"
                icon={collapsed ? <AiOutlineMenuUnfold /> : <AiOutlineMenuFold />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                    fontSize: '24px',
                    width: 64,
                    height: 64,
                }}
            />}
        </Header>
    )
}