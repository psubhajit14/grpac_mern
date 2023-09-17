const router = require("express").Router();
const fetch = require('node-fetch');
const { parse } = require('node-html-parser');
const puppeteer = require("puppeteer");

const searchApiTopicWise = {
    "Sports": "https://news.google.com/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRFp1ZEdvU0JXVnVMVWRDR2dKSlRpZ0FQAQ",
    "India": "https://news.google.com/topics/CAAqIQgKIhtDQkFTRGdvSUwyMHZNRE55YXpBU0FtSnVLQUFQAQ",
    "Business": "https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtSnVHZ0pKVGlnQVAB",
    "Entertainment": "https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNREpxYW5RU0FtSnVHZ0pKVGlnQVAB",
    "World": "https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx1YlY4U0FtSnVHZ0pKVGlnQVAB"
}
const queryBuilder = (lang) => `?hl=${lang}&gl=IN&ceid=IN:${lang}`
const baseUrl = 'https://news.google.com/';
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
    const publisherLogo = element.querySelector('div > img').getAttribute('srcSet');
    const publisher = element.querySelector('div > img').nextSibling.textContent;
    const publishedAt = element.querySelector('time').textContent;
    var url = element.querySelector('a').getAttribute('href');
    const news = new News(title, thumbnail, publisherLogo, publisher, publishedAt, url);
    if (url)
        return news;
    return new News();
}

const crawlGoogleLink = async (topic, language) => {
    const googleLink = searchApiTopicWise[topic] + queryBuilder(language);
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
                let publisherLogo = ""
                let publisher = ""
                if (itemNode.querySelector('img')) {
                    publisherLogo = itemNode.querySelector('img').getAttribute('srcSet');
                    publisher = itemNode.querySelector('img').nextSibling.textContent;
                }
                const publishedAt = itemNode.querySelector('time').textContent;
                let url = itemNode.querySelectorAll('a')[0].getAttribute('href')
                if (url.startsWith('./')) {
                    url = baseUrl + url.split('./')[1]
                }
                relatedNews.push({ title, publisherLogo, publisher, publishedAt, url })
            })
        }
        const mainNews = getDetails(mainArticle)
        mainNews.related = relatedNews;
        articles.push(mainNews)
    })
    return ({ 'result': articles });

}

router.get('/feed/:topic', async (req, res) => {
    try {
        const topic = req.params['topic'];
        const language = req.query['lang'];
        const result = await crawlGoogleLink(topic, language);
        res.status(200).json(result)
    } catch (error) {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: "error fetching feed from google: " + error.message });
        }
    }
});


module.exports = router;