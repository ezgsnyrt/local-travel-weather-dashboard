import React from 'react';
import Departures from './Departures/Departures';
import './DeparturesAndWeather.css';
import { Container } from 'react-bootstrap';
import { WeatherDisplay } from './Weather/WeatherDisplay';

{/* Lines in this section should be dynamically created in the related components */}
export default function DeparturesAndWeather() {
    const solnaCoordinates = {
        lat: 59.3600,
        lon: 18.0000,
      };
    return (
        <Container fluid id="departure-weather-section">
            <div className="departures-wrapper p-3 mt-5 ms-2 mb-5">
                <h4 className="mb-3">TRANSPORT DEPARTURES</h4>
                <Departures />
            </div>
            <div className="weather-wrapper p-3 mt-5 me-2 mb-5">
                <h4 className="mb-3">LOCAL WEATHER</h4>
                <WeatherDisplay  coordinates={solnaCoordinates} />
            </div>
        </Container>
    )
}