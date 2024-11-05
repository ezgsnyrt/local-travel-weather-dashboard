import React, { useEffect, useState } from "react";
import "./TrafficUpdates.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import axios from "axios";

interface TrafficFlow {
  SiteId: string;
  MeasurementTime: string;
  VehicleFlowRate: number;
  AverageVehicleSpeed: number;
  DataQuality: string;
  MeasurementOrCalculationPeriod: string;
  VehicleType: string;
  CountyNo: number;
  regionId: number;
  SpecificLane: string;
  MeasurementSide: string;
  ModifiedTime: string;
  Geometry: {
    WGS84: string;
  };
}

interface TrafficUpdatesProps {
  coordinates: {
    lat: number;
    lng: number;
  } | null;
}

interface Position {
  position: [number, number];
  details: TrafficFlow;
}

const RecenterMap = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
};

const TrafficUpdates: React.FC<TrafficUpdatesProps> = ({ coordinates }) => {
  const [positions, setPositions] = useState<Position[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!coordinates?.lat || !coordinates?.lng) return;

      try {
        const response = await axios.post(
          "http://localhost:3005/traffic-updates",
          { lat: coordinates.lat, lng: coordinates.lng }
        );

        const trafficFlowData: TrafficFlow[] =
          response.data?.RESPONSE?.RESULT?.[0]?.TrafficFlow || [];

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

        setPositions(positionArray);
      } catch (error) {
        console.error("Error fetching traffic data:", error);
      }
    };
    fetchData();
  }, [coordinates?.lat, coordinates?.lng]);

  return (
    <div style={{ background: "white" }} className="traffic-container">
      <h4 className="mt-2">TRAFFIC UPDATES</h4>

      {!positions?.length ? (
        <p>No location</p>
      ) : (
        <MapContainer
          style={{ height: "50vh", width: "100%" }}
          center={coordinates ? [coordinates.lat, coordinates.lng] : [0, 0]}
          zoom={12}
          maxZoom={30}
        >
          <RecenterMap
            center={coordinates ? [coordinates.lat, coordinates.lng] : [0, 0]}
          />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />

          {positions
            .slice()
            .sort(() => Math.random() - 0.5)
            .map((pos) => (
              <Marker
                key={pos.details.regionId || Math.random()}
                position={pos.position}
              >
                <Popup>
                  <div>
                    <p>
                      <strong>Site ID:</strong> {pos.details.SiteId}
                    </p>
                    <p>
                      <strong>Data Quality:</strong>
                      {pos.details.DataQuality}
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
                      <strong>Data Quality:</strong>
                      {pos.details.DataQuality}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      )}
    </div>
  );
};

export default TrafficUpdates;
