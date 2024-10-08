import React from 'react';
import './Dashboard.css';
import Weather from '../Weather/Weather';
import UserInput from '../UserInput/UserInput';
import Departures from '../Departures/Departures';
import TrafficUpdates from '../TrafficUpdates/TrafficUpdates';

const Dashboard = () => {
  return (
    <div>Dashboard
        <UserInput/>
        <Departures/>
        <Weather/>
        <TrafficUpdates/>
    </div>
  )
}

export default Dashboard;