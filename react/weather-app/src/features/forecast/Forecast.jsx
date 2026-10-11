import Loading from "../../ui/Loading";
import { useForecastWeather } from "../../hooks/useForecastWeather";
import ForecastList from "./ForecastList";
import AppNav from "./AppNav";
// Weather forecast
// https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

function Forecast({ position }) {
  const { weatherForecastList, isLoading } = useForecastWeather(position);

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (
        <>
          <AppNav />

          <ForecastList weatherForecastList={weatherForecastList} />
        </>
      )}
    </>
  );
}
export default Forecast;
