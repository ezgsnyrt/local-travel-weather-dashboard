import express, { Request, Response } from "express";
import cors from 'cors';
import { Router } from 'express';
import 'dotenv/config';
import { getCoordinates, predictAddress } from "./controllers/address.controller";

const PORT = 3005;
const app = express();
const corsOptions = {
    origin: ["http://localhost:3001"], // Front-end local host
};

app.use(cors(corsOptions));


// You can put the endpoints and request handlers here
app.get("/coordinates", getCoordinates);
app.get("/autocomplete", predictAddress);

app.get('/weather', async (req, res) => {
  const apiKey = 'f40f4543214ad55ead8d6ca12cb39ee0';
  const lat = '35.6895'; 
  const lon = '139.6917'; 
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data.list.slice(0, 5));  
  } catch (error) {
    res.status(500).json({ error: 'Error fetching weather data' });
  }
});





app.listen(PORT, () => {
  console.log("Server running at PORT: ", PORT);
}).on("error", (error:any) => {
  // gracefully handle error
  throw new Error(error.message);
});