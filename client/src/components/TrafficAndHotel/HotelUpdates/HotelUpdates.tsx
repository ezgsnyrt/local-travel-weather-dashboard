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
              client_id: '9JvgqFBLr17QfZJH5wbhvhOB8yi67ogI',
              client_secret: 'SHQKAocGSc7MjYca',
            }),
          }
        );
        console.log(response);
        if (!response.ok) {
          throw new Error('Failed to fetch access token');
        }
        const data = await response.json();
        const accessToken = data.access_token;

        const hotelResponse = await fetch(
          'https://test.api.amadeus.com/v2/shopping/hotel-offers' +
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
        );
        if (!hotelResponse.ok) {
          throw new Error('Failed yo fetch hotels');
        }
        const hotelDate = await hotelResponse.json();
        const fetchedHotels = hotelDate.map((hotel: any) => ({
          name: hotel.hotel.name,
          address: hotel.hotel.address.lines.join(', '),
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
  }, [latitude, longitude]);

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
                <br />
                <strong>{hotel.address}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HotelUpdates;
