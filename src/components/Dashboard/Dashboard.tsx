import React from 'react';
import './Dashboard.css';

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import logo_icon from '../../assets/road.png'; // https://www.flaticon.com/free-icon/road_712058
import UserInput from '../UserInput/UserInput';
import TrafficUpdates from '../TrafficUpdates/TrafficUpdates';
import DeparturesAndWeather from '../DeparturesAndWeather/DeparturesAndWeather';


const Dashboard = () => {

  return (

    <>
      <Navbar expand="lg">
        <Container>
          <Navbar.Brand href="#home">
            <img src={logo_icon} className="logo-icon me-1 mb-2"/>
            <span className="logo-name">StadTrafik</span>
          </Navbar.Brand>
        </Container>
      </Navbar>

      <UserInput />
      <DeparturesAndWeather/>
     
      <TrafficUpdates />
    </>
  )
}

export default Dashboard;