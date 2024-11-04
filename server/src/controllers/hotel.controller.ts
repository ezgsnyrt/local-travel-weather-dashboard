import { RequestHandler } from 'express';
import axios from 'axios';

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
  //* Receiving lat and lng by depending users address.
  const { lat, lng } = req.query;
  try {
    const response = await axios.get<SearchResponse>(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=lodging&key=${process.env.HOTEL_API_KEY}`
    );

    const hotelData = response.data.results.slice(0, 3);
    hotelData.forEach((hotel) => {
      console.log(hotel);
    });

    //* Receiving hotels' name, website and image through the response(lat and lng)
    const hotelDetails = await Promise.all(
      hotelData.map(async (hotel: any) => {
        const placeDetails = await axios.get<PlaceDetailsResponse>(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${hotel.place_id}&fields=name,website,photos&key=${process.env.HOTEL_API_KEY}`
        );
        const result = placeDetails.data.result;
        //* Sometime phones are unavailable, so added if condition.
        const imgUrl = result.photos
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photoreference=${result.photos[0].photo_reference}&key=${process.env.HOTEL_API_KEY}`
          : '';
        return {
          name: result.name,
          imgUrl: imgUrl,
          website: result.website || 'No website found😶',
        };
      })
    );
    res.json(hotelDetails);
  } catch (error) {
    res.status(500).send('Failed to fetch hotel API');
  }
};
