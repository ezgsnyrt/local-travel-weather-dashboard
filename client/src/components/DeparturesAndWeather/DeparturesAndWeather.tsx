import React from 'react';
import Departures from './Departures/Departures';
import './DeparturesAndWeather.css';
import { Container } from 'react-bootstrap';
import { WeatherDisplay } from './Weather/WeatherDisplay';

interface DeparturesAndWeatherProps {
    coordinates: any;
  }
{/* Lines in this section should be dynamically created in the related components */}


export const  DeparturesAndWeather: React.FC<DeparturesAndWeatherProps> = ({ coordinates }) => {
    console.log('Coordinates in DeparturesAndWeather:', coordinates);

    return (
        <Container fluid id="departure-weather-section">
            <div className="departures-wrapper p-3 mt-5 ms-2 mb-5">
                <h4 className="mb-3">TRANSPORT DEPARTURES</h4>
                <Departures />
            </div>
            <div className="weather-wrapper p-3 mt-5 me-2 mb-5">
            
            <WeatherDisplay coordinates={coordinates}/>
            </div>
        </Container>
    )
}