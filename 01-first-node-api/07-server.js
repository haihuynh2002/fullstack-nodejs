const fs = require('fs');
const express = require('express');
const EventEmitter = require('events');

const port = process.env.port || 1337;

const app = express()
const chatEmit = new EventEmitter();
const logPath = './log.txt';

app.get('/', respondText);
app.get('/json', respondJson);
app.get('/static/*', respondStatic);
app.get('/chat', respondChat);
app.get('/sse', respondSSE);

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
    fs.createReadStream(filename)
    .on('error', () => respondNotFound(req, res))
    .pipe(res);
}

function respondChat(req, res) {
    const { message = '' } = req.query;

    fs.appendFile(logPath, message + '\n', err => {
        if (err) throw err;
    });
    chatEmit.emit('message', message);
    res.end();
}

function respondSSE(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive'
    });

    const onMessage = msg => res.write(`data: ${msg}\n\n`);
    chatEmit.on('message', onMessage);

    fs.readFile(logPath, {encoding: 'utf8'},  (err, data) => {
        if(err) throw err;
        console.log('log data');
        data.split('\n').forEach(message => {
            res.write(`data: ${message}\n\n`);
        });
    })

    res.on('close', function() {
        chatEmit.off('message', onMessage);
    })
}

app.listen(port, () => console.log(`Server listening in port ${port}`));