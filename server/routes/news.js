const router = require("express").Router();
const fetch = require('node-fetch');
const { parse } = require('node-html-parser');
const puppeteer = require("puppeteer");

const searchApiTopicWise = {
    "Sports": "https://news.google.com/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRFp1ZEdvU0JXVnVMVWRDR2dKSlRpZ0FQAQ?hl=bn&gl=IN&ceid=IN:bn",
}

const baseUrl = 'https://news.google.com/';
const searchQuery = (query) => '/search?q=' + query + '&hl=bn&gl=IN&ceid=IN:bn';
const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
};

class News {
    constructor(title = "", thumbnail = "", publisherLogo = "", publisher = "", publishedAt = 0, url = "", category = "") {
        this.title = title;
        this.thumbnail = thumbnail;
        this.publisherLogo = publisherLogo;
        this.publisher = publisher;
        this.publishedAt = publishedAt;
        this.category = category;
        this.url = url;
        if (url.startsWith('./'))
            this.url = "https://news.google.com" + url.substring(1);
        this.related = [];
    }
}

const getDetails = (element) => {
    const title = element.querySelector('h4').textContent;
    const thumbnail = element.querySelector('figure > img').getAttribute('src');
    const publisherLogo = element.querySelector('div > img').getAttribute('src');
    const publisher = element.querySelector('div > img').nextSibling.textContent;
    const publishedAt = element.querySelector('time').textContent;
    var url = element.querySelector('a').getAttribute('href');
    const news = new News(title, publisherLogo, thumbnail, publisher, publishedAt, url);
    if (url)
        return news;
    return new News();
}

const crawlGoogleLink = async (topic) => {
    const googleLink = "https://news.google.com/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRFp1ZEdvU0JXVnVMVWRDR2dKSlRpZ0FQAQ?hl=bn&gl=IN&ceid=IN:bn"
    const response = await fetch(googleLink, { headers: headers })
    const body = await response.text();
    const html = parse(body)
    const figures = html.querySelectorAll(' article > figure ');
    const articles = [];
    console.log("length: ", figures.length);
    figures.forEach((item) => {
        const mainArticle = item.parentNode;
        const relatedNews = [];
        if (item.nextSibling !== undefined) {
            const relatedArticles = mainArticle.nextSibling.querySelectorAll("article");
            console.log("related", relatedArticles.length)
            relatedArticles.forEach((itemNode) => {
                const title = itemNode.querySelector('h4').textContent;
                const publisherLogo = itemNode.querySelector('img').getAttribute('src');
                const publisher = itemNode.querySelector('img').nextSibling.textContent;
                const publishedAt = itemNode.querySelector('time').textContent;
                relatedNews.push({ title, publisherLogo, publisher, publishedAt })
            })
        }
        const mainNews = getDetails(mainArticle)
        mainNews.related = relatedNews;
        articles.push(mainNews)
    })
    return ({ 'result': articles });

}

router.get('/feed', async (req, res) => {
    try {
        const topic = req.params['topic']
        const result = await crawlGoogleLink(topic);
        res.status(200).json(result)
    } catch (error) {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: "error fetching feed from google: " + error.message });
        }
    }
});


module.exports = router;