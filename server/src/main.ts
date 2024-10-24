import express from "express";
import cors from 'cors';
import 'dotenv/config';
import {getCoordinates,predictAddress,} from './controllers/address.controller';
import { fetchHotel } from './controllers/hotel.controller';
import { getLocationName } from './controllers/departure.controller';
import { getWeatherdata } from "./controllers/weather.controller";

const PORT = 3005;
const app = express();
const corsOptions = {
  origin: ['http://localhost:3001'], // Front-end local host
};

app.use(cors(corsOptions));
app.use(express.json());


// You can put the endpoints and request handlers here
app.get('/coordinates', getCoordinates);
app.get('/autocomplete', predictAddress);
app.get('/hotels', fetchHotel);
app.get("/weatherforecast", getWeatherdata);


app.post('/api/location-name', async (req: Request, res: Response) => {
  const { lat, lng } = req.body; // Extract latitude and longitude from the request body

  // Call the getLocationName function
  const locationName = await getLocationName({ lat, lng });

  if (locationName) {
    res.json({ locationName }); // Respond with the location name if found
  } else {
    res.status(400).json({ error: "Unable to retrieve location name." }); // Respond with an error if not found
  }
});





app
  .listen(PORT, () => {
    console.log('Server running at PORT: ', PORT);
  })
  .on('error', (error: any) => {
    // gracefully handle error
    throw new Error(error.message);
  });
app.listen(PORT, () => {
  console.log("Server running at PORT: ", PORT);
}).on("error", (error:any) => {
  // gracefully handle error
  throw new Error(error.message);
});
