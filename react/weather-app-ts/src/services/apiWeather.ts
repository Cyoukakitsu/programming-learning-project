const API_KEY = "0fa630f94cd447784146498e493aa38f";

export async function getCurrentWeather(lat: number, lon: number) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    return await response.json();
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getForecastWeather(lat: number, lon: number) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    return await response.json();
  } catch (error: any) {
    throw new Error(error.message);
  }
}
