import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Items from "./components/Items/Items";
import ShoppingCart from "./components/ShoppingCart/ShoppingCart";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Items />} />
        <Route path="/shoppingCart" element={<ShoppingCart />} />
      </Routes>
    </Router>
  );
}

export default App;
