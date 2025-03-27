const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const port = process.env.port || 1337;

const app = express();
app.get('/products', listProducts);

app.listen(port, () => console.log(`server listening in port ${port}`));

async function listProducts(req, res) {
    const productsFile = path.join(__dirname, './products.json');
    try {
        const data = await fs.readFile(productsFile);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(JSON.parse(data));
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
}

