const http = require('http');
const querystring = require('querystring');

const port = process.env.port || 1337;

const server = http.createServer(function(req, res) {
    if(req.url === "/") return respondText(req, res);
    if(req.url === "/json") return respondJson(req, res);
    if(req.url.match(/^\/echo/)) return respondEcho(req, res);

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

server.listen(port);

console.log(`Server listening in port ${port}`);

