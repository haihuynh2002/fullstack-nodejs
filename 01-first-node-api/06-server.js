const fs = require('fs');
const express = require('express');

const port = process.env.port || 1337;

const app = express()

app.get('/', respondText);
app.get('/json', respondJson);
app.get('/static/*', respondStatic);

function respondText (req, res) {
    res.end('Hello world!');
};

function respondJson (req, res) {
    res.json({text: 'hi', numbers: [1,2,3]});
};

function respondNotFound (req, res) {
    res.writeHead(404, {
        'Content-Type': 'text/plain'
    });
    res.end('Not found');
}

function respondEcho(req, res) {
    const { input = '' } = querystring.parse(
        req.url
        .split('?')
        .slice(1)
        .join('')
    );

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
        normal: input,
        shouty: input.toUpperCase(),
        characterCount: input.length,
        backwards: input.split('').reverse().join('')
    }));
}

function respondStatic(req, res) {
    const filename = `${__dirname}/public/${req.params[0]}`;
    console.log(filename);
    fs.createReadStream(filename)
    .on('error', () => respondNotFound(req, res))
    .pipe(res);
}

app.listen(port, () => console.log(`Server listening in port ${port}`));