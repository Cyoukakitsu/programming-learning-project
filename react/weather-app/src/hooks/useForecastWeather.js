import { useState, useEffect } from "react";
import { getForecastWeather } from "../services/apiWeather";

export function useForecastWeather(position) {
  const [weatherForecastList, setWeatherForecastList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadForecastData() {
    if (!position?.latitude || !position?.longitude) return;

    setIsLoading(true);
    setError(null);

    try {
      const weatherData = await getForecastWeather(
        position.latitude,
        position.longitude
      );

      const weatherDataList = weatherData.list || [];
      console.log("原始天气数据:", weatherDataList);

      const filteredForecastList = weatherDataList
        .map((weatherData) => {
          const weather = weatherData.weather[0];
          return {
            weatherIcon: `https://openweathermap.org/img/wn/${weather.icon}@2x.png`,
            weather: weather.main,
            min: weatherData.main.temp_min, // ✅ 修正 min/max 顺序
            max: weatherData.main.temp_max,
            date: weatherData.dt_txt, // ✅ 正确字段名
          };
        })
        // ✅ 只保留每天中午12点的预报
        .filter((data) => data.date && data.date.includes("12:00:00"))
        // ✅ 去掉今天的数据，只显示未来几天
        .filter((data) => {
          const curDate = new Date().getDate();
          const weatherDate = new Date(data.date).getDate();
          return curDate !== weatherDate;
        });

      setWeatherForecastList(filteredForecastList);
    } catch (err) {
      console.error("加载天气数据失败:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadForecastData();
  }, [position]); // ✅ 当位置变化时重新加载

  return { weatherForecastList, isLoading, error };
}
