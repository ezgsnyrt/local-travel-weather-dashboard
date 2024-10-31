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
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=lodging&key=AIzaSyAvM90CpjRpKkRCVcWsO59hOrVaBFIr7ek`
    );
    const hotelData = response.data.results.slice(0, 3);
    hotelData.forEach(hotel => {
      console.log(hotel)
    })
    console.log("Hotel Data" + JSON.stringify(hotelData, null, 2));

    //* Receiving hotels' name, website and image through the response(lat and lng)
    const hotelDetails = await Promise.all(
      hotelData.map(async (hotel: any) => {
        const placeDetails = await axios.get<PlaceDetailsResponse>(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${hotel.place_id}&fields=name,website,photos&key=AIzaSyAvM90CpjRpKkRCVcWsO59hOrVaBFIr7ek`
        );
        const result = placeDetails.data.result;
        //* Sometime phones are unavailable, so added if condition.
        const imgUrl = result.photos
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photoreference=${result.photos[0].photo_reference}&key=AIzaSyAvM90CpjRpKkRCVcWsO59hOrVaBFIr7ek`
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
