const Products = require('./products');
const Orders = require('./orders');
const { autoCatch } = require('./lib/auto-catch');
const { off } = require('process');

module.exports = autoCatch({
    listProducts,
    getProduct,
    createProduct,
    editProduct,
    deleteProduct,
    listOrders,
    createOrder,
    getOrder
})

async function listOrders(req, res) {
    const { offset, limit } = req.query;
    res.json(await Orders.list({
        offset: Number(offset),
        limit: Number(limit)
    }))
}

async function createOrder(req, res) {
    res.json(await Orders.create(req.body));
}

async function getOrder(req, res) {
    const { id } = req.params;
    const order = await Orders.get(id);
    if(!order) return next();

    res.json(order);
}

async function listProducts(req, res) {
    const {offset = 0, limit = 1, tag} = req.query;
    res.json(await Products.list({
        offset: Number(offset),
        limit: Number(limit),
        tag
    }));
}

async function getProduct(req, res, next) {
    const { id } = req.params;
    const product = await Products.get(id);
    if(!product) return next();

    res.json(product);
}

async function createProduct(req, res) {
    const product = await Products.create(req.body);
    res.json(product);
}

async function editProduct(req, res) {
    const change  = req.body;
    const product = await Products.edit(req.params.id, change);
    res.json(product);
}

async function deleteProduct(req, res) {
    const product = await Products.remove(req.params.id);
    res.json({ success: true });
}


