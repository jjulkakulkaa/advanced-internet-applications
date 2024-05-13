const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    amount: { type: Number, required: true },
    photo: { type: String } 
});

module.exports = mongoose.model('Product', productSchema);
