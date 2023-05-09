import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import axios from "axios";

const Item = ({ title, price }) => {
  const addToCartHandler = async () => {
    await axios.post("http://localhost:5000/api/cart", {
      title,
      price,
    });
  };

  return (
    <Card style={{ width: "18rem" }}>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{price}</Card.Text>
        <Button onClick={addToCartHandler} variant="primary">
          Add to cart
        </Button>
      </Card.Body>
    </Card>
  );
};

export default Item;
