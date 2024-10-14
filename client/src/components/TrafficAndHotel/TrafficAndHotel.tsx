import React from 'react';
import './TrafficAndHotel.css';
import HotelUpdates from './HotelUpdates/HotelUpdates';
import TrafficUpdates from './TrafficUpdates/TrafficUpdates';
import { Container } from 'react-bootstrap';

const TrafficAndHotel = () => {
  return (
    <Container fluid id="traffic-hotel-section">
        <HotelUpdates />
        <TrafficUpdates />
    </Container>
  )
}

export default TrafficAndHotel;