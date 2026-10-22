// OpenWeatherMap の API キーは .env.local の VITE_OPENWEATHER_API_KEY から読み込む
// （注意：VITE_ 変数はビルド時にバンドルへ埋め込まれるため、公開デプロイ時はブラウザから見える）
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

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
