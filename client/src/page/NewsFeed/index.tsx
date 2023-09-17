import { Avatar, Spin, Tabs, TabsProps, Typography } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoMdArrowDroprightCircle } from 'react-icons/io'
import TabContent from "./TabContent";
import { useViewport } from "../../util";

var relativeTime = require('dayjs/plugin/relativeTime')

dayjs.extend(relativeTime)

const NewsFeed = () => {
    const [selectedTab, setSelectedTab] = useState<string>('1');
    const [pageResponse, setPageResponse] = useState<any>({ 1: [], 2: [], 3: [], 4: [], 5: [] });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { width } = useViewport();
    const [t, i18n] = useTranslation('common', { keyPrefix: 'feed' });
    console.log('i18n:' , i18n)
    const today = dayjs(new Date());
    const newsCategories = [
        { key: '1', url: '/Sports', label: t('Sports') },
        { key: '2', url: '/Entertainment', label: t('Entertainment') },
        { key: '3', url: '/India', label: t('India') },
        { key: '4', url: '/World', label: t('World') },
        { key: '5', url: '/Business', label: t('Business') }
    ]

    const getNews = async (selectedTab: string) => {
        try {
            setIsLoading(true);
            const url = newsCategories.find((i: any) => i.key === selectedTab)?.url;
            const { status, data } = await axios.get(`https://grpac-mern.vercel.app/api/news/feed${url}?lang=${i18n.language}`)
            if (status === 200) {
                setIsLoading(false);
                setPageResponse({ ...pageResponse, [selectedTab]: data.result })
            }
        } catch (e: any) {
            setIsLoading(false);
        }
    }

    console.log('pageResponse.selectedTab: ', pageResponse[selectedTab])

    useEffect(() => {
        getNews(selectedTab);
    }, [selectedTab, i18n.language])

    const items = newsCategories.map((item: any) => (
        {
            key: item.key,
            label: item.label,
            children: <TabContent pageContent={pageResponse[selectedTab]} />
        }
    ))

    const getPadding = () => {
        if(width > 1070) return '200px'
        else if(width > 900 && width <= 1070) return '100px'
        else if(width > 768 && width <= 900) return '50px'
        else if(width > 650 && width <= 768) return '100px'
        else if(width > 500 && width <= 650) return '30px'
        else if(width < 500) return '7px'
    }

    return (
        <div style={{ position: 'relative', padding: `0px ${getPadding()}` }}>
            {isLoading && <Spin size="large" style={{
                margin: 0,
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }} />}
            <Typography.Title level={3} style={{ margin: '0px 0px 5px 0px', fontWeight: 'bold' }}>{t('title')}</Typography.Title>
            <Typography.Text style={{ color: 'grey' }}>{today.format('dddd, MMMM D, YYYY')}</Typography.Text>
            <div style={{ display: 'flex', margin: '20px 0px', justifyContent: 'space-between', alignItems: 'center', color: '#1966DB' }}>
                <Typography.Title level={3} style={{ margin: 0, color: '#1966DB', fontWeight: 400 }}>{t('subTitle')}</Typography.Title>
                <IoMdArrowDroprightCircle size={'28px'} />
            </div>
            <Tabs defaultActiveKey="1" items={items} onChange={(key: string) => setSelectedTab(key)} />
        </div>)
}

export default NewsFeed;