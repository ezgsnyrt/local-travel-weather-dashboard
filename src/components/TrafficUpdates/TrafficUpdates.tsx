import React from 'react';
import './TrafficUpdates.css';
import Container from 'react-bootstrap/esm/Container';

const TrafficUpdates = () => {
  return (
    <Container fluid id="traffic-updates-section" className="mb-4">
      <div className="traffic-updates-wrapper ms-2 me-2 mt-1 mb-3">
        <h4 className="mt-3">TRAFFIC UPDATES</h4>
        <div className="traffic-updates-inner-wrapper">
          <div className="traffic-updates-info">
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus non ducimus unde a odio id deserunt repudiandae rem, consequuntur omnis quod possimus voluptate aspernatur nobis! Necessitatibus, similique unde vero eveniet, aliquam odio molestias, porro culpa laboriosam eum explicabo magni quidem!</p>
          </div>
          <div className="traffic-updates-map">
              Fetched map will come here.
          </div>
        </div>
      </div>
    </Container>
  )
}

export default TrafficUpdates;