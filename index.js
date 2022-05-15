const PORT = 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

const articles = [];

const newspapers = [
    {
        name: 'theguardian',
        url: 'https://www.theguardian.com/books'
    },
    {
        name: 'telegraph',
        url: 'https://www.telegraph.co.uk/books/'
    }
]

newspapers.forEach(newspaper => {
    axios.get(newspaper.url).then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);

        $('a:contains("books")', html).each(function() {
            const title = $(this).text();
            const url = $(this).attr('href');

            articles.push({
                title, url, source: newspaper.name
            })
        })
    }).catch((err) => console.log(err));  
})

app.get('/', (req, res) => {
    res.json('Welcome to my Climate Changes API')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', async (req, res) => {
    const newspaperId = req.params.newspaperId;

    const newspaperUrl = newspapers.filter(newspaper => newspaper.name === newspaperId)[0].url

    axios.get(newspaperUrl).then(response => {
        const html = response.data;
        const $ = cheerio.load(html);

        const specificArticles = [];

        $('a:contains("books")', html).each(function() {
            const title = $(this).text();
            const url = $(this).attr('href');

            specificArticles.push({
                title, url
            })
        })
        res.json(specificArticles);
    }).catch((err) => console.log(err));  

})

app.listen(PORT, () => {
    console.log(`server running on POST ${PORT}`)
})
