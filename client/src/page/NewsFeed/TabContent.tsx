import { Card, Carousel, Divider, Image, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useViewport } from "../../util";
import { FaNewspaper } from 'react-icons/fa'
import { useNavigate } from "react-router-dom";

const RelatedNewsContent = ({ relatedNews }: { relatedNews: any }) => {
    return (
        <a href={relatedNews.url} target="_blank">
        <div style={{ padding: '10px 15px' }}>
            <Typography style={{ fontWeight: 500, fontSize: '14px' }}>
                {relatedNews.title.length > 100 ? `${relatedNews.title.substring(0, 100)}...` : relatedNews.title}
            </Typography>

            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                <Image src={relatedNews.publisherLogo} width={10} loading="lazy"/>
                <Typography style={{ fontSize: '11px' }}>&nbsp;&nbsp;{relatedNews.publisher}</Typography>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '15px' }}>
                <Typography style={{ color: 'grey', fontSize: '11px' }}>{relatedNews.publishedAt}</Typography>
                <FaNewspaper size={'20px'} />
            </div>
        </div>
        </a>
    )
}

const TabContent = ({ pageContent }: { pageContent: any }) => {
    const { width } = useViewport();
    const [t] = useTranslation('common', { keyPrefix: 'feed' });
    return (
        <>
            {pageContent.length > 0 ?
                <>
                    {pageContent.map((contentItem: any, index: number) => {
                        return (<>
                            {index === 0 ? (
                                <>
                                    <Image src={contentItem.thumbnail} style={{ borderRadius: '15px', width: width > 415 ? '350px' : '80vw' }} loading="lazy"/>
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                                        <img srcSet={contentItem.publisherLogo} loading="lazy"/>
                                        <Typography>&nbsp;&nbsp;{contentItem.publisher}</Typography>
                                    </div>
                                    <a href={contentItem.url} target="_blank">
                                        <Typography.Title level={5} style={{ marginTop: '10px', marginBottom: '0px', cursor: 'pointer' }}>{contentItem.title}</Typography.Title>
                                    </a>
                                    <Typography style={{ marginTop: '10px', color: 'grey', fontSize: '12px' }}>{contentItem.publishedAt}</Typography>
                                    {contentItem.related.length > 0 &&
                                        <>
                                            <Typography style={{ marginTop: '15px', marginBottom: '10px', color: 'grey' }}>{t('relatedText')}</Typography>
                                            <Carousel autoplay style={{ boxShadow: '0px 5px 5px 0px rgba(0, 0, 0, 0.25)', backgroundColor: '#F3F2DF', cursor: 'pointer' }}>
                                                {contentItem.related.map((item: any) => <RelatedNewsContent relatedNews={item} />)}
                                            </Carousel>
                                        </>}
                                    {index !== pageContent.length && <Divider />}
                                </>
                            ) :
                                (
                                    <>
                                        <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                                            <img srcSet={contentItem.publisherLogo} loading="lazy"/>
                                            <Typography>&nbsp;&nbsp;{contentItem.publisher}</Typography>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <a href={contentItem.url} target="_blank">
                                                <div style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
                                                    <Typography style={{ fontSize: '13px', fontWeight: 600, marginTop: '10px', marginBottom: '0px' }}>{contentItem.title}</Typography>
                                                    <Typography style={{ marginTop: '10px', color: 'grey', fontSize: '12px' }}>{contentItem.publishedAt}</Typography>
                                                </div>
                                            </a>
                                            <Image src={contentItem.thumbnail} style={{ borderRadius: '5px', width: width > 415 ? '80px' : '25vw' }} loading="lazy"/>
                                        </div>
                                        {contentItem.related.length > 0 &&
                                            <>
                                                <Typography style={{ marginTop: '15px', marginBottom: '10px', color: 'grey' }}>{t('relatedText')}</Typography>
                                                <Carousel autoplay style={{ boxShadow: '0px 5px 5px 0px rgba(0, 0, 0, 0.25)', backgroundColor: '#F3F2DF', cursor: 'pointer' }}>
                                                    {contentItem.related.map((item: any) => <RelatedNewsContent relatedNews={item} />)}
                                                </Carousel>
                                            </>}
                                        {index !== pageContent.length && <Divider />}
                                    </>)}
                        </>)
                    })}
                </> :
                <div style={{ height: '200px' }}></div>
            }
        </>
    )
}

export default TabContent;