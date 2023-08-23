import React, { useState } from 'react';
import { ConfigProvider, Layout, Space, Typography } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import {
  BrowserRouter, Link,
} from "react-router-dom";
import { useViewport, ViewportProvider } from './util';
import { Body, Head, Navigation } from './layout';
import { DiCodeigniter } from 'react-icons/di'

export const App: React.FC<any> = () => {

  const { width } = useViewport();
  const [collapsed, setCollapsed] = useState((width < 768));

  return (
    <ConfigProvider>
      <BrowserRouter>
        <ViewportProvider>
          <Layout>
            <Navigation collapsed={collapsed} />
            <Layout>
              <Head collapsed={collapsed} setCollapsed={setCollapsed} />
              <Body />
              <Footer style={{ textAlign: 'center' }}><DiCodeigniter style={{ fontSize: 16 }} color='crimson' /> <Typography.Text>Developed by Subhajit Paul and ____________ ___________. <br /> Please visit <Link target="_blank" to="https://github.com/psubhajit14/GRPAC">here</Link> to know more.</Typography.Text></Footer>
            </Layout>
          </Layout>
        </ViewportProvider>
      </BrowserRouter>
    </ConfigProvider >
  )
}

export default App;
