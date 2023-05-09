import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const CreateItemForm = ({ forceReRender }) => {
  const [itemTitle, setItemTitle] = useState("");
  const [itemPrice, setItemPrice] = useState();
  const formSubmitHandler = async (e) => {
    e.preventDefault();
    const createdItem = {
      title: itemTitle,
      price: itemPrice,
    };
    await axios.post("http://localhost:5001/api/items", createdItem);
    forceReRender();
  };
  return (
    <div>
      <Link to="/shoppingCart">
        <Button>Cart</Button>
      </Link>
      <form onSubmit={formSubmitHandler}>
        <Form.Group className="mb-3">
          <Form.Label>Item Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Item Title"
            value={itemTitle || ""}
            onChange={(e) => setItemTitle(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            placeholder="Item Price"
            value={itemPrice || ""}
            onChange={(e) => setItemPrice(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default CreateItemForm;
