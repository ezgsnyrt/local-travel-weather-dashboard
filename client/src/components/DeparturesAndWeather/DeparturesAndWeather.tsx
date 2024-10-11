import React from 'react';
import Departures from './Departures/Departures';
import './DeparturesAndWeather.css';
import Weather from './Weather/Weather';
import { Container } from 'react-bootstrap';

{/* Lines in this section should be dynamically created in the related components */}
export default function DeparturesAndWeather() {
    return (
        <Container fluid id="departure-weather-section">
            <div className="departures-wrapper p-3 mt-5 ms-2 mb-5">
                <h4 className="mb-3">TRANSPORT DEPARTURES</h4>
                <Departures />
            </div>
            <div className="weather-wrapper p-3 mt-5 me-2 mb-5">
                <h4 className="mb-3">LOCAL WEATHER</h4>
                <Weather />
            </div>
        </Container>
    )
}