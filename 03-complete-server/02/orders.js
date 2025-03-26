const db = require('./db');
const {isEmail} = require('validator');
const cuid = require('cuid');

module.exports = {
    list,
    get,
    create
}

const Order = db.model('Order', {
    _id: { type: String, default: cuid },
    buyerEmail: emailSchema({ required: true }),
    products: {
        type: [String],
        ref: 'Product',
        index: true,
        required: true
    },
    status: {
        type: String,
        index: true,
        default: 'CREATED',
        enum: ['CREATED', 'PENDING', 'COMPLETED']
    }
})

function emailSchema(opts = {}) {
    const { required } = opts;

    return {
        type: String,
        required: !!required,
        validate: {
            validator: isEmail,
            message: props => `${props} is not a valid email`
        }
    }
}

async function list(opts = {}) {
    const {limit, offset} = opts;

    const order = await Order.find({})
    .sort({ _id: 1 })
    .skip(offset)
    .limit(limit)

    return order;
}

async function get(_id) {
    const order = await Order.findById(_id)
    .populate('products')
    .exec();

    return order;
}

async function create(fields) {
    const order = await new Order(fields).save();
    return order;
}