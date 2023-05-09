import React, { useEffect, useState } from "react";
import CreateItemForm from "./CreateItemForm";
import axios from "axios";
import Item from "../Shared/Item";

const Items = () => {
  const [items, setItems] = useState([]);
  const [forceReRender, setForceReRender] = useState(false);
  const forceReRenderHandler = () => {
    setForceReRender((prev) => !prev);
  };
  useEffect(() => {
    const fetchItems = async () => {
      const response = await axios.get("http://localhost:5001/api/items");
      setItems(response.data);
    };
    fetchItems();
  }, [forceReRender]);

  return (
    <div>
      <CreateItemForm forceReRender={forceReRenderHandler} />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "5px",
          justifyContent: "center",
        }}
      >
        {items.map((item, idx) => {
          if (!items || items.length === 0) return <p>No items</p>;
          return <Item key={idx} title={item.title} price={item.price} />;
        })}
      </div>
    </div>
  );
};

export default Items;
