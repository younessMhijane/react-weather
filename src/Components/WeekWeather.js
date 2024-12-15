import React, { useEffect, useState } from 'react';
import './WeekWeather.css';

const WeekWeather = ({clickSearch, city, api }) => {
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (clickSearch) {
    if (city) {
      fetch(`${api.base}forecast?q=${city}&units=metric&APPID=${api.key}`)
        .then((res) => res.json())
        .then((result) => {
          if (result.cod !== "200") {
            setError(result.message);
          } else {
            setForecast(result.list); // 5-day / 3-hour data
            setError("");
            console.log(clickSearch)
          }
        })
        .catch(() => setError("Erreur lors de la récupération des prévisions."));
    }
    }
  }, [city, api,clickSearch]);
  const getDayOfWeek = (timestamp) => {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const date = new Date(timestamp * 1000);
    return days[date.getDay()];
  };

  return (
    <div className="week-weather">
      {clickSearch &&
        <>
          {error && <p className="error">{error}</p>}
          {forecast.length > 0 && (
            <div className="forecast-grid">
              {forecast
                .filter((_, index) => index % 8 === 0) //forecast contient des données toutes les 3 heures (8 entrées par jour)
                .map((day, index) => (
                  <div key={index} className="forecast-item">
                    <div className='Jour'>{getDayOfWeek(day.dt)} |<p className='temperature'>{Math.round(day.main.temp)}°C</p> |</div>
                    <img
                      src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                      alt={day.weather[0].description}
                    />
                    <p className='weathermain'>{day.weather[0].main}</p>
                  </div>
                ))}
            </div>
          )}
        </>
      }
    </div>
  );
};

export default WeekWeather;
