import React from 'react';
import './Dashboard.css';

import UserInput from '../UserInput/UserInput';
import Departures from '../Departures/Departures';
import TrafficUpdates from '../TrafficUpdates/TrafficUpdates';
import WeatherDisplay from '../Weather/WeatherDisplay';


const Dashboard = () => {
  const solnaCoordinates = {
    lat: 59.3600,
    lon: 18.0000,
  };
  return (
    <div>Dashboard
        <UserInput/>
        <Departures/>
        <WeatherDisplay coordinates={solnaCoordinates} />
        <TrafficUpdates/>
    </div>
  )
}

export default Dashboard;