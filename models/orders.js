const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrdersSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },
    
    user_id : {
        type: String,
        required: true
    },

    user_name : {
        type: String,
        required: true
    }

});

const Orders = mongoose.model('Orders',OrdersSchema);
module.exports = Orders;