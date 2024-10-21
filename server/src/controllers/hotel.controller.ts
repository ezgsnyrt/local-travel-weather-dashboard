import { RequestHandler } from 'express';
import axios from 'axios';
import { access } from 'fs';

interface PlacePhoto {
  photo_reference: string;
}
interface PlaceResults {
  place_id: string;
  name: string;
  website: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  photos?: PlacePhoto[];
}

interface SearchResponse {
  results: PlaceResults[];
}
interface PlaceDetailsResponse {
  result: PlaceResults;
}
export const fetchHotel: RequestHandler = async (req, res) => {
  const { lat, lng } = req.query;
  try {
    const response = await axios.get<SearchResponse>(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=lodging&key=${process.env.HOTEL_APT_KEY}`
    );
    const hotelData = response.data.results.slice(0, 3);
    console.log(hotelData);

    const hotelDetails = await Promise.all(
      hotelData.map(async (hotel: any) => {
        const placeDetails = await axios.get<PlaceDetailsResponse>(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${hotel.place_id}&fields=name,website,photos&key=${process.env.HOTEL_APT_KEY}`
        );
        const result = placeDetails.data.result;
        const imgUrl = result.photos
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${result.photos[0].photo_reference}&key=${process.env.HOTEL_APT_KEY}`
          : '';
        return {
          name: result.name,
          imgUrl: imgUrl,
          website: result.website || 'No website found😶',
        };
      })
    );
  } catch (error) {
    res.status(500).send('Failed to fetch hotel API');
  }
};
