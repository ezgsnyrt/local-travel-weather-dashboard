
import React, { useState } from 'react';



 export const App: React.FC = () => {
  const [weatherData, setWeatherData] = useState<any>(null);

 
  const fetchWeatherData = async (city: string) => {
    const apiKey = 'YOUR_OPENWEATHER_API_KEY'; 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('City not found');
      }
      const data = await response.json();
      setWeatherData(data); 
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeatherData(null);
    }
  };

  return (
    <div>
      <h1>Weather Dashboard</h1>
      
  

      
      {weatherData && <WeatherDisplay data={weatherData} />}
    </div>
  );
};




  
 
