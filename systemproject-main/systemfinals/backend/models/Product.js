const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  size: { type: [String], required: true }, 
  hasSizes: { type: Boolean, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  stock: { type: Number, required: true },
  status: { type: String, required: true}, 
  image: { type: String, required: true }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
