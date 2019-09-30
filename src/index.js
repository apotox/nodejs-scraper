import { scraper } from "./scraper";
const _ = require('lodash')
var http = require('http');



const search = "IoT"

http.createServer(async (req, res) => {


    console.log("start new scraper")
    let array = await scraper({
        max: 2,
        search
    });


    if (array.length == 0) {

        res.write(`no ${search} word!`); //write a response to the client
        res.end(); //end the response

    } else {

        
        let article = array[0]

        console.log(article.publicUrl)

            let html = article.content.replace(new RegExp(`(${search})`, "g"), "<span style='background-color:yellow'>$1</span>")
           
            res.write(`
            <html>
                <head>
                    <title>${article.title}</title>
                </head>
                <body>
                    ${html}
                </body>
            </html>
            `);
        

        
        res.end(); //end the response
    }






}).listen(8080); //the server object listens on port 8080


