
import React, { useState, useEffect } from 'react';


interface WeatherDisplayProps {
  coordinates: {
    lat: number;
    lon: number;
  };
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ coordinates }) => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

 
  const fetchWeatherData = async () => {
    const apiKey = 'f40f4543214ad55ead8d6ca12cb39ee0'; 
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error fetching weather data');
      }
      const data = await response.json();
      setWeatherData(data);
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

  if (!weatherData) {
    return <div>Loading...</div>;
  }

 
  const { main, weather, sys, name } = weatherData;
  const temperature = main.temp.toFixed(1);
  const description = weather[0].description;
  const iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}.png`;
  const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  const sunset = new Date(sys.sunset * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div>
      <h3>Current Weather in {name}</h3>
      <img src={iconUrl} alt={description} />
      <p>Temperature: {temperature}°C</p>
      <p>Description: {description}</p>
      <p>Sunrise: {sunrise}</p>
      <p>Sunset: {sunset}</p>
    </div>
  );
};

export default WeatherDisplay;
