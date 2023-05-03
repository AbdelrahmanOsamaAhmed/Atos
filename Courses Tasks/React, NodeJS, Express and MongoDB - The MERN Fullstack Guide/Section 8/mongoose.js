const mongoose = require("mongoose");
const Product = require("./models/product");
mongoose
  .connect(
    "mongodb+srv://admin-abdo:abdo1234@cluster0.svkswrm.mongodb.net/productsDB"
  )
  .then(() => {
    console.log("Connected to the db");
  })
  .catch((err) => console.log(err));
const createProduct = async (req, res, next) => {
  const createdProduct = new Product({
    name: req.body.name,
    price: req.body.price,
  });
  const result = await createdProduct.save();
  res.json(result);
};
const getProducts = async (req, res, next) => {
    const products = await Product.find()
    res.json(products);
}
exports.createProduct = createProduct;
exports.getProducts = getProducts;
