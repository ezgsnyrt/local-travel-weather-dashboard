import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import {
  getCoordinates,
  predictAddress,
} from './controllers/address.controller';
import { fetchHotel } from './controllers/hotel.controller';
import { getLocationName } from './controllers/departure.controller';
import { getWeatherdata } from './controllers/weather.controller';
import { fetchTrafficUpdates } from './controllers/traffic.controller';

const PORT = 3005;
const app = express();
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
  ], // Front-end local host
};

app.use(cors(corsOptions));
app.use(express.json());

// You can put the endpoints and request handlers here
app.get('/coordinates', getCoordinates);
app.get('/autocomplete', predictAddress);
app.get('/hotels', fetchHotel);
app.get('/weatherforecast', getWeatherdata);
app.post('/traffic-updates', fetchTrafficUpdates);

app.use(express.json()); // Ensure body parsing is enabled

app.post(
  '/api/location-name',
  async (req: Request, res: Response): Promise<void> => {
    const { lat, lng } = req.body as { lat: number; lng: number }; // Ensure body typing

    try {
      const locationName = await getLocationName({ lat, lng });

      if (locationName) {
        res.json({ locationName });
      } else {
        res.status(400).json({ error: 'Unable to retrieve location name.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Server error.' });
    }
  }
);

app
  .listen(PORT, () => {
    console.log('Server running at PORT: ', PORT);
  })
  .on('error', (error: any) => {
    // gracefully handle error
    throw new Error(error.message);
  });
