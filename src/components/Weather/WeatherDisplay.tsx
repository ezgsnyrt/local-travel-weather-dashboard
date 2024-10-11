import React, { useState, useEffect } from 'react';
import './Weather.css';

interface WeatherData {
  dt: number;
  main: {
    temp: number;
  
  };
  weather: {
    description: string;
    icon: string;
  }[];
  rain?: {
    '1h'?: number;
};
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


export  const WeatherDisplay:  React.FC<WeatherDisplayProps> = ({ coordinates }) => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [error, setError] = useState<string | null>(null);

 
  const fetchWeatherData = async () => {
    const apiKey = 'f40f4543214ad55ead8d6ca12cb39ee0'; 
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error fetching weather data');
      }
      const data: ApiResponse = await response.json();
      const sevenDayForecast = getSevenDays(data);
      setWeatherData(sevenDayForecast);

    
    } catch (error) {
      setError('Unable to fetch weather data');
      console.error('API call error:', error);
    }
  };

  
    useEffect(() => {
    fetchWeatherData();
  }, [coordinates]); 

  if (error) {
    return <div>{error}</div>;
  }

  if (!weatherData.length) {
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
        const rain = data.rain && data.rain['1h'] ? data.rain['1h'] : 0;
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
);
}
 


