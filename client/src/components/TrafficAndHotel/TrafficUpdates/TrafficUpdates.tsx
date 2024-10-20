import axios from "axios";
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "./TrafficUpdates.css";

const TrafficUpdates = () => {
  type Position = [number, number];

  const [positions, setPositions] = useState([]);

  interface Deviation {
    RoadNumber: string;
    AffectedDirection: string;
    AffectedDirectionValue: string;
  }

  interface Situation {
    ModifiedTime: string;
    Deviation: Deviation[];
  }

  interface ApiResponse {
    RESPONSE: {
      RESULT: {
        Situation: Situation[];
      }[];
    };
  }

  const [apiData, setApiData] = useState<ApiResponse | {}>({});

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

        setApiData(response.data);

        const situations =
          (response.data as ApiResponse)?.RESPONSE?.RESULT?.[0]?.Situation ||
          [];

        const positionArray = situations.flatMap((situation) =>
          situation.Deviation.map((deviation) => {
            // "POINT (longitude latitude)" formatından verileri çıkartıyoruz
            const pointString = deviation.Geometry.Point.WGS84;
            const coordinates = pointString.match(/POINT \(([^ ]+) ([^ ]+)\)/);
            const lon = parseFloat(coordinates[1]); // Longitude
            const lat = parseFloat(coordinates[2]); // Latitude

            return [lat, lon]; // [Latitude, Longitude] formatında döndür
          })
        );
        console.log("positionArray", positionArray);
        setPositions(positionArray);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, []);

  console.log("api data:", apiData);

  const onClickMarker = (index) => {
    console.log(" index clicked", index);
  };

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
            center={
              positions.length
                ? positions[0]
                : [56.04587001491054, 12.697239762273881]
            }
            zoom={5}
            maxZoom={30}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />

            {positions.map((pos, index) => (
              <div key={index} onClick={() => onClickMarker(index)}>
                <Marker position={pos} />
              </div>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default TrafficUpdates;
