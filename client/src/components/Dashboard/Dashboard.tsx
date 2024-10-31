import React from 'react';
import './Dashboard.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import logo_icon from '../../assets/road.png'; // https://www.flaticon.com/free-icon/road_712058
import UserInput from '../UserInput/UserInput';
import TrafficAndHotel from '../TrafficAndHotel/TrafficAndHotel';
import DeparturesAndWeather from '../DeparturesAndWeather/DeparturesAndWeather';
import { useState } from 'react';

const Dashboard = () => {
  const [coordinates, setCoordinates] = useState<{lat: number | null, lng: number | null}>({lat: null, lng: null}); // 'coordinates' should be used the user's location in all components
  const [locationName, setLocationName] = useState<string | null>(null);

  return (
    <>
      <Navbar expand='lg'>
        <Container>
          <Navbar.Brand href='#home'>
            <img src={logo_icon} className='logo-icon me-1 mb-2' />
            <span className='logo-name'>StadTrafik</span>
          </Navbar.Brand>
        </Container>
      </Navbar>
      <UserInput setCoordinates={setCoordinates} setLocationName={setLocationName} />
      <DeparturesAndWeather locationName={locationName} coordinates={coordinates}/>
      <TrafficAndHotel coordinates={coordinates} />
    </>
  );
};

export default Dashboard;
