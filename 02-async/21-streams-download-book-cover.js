const fs = require('fs');
const https = require('https');
const fileUrl =
  'https://images.theconversation.com/files/45159/original/rptgtpxd-1396254731.jpg?ixlib=rb-4.1.0&q=45&auto=format&w=1356&h=668&fit=crop';



https.get(fileUrl, res => res.pipe(fs.createWriteStream('book.png').on('finish', () => {
    console.log('file saved');
})));