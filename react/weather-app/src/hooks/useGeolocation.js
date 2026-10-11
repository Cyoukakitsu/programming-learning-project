import { useState } from "react";

export function useGeolocation() {
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(null);
  async function getCurrentLocation() {
    return new Promise((resolve, reject) => {
      setIsLoading(true);

      if (!navigator.geolocation) {
        setIsLoading(false);
        reject("Geolocation is not supported by your browser.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition({ latitude, longitude });
          setIsLoading(false);
          resolve();
        },
        (error) => {
          setIsLoading(false);
          reject(error.message);
        }
      );
    });
  }
  return { getCurrentLocation, position, isLoading };
}
