import React, { useEffect, useState } from 'react';
import './HotelUpdates.css';
interface Hotel {
  name: string;
  imgUrl: string;
  website: string;
}

const HotelUpdates: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loadings, setLoadings] = useState(true);
  const [error, setError] = useState('');

  //*example selected Malmö city
  const latitude = 55.605;
  const longitude = 13.0038;

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const hotelsResponse = await fetch(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=lodging&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
        );
        if (!hotelsResponse.ok) {
          throw new Error('Failed to fetch hotels form google place api');
        }
        const hotelDate = await hotelsResponse.json();
        const hotels = hotelDate.results.slice(0, 3);

        //* Here adding Google Place API to show images and websites
        //*Since I need only a few hotel results, I can use promise.all
        const hotelDetails = await Promise.all(
          hotels.map(async (hotel: any) => {
            const placeDetails = await fetch(
              `https://maps.googleapis.com/maps/api/place/details/json?place_id=${hotel.place_id}&fields=name,website,photos&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
            );
            if (!placeDetails.ok) {
              throw new Error('Error');
            }
            const placeData = await placeDetails.json();
            const result = placeData.result;
            console.log(placeData);
            console.log(result);
            const imgUrl = result.photos
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${result.photos[0].photo_reference}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
              : '';
            const website = result.website || 'No website available';
            return {
              name: result.name,
              imgUrl: imgUrl,
              website: website,
            };
          })
        );

        setHotels(hotelDetails);
        setLoadings(false);
      } catch (error) {
        console.error(error);
        setError('Error fetching hotels');
        setLoadings(false);
      }
    };
    fetchHotels();
  }, []);

  return (
    <div className='hotel-container'>
      <h4 className='mt-2'>HOTELS NEARBY</h4>
      <div className='inner-wrapper'>
        {loadings ? (
          <p>Loading hotels..</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <ul>
            {hotels.map((hotel, index) => (
              <li key={index}>
                <strong>{hotel.name}</strong>
                {hotel.imgUrl && <img src={hotel.imgUrl} alt={hotel.name} />}
                <a href={hotel.website} target='_blank' rel='noreferrer'>
                  Visit Website
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HotelUpdates;
