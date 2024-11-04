import React, { useEffect, useState } from "react";
import "./TrafficUpdates.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";

//Type - TrafficFlow data structure
interface TrafficFlow {
  SiteId: string;
  MeasurementTime: string;
  VehicleFlowRate: number;
  AverageVehicleSpeed: number;
  DataQuality: string;
  Geometry: {
    WGS84: string;
  };
}

// Type - position type with lat/lon and details
interface Position {
  position: [number, number];
  details: TrafficFlow;
}

const TrafficUpdates: React.FC = () => {
  const [positions, setPositions] = useState<Position[]>([]);

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

        console.log("Fetched data:", response.data);

        const trafficFlowData: TrafficFlow[] =
          response.data?.RESPONSE?.RESULT?.[0]?.TrafficFlow || [];

        // gettingg positions from data
        const positionArray: Position[] = trafficFlowData
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
          .filter((item): item is Position => item !== null);

        console.log("Position Array:", positionArray);
        setPositions(positionArray);
      } catch (error) {
        console.error("Error fetching traffic data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="traffic-container">
      <h4 className="mt-2">TRAFFIC UPDATES</h4>

      <MapContainer
        style={{ height: "50vh", width: "100%" }}
        center={positions.length ? positions[0].position : [59.3293, 18.0686]}
        zoom={13}
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
