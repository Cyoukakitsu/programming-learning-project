import { useState, useRef } from "react";

import NavBar from "./components/NavBar";
import ShopList from "./components/shopList";
import CartDialog from "./components/CartDialog";
import { Toast } from "primereact/toast";
export default function App() {
  const [visible, setVisible] = useState(false);

  const toast = useRef(null);
  const show = () => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "Successfully added to cart",
      life: 1000,
    });
  };

  return (
    <>
      <NavBar setVisible={setVisible} />
      <CartDialog visible={visible} setVisible={setVisible} />
      <ShopList show={show} />

      <Toast ref={toast} />
    </>
  );
}
