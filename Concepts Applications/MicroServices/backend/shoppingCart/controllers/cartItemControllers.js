const CartItem = require("../models/cartItem");

const addItem = (req, res, next) => {
  const { title, price } = req.body;
  const createdItem = new CartItem({
    title,
    price,
  });
  createdItem.save();
  res.status(201).json(createdItem);
};
const getItems = async (req, res, next) => {
  const fetchedItems = await CartItem.find({});
  res.status(200).json(fetchedItems);
};

exports.addItem = addItem;
exports.getItems = getItems;
