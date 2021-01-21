const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const booksSchema = new Schema({
 title: {
     type: String,
     required: true
 },
 genre: {
    type: String,
    required: true
},

 price: {
    type: Number,
    required: true
},
quantity: {
    type: Number,
    required: true
}
});

const books = mongoose.model('Books',booksSchema);
module.exports = books;