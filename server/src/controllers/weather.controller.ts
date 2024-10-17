import axios from 'axios';

export const fetchWeatherData = async (coordinates: { lat: number; lon: number }) => {
  const apiKey = 'f40f4543214ad55ead8d6ca12cb39ee0';
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${apiKey}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch weather data');   

  }
};