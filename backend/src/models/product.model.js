const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    image: String,
    title: String,
    description: String,
    price:{
        amount: Number,
        currency: {
            type: String,
            default: "INR",
            enum:['INR','USD']
        }
    },


})

const productModel = mongoose.model('product', productSchema);
module.exports = productModel;