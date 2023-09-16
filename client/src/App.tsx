import React, { useState } from 'react';
import { ConfigProvider, Layout, Typography } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import {
  BrowserRouter, Link,
} from "react-router-dom";
import { useViewport, ViewportProvider } from './util';
import { Body, Head, Navigation } from './layout';
import { DiCodeigniter } from 'react-icons/di'

export const App: React.FC<any> = () => {

  const { width } = useViewport();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ConfigProvider theme={{
      token: {
        colorPrimary: 'black',
      },
      components: {
        Input: {
          colorBgContainer: 'transparent',
          colorBorder: 'grey',
        },
        Select: {
          colorTextPlaceholder: 'black',
          colorBgContainer: 'transparent',
          colorBorder: 'grey',
        },
      }
    }}>
      <BrowserRouter>
        <ViewportProvider>
          <Layout>
            {width > 768 && <Navigation collapsed={collapsed} />}
            <Layout>
              <Head collapsed={collapsed} setCollapsed={setCollapsed} />
              <Body style={{ backGroundColor: "white" }} />
              <Footer style={{ textAlign: 'center', width: '100%', }}>
                <DiCodeigniter style={{ fontSize: 16 }} color='crimson' />
                <Typography.Text> Developed by Subhajit Paul. Please visit
                  <Link target="_blank" to="https://github.com/psubhajit14/grpac_mern"><b> here </b></Link>
                  to know more.
                </Typography.Text>
              </Footer>
            </Layout>
          </Layout>
        </ViewportProvider>
      </BrowserRouter>
    </ConfigProvider >
  )
}

export default App;
