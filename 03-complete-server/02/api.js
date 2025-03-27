const Products = require('./products');
const Orders = require('./orders');
const Users = require('./users');
const { autoCatch } = require('./lib/auto-catch');

module.exports = autoCatch({
    listProducts,
    getProduct,
    createProduct,
    editProduct,
    deleteProduct,
    listOrders,
    createOrder,
    getOrder,
    createUser,
    listUsers
})

async function createUser(req, res, next) {
    const user = await Users.create(req.body);
    const { username, email } = user;
    res.json({ username, email });
}

async function listUsers(req, res, next) {
    if(!req.isAdmin) return forbidden(next);

    const { offset, limit } = req.query;
    res.json(await Users.list({
        offset: Number(offset),
        limit: Number(limit)
    }))
}

async function listOrders(req, res) {
    const { offset, limit, productId, status } = req.query;
    const opts = {
        offset: Number(offset),
        limit: Number(limit),
        productId,
        status
    }


    if(!req.isAdmin) {
        const user = await Users.get(req.user.username);
        opts.buyerEmail = user.email;
    }

    const orders = await Orders.list(opts)
    res.json(orders);
}

async function createOrder(req, res) {
    const fields = req.body;
    if (!req.isAdmin) fields.username = req.user.username;

    res.json(await Orders.create(fields));
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

async function createProduct(req, res, next) {
    if(!req.isAdmin()) return forbidden(next);

    const product = await Products.create(req.body);
    res.json(product);
}

async function editProduct(req, res) {
    if (!req.isAdmin) return forbidden(next)

    const change  = req.body;
    const product = await Products.edit(req.params.id, change);
    res.json(product);
}

async function deleteProduct(req, res) {
    if (!req.isAdmin) return forbidden(next)

    const product = await Products.remove(req.params.id);
    res.json({ success: true });
}

function forbidden(next) {
    const err = new Error('Forbidden');
    err.statusCode = 403
    next(err)
}


