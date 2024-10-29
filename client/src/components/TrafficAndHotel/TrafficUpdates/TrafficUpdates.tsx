import React, { useEffect, useState } from "react";
import "./TrafficUpdates.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";

const TrafficUpdates = () => {
  const [positions, setPositions] = useState([]);

  const url = "https://api.trafikinfo.trafikverket.se/v2/data.json";
  const headers = {
    "Content-Type": "application/xml",
  };

  const data = ` <REQUEST>
  <LOGIN authenticationkey="0d573c6d58e448d0b4a97aaed9204dea"/>
  <QUERY objecttype="TrafficFlow" namespace="road.trafficinfo" schemaversion="1.5" limit="10">
    <FILTER></FILTER>
  </QUERY>
</REQUEST> `;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(url, data, { headers });

        console.log("useEffect içinde gelen data", response.data);

        const trafficFlowData =
          response.data?.RESPONSE?.RESULT?.[0]?.TrafficFlow || [];

        // getting position from data
        const positionArray = trafficFlowData
          .map((trafficFlow) => {
            const pointString = trafficFlow.Geometry.WGS84;
            const coordinates = pointString.match(/POINT \(([^ ]+) ([^ ]+)\)/);

            if (coordinates) {
              const lon = parseFloat(coordinates[1]);
              const lat = parseFloat(coordinates[2]);
              return { position: [lat, lon], details: trafficFlow };
            }

            return null;
          })
          .filter(Boolean);

        console.log("positionArray", positionArray);
        setPositions(positionArray);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="traffic-container">
      <h4 className="mt-2">TRAFFIC UPDATES</h4>

      <MapContainer
        style={{ height: "40vh", width: "100%" }}
        center={positions.length ? positions[0].position : [56.04673, 12.69437]}
        zoom={12}
        maxZoom={30}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {positions.map((pos, index) => (
          <Marker key={index} position={pos.position}>
            <Popup>
              <div>
                <p>
                  <strong>Site ID:</strong> {pos.details.SiteId}
                </p>
                <p>
                  <strong>Measurement Time:</strong>{" "}
                  {pos.details.MeasurementTime}
                </p>
                <p>
                  <strong>Vehicle Flow Rate:</strong>{" "}
                  {pos.details.VehicleFlowRate}
                </p>
                <p>
                  <strong>Average Speed:</strong>{" "}
                  {pos.details.AverageVehicleSpeed} km/h
                </p>
                <p>
                  <strong>Data Quality:</strong> {pos.details.DataQuality}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default TrafficUpdates;
