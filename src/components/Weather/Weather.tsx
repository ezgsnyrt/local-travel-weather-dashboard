import React from 'react';
import './Weather.css';
import { Table } from 'react-bootstrap';

const Weather = () => {
  return (
    <Table striped bordered hover>
        <thead>
        <tr>
            <th>DAY</th>
            <th>TEMP °C</th>
            <th>RAIN %</th>
            <th>WEATHER</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>Item 1</td>
            <td>Item 2</td>
            <td>Item 3</td>
            <td>Icon 1</td>
        </tr>
        </tbody>
    </Table>
  )
}

export default Weather;