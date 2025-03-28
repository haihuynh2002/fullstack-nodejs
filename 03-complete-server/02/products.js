const cuid = require('cuid');
const db = require('./db');
const { isURL } = require('validator');

module.exports = {
    list,
    get,
    create,
    edit,
    remove
}

const Product = db.model('Product', {
    _id: {type: String, default: cuid},
    description: {type: String, required: true},
    imgThumb: urlSchema({ required: true }),
    img: urlSchema({ required: true }),
    link: urlSchema(),
    userId: {type: String, required: true},
    userName: {type: String, required: true},
    userLink: urlSchema(),
    tags: {type: [String], index: true}
});

function urlSchema (opts = {}) {
    const { required } = opts
    return {
      type: String,
      required: !!required,
      validate: {
        validator: isURL,
        message: props => `${props.value} is not a valid URL`
      }
    }
}

async function list(opts = {}) {
    const {limit = 1, offset = 0, tag} = opts;
    const query = tag? { tag: tag }: {}
    
    const products = await Product.find(query)
    .sort({ _id: 1 })
    .skip(offset)
    .limit(limit);

    return products;
}

async function get(_id) {
    const product = await Product.findById(_id)
    return product;
}

async function create(fields) {
    const product = await new Product(fields).save();
    return product;
}

async function edit(_id, change) {
    const product = await get(_id);
    Object.keys(change).forEach((key) => product[key] = change[key]);
    await product.save();
    return product; 
}

async function remove(_id) {
    await Product.deleteOne({ _id });
}