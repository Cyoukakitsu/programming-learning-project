import { useState, useRef, useEffect } from "react";

import NavBar from "./components/NavBar";
import ShopList from "./components/shopList";

import { load } from "./components/cartListSlice";

import CartDialog from "./components/CartDialog";
import { Toast } from "primereact/toast";
import { useDispatch } from "react-redux";
import { useLocalStorage } from "react-use";

export default function App() {
  const [visible, setVisible] = useState(false);

  const dispatch = useDispatch();

  const [cartList] = useLocalStorage("cart-list", []);

  const toast = useRef(null);

  useEffect(() => {
    dispatch(load(cartList));
  }, [cartList, dispatch]);

  return (
    <>
      <NavBar setVisible={setVisible} />
      <CartDialog visible={visible} setVisible={setVisible} />
      <ShopList toast={toast} />

      <Toast ref={toast} />
    </>
  );
}