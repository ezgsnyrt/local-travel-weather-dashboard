import React from 'react';
import './Departures.css';
import { Table } from 'react-bootstrap';

const Departures = () => {
  return (
    <Table striped bordered hover responsive="xl" className="custom-table">
        <thead className="table-subtitles">
        <tr>
            <th>FROM</th>
            <th>TO</th>
            <th>PLATFORM</th>
            <th>TIME</th>
            <th>TYPE</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>Item 1</td>
            <td>Item 2</td>
            <td>Item 3</td>
            <td>Item 4</td>
            <td>Item 5</td>
        </tr>
        </tbody>
    </Table>
  )
}

export default Departures;