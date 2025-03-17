import {useEffect, useState} from 'react'
import './App.css'
import PropTypes from "prop-types";
import searchIcon from "./assets/search.png";
import clearIcon from "./assets/01d@2x.png";
import cloudIcon from "./assets/02d@2x.png";

import humidityIcon from "./assets/humidity.png";
import scatterdIcon from "./assets/03d@2x.png";
import overcastIcon from "./assets/04d@2x.png";
import showerIcon from "./assets/09d@2x.png";
import thunderIcon from "./assets/11d@2x.png";
import rainIcon from "./assets/10d@2x.png";
import windIcon from "./assets/wind.png";
import snowIcon from "./assets/13d@2x.png";
import mistIcon from "./assets/50d@2x.png";

const WeatherDetails =({icon,temp,city,country,lat,log,humidity,wind}) =>{
  return(
    <>
  <div className='image'>
    <img src={icon} alt='image'/>
    </div>
    <div className="temp">{temp}&#176;C</div>
    <div className='location'>{city}</div>
    <div className='country'>{country}</div>
    <div className='cord'>
      <div>
        <span className='lat'>Latitude</span>
        <span>{lat}</span>
      </div>
      <div>
        <span className='log'>Longitude</span>
        <span>{log}</span>
      </div>
      </div>
      <div className='data-container'>
        <div className='element'>
          <img src={humidityIcon} alt='humidity' className='icon'></img>
          <div className='data'>
            <div className='humidity-percent'>{humidity} %</div>
            <div className='text' >Humidity</div>
          </div>
        </div>
        <div className='element'>
          <img src={windIcon} alt='wind' className='icon'></img>
          <div className='data'>
            <div className='wind-percent'>{wind} Km/Hr</div>
            <div className='text' >Wind Speed</div>
          </div>
        </div>
      </div>

    </>
  );
};

WeatherDetails.propTypes ={
  icon:PropTypes.string.isRequired,
  temp:PropTypes.number.isRequired,
  city:PropTypes.string.isRequired,
  country:PropTypes.string.isRequired,
  humidity:PropTypes.number.isRequired,
  wind:PropTypes.number.isRequired,
  lat:PropTypes.number.isRequired,
  log:PropTypes.number.isRequired,
};

function App(){
  let api_key="e3f5b617240f77c0ac994bd6ddd9cf9e";
const [text,setText]=useState("Chennai");

  const [icon,setIcon]=useState(snowIcon);
  const [temp,setTemp]=useState(0);
  const [city,setCity]=useState("");
  const [country,setCountry]=useState("");
  const [lat,setLat]=useState(0);
  const [log,setLog]=useState(0);
  const [humidity,setHumidity]=useState(0);
  const [wind,setWind]=useState(0);
  const[cityNotFound,setCityNotFound]=useState(false);
  const [loading,setLoading] =useState(false);
  const[error,setError]=useState(null);

  const weatherIconMap = {
    "01d":clearIcon,
    "01n":clearIcon,
    "02d":cloudIcon,
    "02n":cloudIcon,
    "03d":scatterdIcon,
    "03n":scatterdIcon,
    "04d":overcastIcon,
    "04n":overcastIcon,
    "09d":showerIcon,
    "09n":showerIcon,
    "11d":thunderIcon,
    "11n":thunderIcon,
    "10d":rainIcon,
    "10n":rainIcon,
    "13d":snowIcon,
    "13n":snowIcon,
    "50n":mistIcon,
    "50d":mistIcon,
  };
  const search=async () =>{
    let url=`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

    try{
        let res=await fetch(url);
        let data=await res.json();
       // console.log(data);
        if(data.cod === "404"){
          console.error("city not found");
          setCityNotFound(true);
          setLoading(false);
          return;
        }
        setCityNotFound(false);
        setHumidity(data.main.humidity);
        setWind(data.wind.speed);
        setTemp(Math.floor(data.main.temp));
        setCity(data.name);
        setCountry(data.sys.country);
        setLat(data.coord.lat);
        setLog(data.coord.lon);
        const weatherIconCode = data.weather[0].icon;
        setIcon(weatherIconMap[weatherIconCode] || clearIcon);

    }catch(error){
      console.error("an error occured:",error.message);
      setError("An error occured while Fetching weather data");
    }finally{
      setLoading(false);
    }
  };

  const handleCity =(e) => {
    setText(e.target.value);
  };
  const handleKeyDown =(e) =>{
    if(e.key === "Enter"){
    search();
    }
  };
   useEffect(function() {
    search();
   }, []);
  return (
    <>


      <div className='container'>
        <div className='input-container'>
        <input type="text" className="cityInput"
        placeholder="Search City"
        onChange={handleCity}  value={text} onKeyDown={handleKeyDown}/>
          <div className='search-icon' onClick={() => search()}>
            <img src={searchIcon} alt='Search' />
          </div>
          </div>

        {loading && <div className='loading-message'>Loading...</div>}
        {error && <div className="error-message">{error}</div> }
        {cityNotFound && <div className='city-not-found'>City not found</div>}

        {!loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city}
          country={country} lat={lat} log={log} humidity={humidity} wind={wind}/> }

        </div>


       </>
  );
}

export default App;
