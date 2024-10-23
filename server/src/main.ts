import express, { Request, Response } from 'express';
import cors from 'cors';
import { Router } from 'express';
import 'dotenv/config';
import {
  getCoordinates,
  predictAddress,
} from './controllers/address.controller';
import { fetchHotel } from './controllers/hotel.controller';

const PORT = 3005;
const app = express();
const corsOptions = {
  origin: ['http://localhost:3001'], // Front-end local host
};

app.use(cors(corsOptions));

// You can put the endpoints and request handlers here
app.get('/coordinates', getCoordinates);
app.get('/autocomplete', predictAddress);
app.get('/hotels', fetchHotel);

app
  .listen(PORT, () => {
    console.log('Server running at PORT: ', PORT);
  })
  .on('error', (error: any) => {
    // gracefully handle error
    throw new Error(error.message);
  });
