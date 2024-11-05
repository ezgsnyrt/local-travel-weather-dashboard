import React from "react";
import "./TrafficAndHotel.css";
import HotelUpdates from "./HotelUpdates/HotelUpdates";
import TrafficUpdates from "./TrafficUpdates/TrafficUpdates";
import { Container } from "react-bootstrap";
interface TrafficAndHotelProps {
  coordinates: any;
}
const TrafficAndHotel: React.FC<TrafficAndHotelProps> = ({ coordinates }) => {
  //console.log('Coordinates in TrafficAndHotel:', coordinates)
  return (
    <Container fluid id="traffic-hotel-section">
      <HotelUpdates coordinates={coordinates} />
      <TrafficUpdates coordinates={coordinates} />
    </Container>
  );
};

export default TrafficAndHotel;
