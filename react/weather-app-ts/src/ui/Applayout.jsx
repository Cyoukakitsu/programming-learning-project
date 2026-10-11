import Container from "./Container";
import Loading from "./Loading";
import { Outlet } from "react-router-dom";

// import { useState } from 'react';
function Applayout({ isLoading }) {
  return <Container>{isLoading ? <Loading /> : <Outlet />}</Container>;
}
export default Applayout;
