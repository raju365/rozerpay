const productModel = require("../models/product.model");

async function createProduct(req, res) {
  const {
    image,
    title,
    description,
    price: { amount, currency }
  } = req.body;
  try {
    const product = await productModel.create({
      image,
      title,
      description,
      price: { amount, currency }
    });
    return res.status(201).json({
      message: "Product created successfully",
      product
    });
  } catch (error) {
    return res.status(500).json({ message: "Error creating product", error: error.message });
  }
}
async function getItem(req, res) {
  try{
    const products = await productModel.find();
    return res.status(200).json({
      message: "Product fetched successfully",
      products: products
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching product", error: error.message });
  }
}
module.exports = {
  createProduct,
  getItem
};