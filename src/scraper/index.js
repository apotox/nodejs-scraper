
const fetch = require('node-fetch');
const cheerio = require('cheerio')
const _ = require('lodash')
const target = "https://www.chevron.com"


export const scraper = async ({ max,search }) =>{

    let scrapedArticles = 0
    let currentpage = 1
    let scraped = []
 

    while (true) {

        let html = await fetchHTML(`${target}/stories?page=${currentpage}`)
        let data = await scrapeUrls({ html })

        if (data.count == 0) {
            console.log("no more pages")
            return (scraped)
        }

        let articles = await Promise.all(data.urls.map(url => {
            return scrapeArticle({ url,search })
        }));

        let iotArticles = _.filter(articles, (article) => {
            return article != null
        })

        if (iotArticles.length > 0) {
            scrapedArticles += iotArticles.length
            scraped = scraped.concat(iotArticles)
        }

        if (scrapedArticles < max) {
            currentpage++
            console.log("next page ", currentpage, scrapedArticles)
        } else {
            return (scraped)
        }
    }

}

//scrapeUrls scrape url in single page
const scrapeUrls = async ({ html, index }) => {

    let $ = cheerio.load(html)

    let links = $(".stories-view a[href^='/stories/']")

    //use obj to prevent url-duplication
    let urls = links.toArray().reduce((obj, curr) => {
        //looking for items href
        obj[curr.attribs["href"]] = ""
        return obj
    }, {})

    return {
        urls: _.keys(urls),
        count: _.keys(urls).length
    }
}

//scrapeUrls scrape article content
const scrapeArticle = async ({ url,search }) => {
    let publicUrl = `${target}${url}`
    let html = await fetchHTML(publicUrl)
    let $ = cheerio.load(html)
    let content = $("body").first().text()


    //let indices = getIndices(search,content)
   
    if(!new RegExp(search).test(content)){
        return null
    }

    return {
        content,
        title: $("title").text(),
        publicUrl
    }
}

const fetchHTML = async (url) => {
    return fetch(url)
        .then(r => r.text())
}
