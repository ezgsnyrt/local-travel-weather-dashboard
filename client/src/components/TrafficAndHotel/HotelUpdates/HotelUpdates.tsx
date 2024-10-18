import React, { useEffect, useState } from 'react';
import './HotelUpdates.css';
interface Hotel {
  name: string;
  address: string;
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
        const response = await fetch(
          'https://test.api.amadeus.com/v1/security/oauth2/token',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              grant_type: 'client_credentials',
              client_id: `${process.env.REACT_APP_AMADEUS_API_KEY}`,
              client_secret: `${process.env.REACT_APP_AMADEUS_API_SECRET}`,
            }),
          }
        );

        // console.log(response);
        if (!response.ok) {
          throw new Error('Failed to fetch access token');
        }
        const data = await response.json();
        const accessToken = data.access_token;
        //  console.log(accessToken);

        //* Fetch hotels using the access token
        const hotelResponse = await fetch(
          `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-geocode?latitude=${latitude}&longitude=${longitude}&radius=5&radiusUnit=KM&hotelSource=ALL`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        //console.log(hotelResponse);
        if (!hotelResponse.ok) {
          throw new Error('Failed yo fetch hotels');
        }
        const hotelDate = await hotelResponse.json();
        console.log('hotelData:', hotelDate);
        const fetchedHotels = hotelDate.data.slice(0, 3).map((hotel: any) => ({
          name: hotel.name,
        }));
        setHotels(fetchedHotels);
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
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HotelUpdates;
