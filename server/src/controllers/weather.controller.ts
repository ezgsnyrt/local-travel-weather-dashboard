import axios from 'axios';
import { RequestHandler, Request, Response } from "express";

interface Coordinates {
  lat: number;
  lng: number;
}
async function  fetchWeatherData(coordinates: Coordinates) {
  const apiKey = 'f40f4543214ad55ead8d6ca12cb39ee0';
  console.log("test",coordinates)
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lng}&units=metric&appid=${apiKey}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch weather data');   

  }
};

export const getWeatherdata: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {

    const { lat, lng } = req.query;
   
    if (!lat || !lng) {
     res.status(400).json({ error: 'Coordinates are required (lat and lon)' });
     return
    }

    const coordinates: Coordinates = {
      lat: parseFloat(lat as string),
      lng: parseFloat(lng as string),
    };

    const result = await fetchWeatherData(coordinates);

    res.json(result);
  } catch (error) {
    
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
};