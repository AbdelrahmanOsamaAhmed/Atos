//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect(
  "mongodb+srv://admin-abdo:abdo1234@cluster0.svkswrm.mongodb.net/todooListDB",
  { useNewUrlParser: true }
);
const itemSchema = mongoose.Schema({
  name: String,
});
const listSchema = mongoose.Schema({
  name: String,
  items: [itemSchema],
});
const Item = mongoose.model("Item", itemSchema);
const List = mongoose.model("List", listSchema);
const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];
const itemOne = new Item({
  name: "Welconme to TODO List",
});
const itemTwo = new Item({
  name: "Hit the + button to add to list",
});
const defaultItems = [itemOne, itemTwo];

app.get("/", function (req, res) {
  Item.find({}).then((foundItems) => {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems)
        .then(console.log("Sucessfully added"))
        .catch((err) => console.log(err));
    }
    res.render("list", { listTitle: "Today", newListItems: foundItems });
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const newItem = new Item({
    name: itemName,
  });
  if (listName === "Today") {
    newItem.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }).then((foundList) => {
      foundList.items.push(newItem);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});
app.get("/:listName", (req, res) => {
  const listName = _.capitalize(req.params.listName);
  List.findOne({ name: listName }).then((foundList) => {
    if (!foundList) {
      const list = new List({
        name: listName,
        items: defaultItems,
      });
      list.save();
      res.redirect("/" + listName);
    } else {
      res.render("list", {
        listTitle: foundList.name,
        newListItems: foundList.items,
      });
    }
  });
});

app.get("/about", function (req, res) {
  res.render("about");
});
app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkBox;
  const listName = req.body.listName;
  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId).then(() =>
      console.log("Successfully deleted")
    );
    res.redirect("/");
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } }
    ).then(res.redirect("/" + listName));
  }
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
