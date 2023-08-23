import { Card } from "antd"
import { Content } from "antd/es/layout/layout"
import { RouterComponent } from "../routes"

export const Body: React.FC<any> = () => {
    return (
        <Content style={{ margin: 16, width: '100%', height: '80vh', overflow: 'scroll' }}>
            <Card style={{ marginRight: "36px" }}>
                <RouterComponent />
            </Card>
        </Content>
    )
}