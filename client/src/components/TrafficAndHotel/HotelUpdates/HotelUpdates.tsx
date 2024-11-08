import React, { useEffect, useState } from 'react';
import './HotelUpdates.css';
interface Hotel {
  name: string;
  imgUrl: string;
  website: string;
}
interface HotelUpdatesProps {
  coordinates: {
    lat: number;
    lng: number;
  } | null;
}
//*Receiving coordinates as props to passing down
const HotelUpdates: React.FC<HotelUpdatesProps> = ({ coordinates }) => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loadings, setLoadings] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHotels = async () => {
      if (!coordinates) return;
      try {
        const response = await fetch(
          `http://localhost:3005/hotels?lat=${coordinates.lat}&lng=${coordinates.lng}`
        );
        const data = await response.json();
        setHotels(data);
        setLoadings(false);
      } catch (error) {
        setError('Error fetching hotels ');
        setLoadings(false);
      }
    };
    fetchHotels();
  }, [coordinates]);

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
              <li key={index} className='image-container'>
                <div className='image-container '>
                  {hotel.imgUrl && (
                    <img
                      className='hotelImage'
                      src={hotel.imgUrl}
                      alt={hotel.name}
                    />
                  )}
                  <div className='btn-name-container'>
                    <h5>{hotel.name}</h5>
                    <button
                      type='button'
                      className='btn btn-success websiteBtn'
                    >
                      <a
                        href={hotel.website}
                        className='text-decoration-none text-light'
                        target='_blank'
                        rel='noreferrer'
                      >
                        Visit Website
                      </a>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HotelUpdates;
