import React, { useEffect, useState } from "react";
import "./TrafficUpdates.css";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import axios from "axios";

const TrafficUpdates = () => {
  type Position = [number, number];

  const positionArray: Position[] = [
    [56.04587001491054, 12.697239762273881],
    [56.14587001491054, 12.797239762273881],
    [56.24587001491054, 12.897239762273881],
  ];

  const [apiData, setApiData] = useState({});

  const url = "https://api.trafikinfo.trafikverket.se/v2/data.json";
  const headers = {
    "Content-Type": "application/xml",
  };

  const data = `
<REQUEST>
  <LOGIN authenticationkey="0d573c6d58e448d0b4a97aaed9204dea"/>
  <QUERY objecttype="Situation" schemaversion="1.5" limit="10">
    <FILTER></FILTER>
  </QUERY>
</REQUEST>
`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(url, data, { headers });
        // console.log("Api response", response.data);
        setApiData(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, []);

  //   const situation = apiData.RESPONSE.RESULT[0].Situation || [];
  // console.log("situation", situation);

  // const processedDeviations = situation.map((item) => {
  // if (item.Deviation) {
  // return item.deviation.map((Deviation) => {
  // return {
  // AffectedDirection: Deviation.AffectedDirection,
  // AffectedDirectionValue: Deviation.AffectedDirectionValue,
  // };
  // });
  // }

  // return [];
  // });

  //  console.log("processedDeviations", processedDeviations);

  return (
    <div className="traffic-container">
      <h4 className="mt-2">TRAFFIC UPDATES</h4>
      <div className="traffic-updates-wrapper">
        <div className="traffic-updates-info">
          <p>Traffic issues will be listed here.</p>
        </div>
        <div className="traffic-updates-map ">
          <MapContainer
            style={{ height: "40vh" }}
            center={[56.04587001491054, 12.697239762273881]}
            zoom={15}
            maxZoom={30}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />

            {positionArray.map((pos, index) => (
              <Marker key={index} position={pos} />
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default TrafficUpdates;
