const router = require("express").Router();
const fetch = require('node-fetch');
const { parse } = require('node-html-parser');



const baseUrl = 'https://news.google.com/';
const searchQuery = (query) => '/search?q=%27modi' + query + '%27&hl=bn&gl=IN&ceid=IN:bn';
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
        if (url.startsWith('./'))
            this.url = "https://news.google.com" + url.substring(1);
        this.related = [];
    }
}

const getDetails = (element) => {
    const title = element.querySelector('h4').textContent;
    console.log('title: ', title)
    const thumbnail = element.querySelector('figure > img').getAttribute('src');
    const publisherLogo = element.querySelector('div > img').getAttribute('src');
    const publisher = element.querySelector('div > a').textContent;
    const publishedAt = element.querySelector('time').textContent;
    var url = element.querySelector('a').getAttribute('href');
    const news = new News(title, publisherLogo, thumbnail, publisher, publishedAt, url);
    console.log("news: ", news)
    if (url)
        return news;
    return new News();
}

const crawlGoogleLink = async (query) => {
    const googleLink = baseUrl + searchQuery('India');
    const response = await fetch(googleLink, { headers: headers })
    const body = await response.text();
    const html = parse(body)
    console.log('abc', html.innerText)
    // console.log(html)
    const figures = html.querySelectorAll('article > figure');
    const articles = [];
    // console.log(figures)
    // console.log(figures.length);
    figures.forEach((item) => {
        const mainArticle = item.parentNode;
        const relatedArticles = item.nextSibling.querySelectorAll("article");
        const mainNews = getDetails(mainArticle)
        const relatedNews = [];
        // relatedArticles.forEach((item) => {

        // })
        articles.push(mainNews)
    })
    // var articles = [];
    // articlesGrid.each((index, article) => {
    //     try {
    //         var mainArticle = article.children;
    //         var relatedArticles = $(mainArticle.find('.SbNwzf'));
    //         var thumbnail = $(mainArticle.find('img')[0]).attr('src')
    //         var mainNews = new getDetails(mainArticle, 'h3');
    //         if (thumbnail) {
    //             mainNews.thumbnail = thumbnail;
    //         }
    //         mainNews.category = "random";
    //         relatedArticles.each((index, elm) => {
    //             var relatedNews = getDetails($(elm), 'h4');
    //             if (relatedNews.title) {
    //                 relatedNews.category = topic.name;
    //                 mainNews.related.push(relatedNews);
    //             }
    //         })
    //         if (mainNews.title)
    //             articles.push(mainNews);

    //     } catch (err) {
    //         throw new Error("parsing Error, " + err.message)
    //     }
    // })
    return ({ 'result': articles });

}

router.get('/feed', async (req, res) => {
    try {
        const result = await crawlGoogleLink("Modi");
        res.status(200).json(result)
    } catch (error) {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: "error fetching feed from google: " + error.message });
        }
    }
});


module.exports = router;