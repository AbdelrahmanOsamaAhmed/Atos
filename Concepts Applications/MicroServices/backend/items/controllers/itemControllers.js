const Item = require("../models/item");

const addItem = (req, res, next) => {
  const { title, price } = req.body;
  const createdItem = new Item({
    title,
    price,
  });
  createdItem.save();
  res.status(201).json(createdItem);
};
const getItems = async (req, res, next) => {
  const fetchedItems = await Item.find({});
  res.status(200).json(fetchedItems);
};

exports.addItem = addItem;
exports.getItems = getItems;
