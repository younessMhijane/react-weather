import React, { useState, useEffect } from 'react';
import './App.css';
import suny from './weatherSession/suny.jpg'
import Clouds from'./weatherSession/cloudy.jpeg'
import Rain from './weatherSession/rainy.png'
import Snow from './weatherSession/snowy.jpeg'
import stormy from './weatherSession/stormy.jpg'
import windy from './weatherSession/windy.jpg'
import tornado from './weatherSession/Tornado.jpg'
import mist from './weatherSession/fog.webp'
import sand from './weatherSession/sand.jpg'
import LocalImage from './iconImg/broche-de-localisation.png'
import DateComponent from './Components/Date';
import WeekWeather from './Components/WeekWeather'
function App() {
  
  const api = {
    key: process.env.REACT_APP_API_KEY,
    base: process.env.REACT_APP_API_BASE,
  };  

  const [defaultCity, setDefaultCity] = useState("");
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState({});
  const [error, setError] = useState("");
  const [imgSession, setImgSession] = useState("");
  const [clickSearch, setclickSearch] = useState(false);

  useEffect(() => {
    const selectSessionImg = () => {
      if (weather && weather.weather && weather.weather[0].main) {
        console.log(weather.weather[0].main); // Debugging
        if (weather.weather[0].main === "Clear") {
          setImgSession(suny);
        } else if (weather.weather[0].main === "Clouds") {
          setImgSession(Clouds);
        } else if (weather.weather[0].main === "Rain" || weather.weather[0].main === "Drizzle") {
          setImgSession(Rain);
        } else if (weather.weather[0].main === "Snow") {
          setImgSession(Snow);
        } else if (weather.weather[0].main === "Thunderstorm" ) {
          setImgSession(stormy);
        } else if (weather.weather[0].main === "Tornado") {
          setImgSession(tornado);
        } else if (weather.weather[0].main === "Squall") {
          setImgSession(windy);
        } else if (weather.weather[0].main === "Fog"|| weather.weather[0].main === "Haze"|| weather.weather[0].main === "Mist") {
          setImgSession(mist);
        } else if (weather.weather[0].main === "Sand"|| weather.weather[0].main === "Dust"|| weather.weather[0].main === "Ash") {
          setImgSession(sand);
        }
      }
      else {
        setImgSession(suny);
      }
    };
    selectSessionImg();
  }, [weather]);
    
  // Géolocalisation pour définir la ville par défaut
  useEffect(() => {
    if ("geolocation" in navigator && !defaultCity) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://geocode.xyz/${latitude},${longitude}?geoit=json`
            );
            const data = await response.json();
            if (data.city) {
              setDefaultCity(data.osmtags.name_fr);
              setCity(data.osmtags.name_fr);
            } else {
              setError("Impossible de détecter la ville.");
            }
          } catch (err) {
            setError("Erreur de géolocalisation.");
          }
        },
        () => {
          setError("Permission refusée pour la géolocalisation.");
        }
      );
    }
  }, [defaultCity]);

  // Recherche météo automatique pour la ville par défaut
  useEffect(() => {
    if (defaultCity) {
      fetch(`${api.base}weather?q=${defaultCity}&units=metric&APPID=${api.key}`)
        .then((res) => res.json())
        .then((result) => {
          if (result.cod !== 200) {
            setError(result.message);
          } else {
            setWeather(result);
            setError("");
            setclickSearch(true)
          }
        })
        .catch(() => setError("Erreur lors de la récupération des données."));
    }
  }, [defaultCity, api.base, api.key]);

  // Recherche météo manuelle
  const searchWeather = (e) => {
    if (e.key === 'Enter' && city) {
      fetch(`${api.base}weather?q=${city}&units=metric&APPID=${api.key}`)
        .then((res) => res.json())
        .then((result) => {
          if (result.cod !== 200) {
            if(result.message==="city not found"){
              setError("Ville Introuvable");
            }else{
              setError(result.message);
            }
          } else {
            console.log(result)
            setWeather(result);
            setError("");
            setclickSearch(true)
          }
        })
        .catch(() => setError("Erreur lors de la récupération des données."));
    }
  };

  return (
    <div className="App" style={{
      backgroundImage: `url(${imgSession})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
    }}>
      <div className="weather">
      <div className="weather-top">

      <div className='weather-1'>
      {(weather.name) && !error?
      <>
            <div style={{ 
                backgroundImage:`url(https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png)`,
                backgroundSize: 'contain',
                height: '90px',
                width: '90px',
                backgroundRepeat:'no-repeat'
                }}>
              </div>
            <p className='temp'>{weather.main.temp}°C</p>
      </>
        : ""
      }
      </div>

      <div className='weather-2'>
        <h3>Weather App</h3>
        <input
          className="weather-input"
          type="text"
          placeholder="Entrez une ville"
          onChange={(e) => {setCity(e.target.value); setclickSearch(false)}}
          value={city}
          onKeyDown={searchWeather}
        />
        {error && <p className="error">{error}</p>}
        {weather.main && !error && (
          <div>
            <p>{weather.weather[0].description} <span>(min: {weather.main.temp_min} ,max: {weather.main.temp_max})</span></p>
          </div>
        )}
        <DateComponent/>
      </div>

      <div className='weather-3'>
      {(weather.name) && !error ?
      <>
        <img src={LocalImage} alt='LocalImage'></img>
        <h6> {weather.name}</h6>
      </>
        : ""
      }
      </div>
      </div>
      <div className='WeekWeather'>
        <WeekWeather clickSearch={clickSearch} city={city} api={api}/>
      </div>
      </div>


    </div>
  );
}

export default App;
