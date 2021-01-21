const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartsSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },
    
    genre: {
        type: String,
        required: true
    },

});

const Carts = mongoose.model('Carts',cartsSchema);
module.exports = Carts;