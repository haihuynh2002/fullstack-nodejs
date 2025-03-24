const http = require('http');
const querystring = require('querystring');
const fs = require('fs');

const port = process.env.port || 1337;

const server = http.createServer(function(req, res) {
    if(req.url === "/") return respondText(req, res);
    if(req.url === "/json") return respondJson(req, res);
    if(req.url.match(/^\/echo/)) return respondEcho(req, res);
    if(req.url.match(/^\/static/)) return respondStatic(req, res);

    respondNotFound(req, res);

});

function respondText (req, res) {
    res.end('Hello world!');
};

function respondJson (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({text: 'hi', numbers: [1,2,3]}));
};

function respondNotFound (req, res) {
    res.writeHead(404, {
        'Content-Type': 'text/plain'
    });
    res.end('Not found');
}

function respondEcho(req, res) {
    const { input = '' } = req.query;

    res.json({
        normal: input,
        shouty: input.toUpperCase(),
        characterCount: input.length,
        backwards: input.split('').reverse().join('')
    });
}

function respondStatic(req, res) {
    const filename = `${__dirname}/public${req.url.split("/static")[1]}`;
    console.log(filename);
    fs.createReadStream(filename)
    .on('error', () => respondNotFound(req, res))
    .pipe(res);
}

server.listen(port);

console.log(`Server listening in port ${port}`);

