import React, { useState, useEffect } from 'react';
import './Weather.css';
import axios from 'axios';

// interface WeatherData {
//   dt: number;
//   main: {
//     temp: number;
  
//   };
//   weather: {
//     description: string;
//     icon: string;
//   }[];
//   rain?: {
//     '1h'?: number;
// };
// }


interface WeatherData {
  dt: number; // Unix timestamp
  main: {
    temp: number; // Temperature in Kelvin
    feels_like: number; // Feels like temperature in Kelvin
    temp_min: number; // Minimum temperature in Kelvin
    temp_max: number; // Maximum temperature in Kelvin
    pressure: number; // Pressure in hPa
    sea_level: number; // Sea level pressure in hPa
    grnd_level: number; // Ground level pressure in hPa
    humidity: number; // Humidity in percent
    temp_kf: number; // Temperature variation in Kelvin
  };
  weather: {
    id: number; // Weather condition ID
    main: string; // Group of weather conditions (e.g., "Clear", "Clouds", "Rain")
    description: string; // Weather condition description
    icon: string; // Weather icon code
  }[];
  clouds: {
    all: number; // Cloudiness in percent
  };
  wind: {
    speed: number; // Wind speed in meters per second
    deg: number; // Wind direction in degrees (meteorological)
    gust: number; // Wind gust speed in meters per second
  };
  visibility: number; // Visibility in meters
  pop: number; // Probability of precipitation in percent
  sys: {
    pod: string; // Period of day (day or night)
  };
  dt_txt: string; // Forecast time in ISO 8601 format
}
interface ApiResponse {
  list?: WeatherData[];
};

interface WeatherDisplayProps {
  coordinates: {
   lat: number;
    lon: number;
  };
 }


const getSevenDays = (data: ApiResponse): WeatherData[] => {
  const today = new Date();
  const days = Array.from({ length: 5}, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date.toDateString();
  });

  return data.list?.filter((d) => {
    const date = new Date(d.dt * 1000);
    return days.includes(date.toDateString());
  }).slice(0, 5) || []; 
};

axios.defaults.baseURL = 'http://localhost:3005';
export const fetchWeatherData = async () => {
  const coordinates = { lat: 59.334591, lon: 18.063278 }; // Coordinates for Solna
  try {
    const response = await axios.get('/weatherforecast', { params: coordinates });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch weather data from server');
  }
};

export  const WeatherDisplay:  React.FC<WeatherDisplayProps> = ({ coordinates }) => {

  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFetchWeather = async () => {
    try {
      const response = await fetchWeatherData();
      const filteredData = getSevenDays(response); // Filter and slice data
      setWeatherData(filteredData);
    } catch (error) {
      setError('Error al obtener datos del clima desde el servidor');
    }
  };



  
    useEffect(() => {
      handleFetchWeather();
  }, [coordinates]); 

  if (error) {
    return <div>{error}</div>;
  }

  if (!weatherData == null) {
    return <div>Loading...</div>;
  }

 
  
  const today = new Date();
  


return (
  <div className="weather-container">
    <h2>LOCAL WEATHER</h2>

    <div className="weather-table">
    
      <div className="weather-header grid-row">
        <div className="grid-item header">DAY</div>
        <div className="grid-item header">TEMP °C</div>
        <div className="grid-item header">RAIN %</div>
        <div className="grid-item header">WEATHER</div>
      </div>

   
      {weatherData.map((data: WeatherData, index: number) => {
        const date = new Date(today);
        date.setDate(today.getDate() + index);
        const formattedDate = date.toLocaleDateString('en-US', {
          weekday: 'long',
        });
        const temperature = data.main.temp.toFixed(1);
       // const rain = data.rain? && data.rain?['1h'] ? data.rain['1h'] : 0;
        const description = data.weather[0].description;
        const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

        return (
          <div key={data.dt} className="weather-row grid-row">
            <div className="grid-item">{formattedDate}</div>
            <div className="grid-item">{temperature} °C</div>
          {/* <div className="grid-item">{rain} %</div> */}
            <div className="grid-item weather-icon">
              <img src={iconUrl} alt={description} />
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
}
 


