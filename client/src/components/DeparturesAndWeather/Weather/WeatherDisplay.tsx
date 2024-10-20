import React, { useState, useEffect } from 'react';
import './Weather.css';
import axios from 'axios';




interface WeatherData {
  dt: number; 
  main: {
    temp: number; 
    feels_like: number; 
    temp_min: number; 
    temp_max: number; 
    pressure: number; 
    sea_level: number;
    grnd_level: number; 
    humidity: number; 
    temp_kf: number; 
  };
  weather: {
    id: number;
    main: string; 
    description: string; 
    icon: string;
  }[];
  clouds: {
    all: number; 
  };
  wind: {
    speed: number; 
    deg: number;
    gust: number; 
  };
  visibility: number; 
  pop: number; 
  sys: {
    pod: string; 
  };
  dt_txt: string; 
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
export const fetchWeatherData = async (latitude:number, longitude:number) => {
  const coordinates = { lat: latitude, lon: longitude };
  try {
    const response = await axios.get('/weatherforecast', { params: coordinates });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch weather data from server');
  }
};

export  const WeatherDisplay:  React.FC = () => {

  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
  const handleGeolocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const latitude = position.coords.latitude;   
          console.log(latitude)
          const longitude = position.coords.longitude;   
          console.log(longitude)
          fetchWeatherData(latitude, longitude)
          .then((data) => {
            
            const filteredData = getSevenDays(data);
            setWeatherData(filteredData);
          })
          
            .catch((error) => setError(error.message));
        },
        (error: GeolocationPositionError) => setError('Geolocation is not supported by this browser.'),
        { enableHighAccuracy: true }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  handleGeolocation();
}, []);

  
  if (error) {
    return <div>{error}</div>;
  }

  if (!weatherData == null) {
    return <div>Loading...</div>;
  }

 
  
  const today = new Date();
  


return (
 <div> <h4 className="mb-3">LOCAL WEATHER {}</h4>
  <div className="weather-container">
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
      const rain = data.main.humidity;// && data.main.humidity?['1h'] ;//? data.main.humidity?['1h'] : 0;
        const description = data.weather[0].description;
        const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

        return (
          <div key={data.dt} className="weather-row grid-row">
            <div className="grid-item">{formattedDate}</div>
            <div className="grid-item">{temperature} °C</div>
           <div className="grid-item">{rain} %</div> 
            <div className="grid-item weather-icon">
              <img src={iconUrl} alt={description} />
            </div>
          </div>
        );
      })}
    </div>
  </div>
  </div>
);
}
 


