const EventEmitter = require("events");
const http = require('http');

function createEventSource(url) {
    const source = new EventEmitter();

    http.get(url, res => {
        res.on('data', data => {
            const message = data.replace('/^data: /').replace('/\n\n/');
            source.emit('message', message);

            const eventType = message.match('/\?$/')? 'question': 'statement';
            source.emit(eventType, message);
        })
    })

    return source;
}

const source = createEventSource('http://localhost:1337/chat');
source.on('question', console.log);
