import { scraper } from "./scraper";
const _ = require('lodash')
var http = require('http');




//search for the word ??
const search = "IoT"




http.createServer(async (req, res) => {

    let config = {
        max: 10,
        search
    }
    console.log("start new scraper",config)

    //scrape array of articles
    let articles = await scraper(config);

    if (articles.length == 0) {
        res.write(`no ${search} word!`); //write a response to the client
        res.end(); //end the response
    } else {
        
        let article = articles[0]
        console.log('frist page url',article.publicUrl)

            let html = article.content.replace(new RegExp(`(${search})`, "g"), "<span style='background-color:yellow'>$1</span>")
            res.write(`
            <html lang="en-US" prefix="og: http://ogp.me/ns#">
                <head>
                    <meta charset="UTF-8">
                    <title>${article.title}</title>
                </head>
                <body>
                    
                    <article>
                    <h3>${article.title}</h3>
                    ${html}
                    </article>

                    <style>
                    article{
                        max-width:920px;
                        margin:0 auto;
                        padding:4px;
                    }
                    </style>
                </body>
            </html>
            `);
        res.end(); //end the response
    }

}).listen(8080); //the server object listens on port 8080


