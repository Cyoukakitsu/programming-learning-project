import { useState } from "react";

import NavBar from "./components/NavBar";
import ShopList from "./components/shopList";
import CartDialog from "./components/CartDialog";
export default function App() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <NavBar setVisible={setVisible} />
      <CartDialog visible={visible} setVisible={setVisible} />
      <ShopList />
    </>
  );
}
