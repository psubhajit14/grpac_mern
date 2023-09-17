import { Avatar, Typography } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoMdArrowDroprightCircle } from 'react-icons/io'

var relativeTime = require('dayjs/plugin/relativeTime')

dayjs.extend(relativeTime)

const NewsFeed = () => {
    const [t] = useTranslation('common', { keyPrefix: 'feed' });
    const today = dayjs(new Date());

    useEffect(() => {
        // googleNews.initialize((data: any) => console.log(data));
        // googleNews.addCountryCode('IN');
        // setInterval(googleNews.refresh, 1000 * 60 * 60);

        // googleNews.search('MODI', 'IN').then((result: any) => {
        //     console.log("result", result)
        // }).catch(() => {

        // })
    }, [])


    return (
        <>
            <Typography.Title level={3} style={{ margin: '0px 0px 5px 0px', fontWeight: 'bold' }}>{t('title')}</Typography.Title>
            <Typography.Text style={{ color: 'grey' }}>{today.format('dddd, MMMM D, YYYY')}</Typography.Text>
            <div style={{ display: 'flex', margin: '20px 0px', justifyContent: 'space-between', alignItems: 'center', color: '#1966DB' }}>
                <Typography.Title level={3} style={{ margin: 0, color: '#1966DB', fontWeight: 400 }}>{t('subTitle')}</Typography.Title>
                <IoMdArrowDroprightCircle size={'28px'} />
            </div>
        </>)
}

export default NewsFeed;