import { useEffect } from "react";
import { useGeolocation } from "./hooks/useGeolocation";

import Forecast from "./features/forecast/Forecast";
import Home from "./features/home/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Applayout from "./ui/Applayout";

function App() {
  const { getCurrentLocation, isLoading, position } = useGeolocation();

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Applayout isLoading={isLoading} />}>
          <Route path="/" element={<Home position={position} />} />
          <Route path="forecast" element={<Forecast position={position} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
