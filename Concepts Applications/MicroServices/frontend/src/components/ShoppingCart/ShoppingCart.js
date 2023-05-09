import React, { useEffect, useState } from "react";
import axios from "axios";
import Item from "../Shared/Item";
const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const response = await axios.get("http://localhost:5000/api/cart");
      setCartItems(response.data);
    };
    fetchItems();
  }, []);
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Cart</h1>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "5px",
          justifyContent: "center",
        }}
      >
        {cartItems.map((item, idx) => {
          if (!cartItems || cartItems.length === 0) return <p>No cartItems</p>;
          return <Item key={idx} title={item.title} price={item.price} />;
        })}
      </div>
    </div>
  );
};

export default ShoppingCart;
