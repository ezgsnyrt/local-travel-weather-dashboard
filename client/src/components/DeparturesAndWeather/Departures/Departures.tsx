import React, { useEffect, useState } from 'react';
import './Departures.css';
import { Button, Form, Pagination, Table } from 'react-bootstrap';

// Define the types
interface Station {
  label: string;
  value: string;
}

interface TrainAnnouncement {
  AdvertisedTimeAtLocation: string;
  ToLocation: string[];
  FromLocation: string[];
  InformationOwner: string;
  TrackAtLocation: string;
  TypeOfTraffic?: string;
}

interface FerryAnnouncement {
  DepartureTime: string;
  FromHarbor: string;
  ToLocation: string[];
  TypeOfTraffic: string;
}

const Departures = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for the search input
  const [announcements, setAnnouncements] = useState<(TrainAnnouncement | FerryAnnouncement)[]>([]);
  const [loading, setLoading] = useState(false);
  const [queryLoading, setQueryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Suggestions for station names
  const [suggestions, setSuggestions] = useState<Station[]>([]);

  // Fetch stations on component mount
  useEffect(() => {
    const preloadTrainStations = async () => {
      const xmlRequest = `
      <REQUEST>
        <LOGIN authenticationkey='cc9e2bf1823a444cb75801b6777440c5'/>
        <QUERY objecttype='TrainStation' schemaversion='1'>
          <FILTER/>
          <INCLUDE>Prognosticated</INCLUDE>
          <INCLUDE>AdvertisedLocationName</INCLUDE>
          <INCLUDE>LocationSignature</INCLUDE>
        </QUERY>
      </REQUEST>`;

      try {
        setLoading(true);
        const response = await fetch("https://api.trafikinfo.trafikverket.se/v2/data.json", {
          method: "POST",
          headers: { "Content-Type": "text/xml" },
          body: xmlRequest,
        });
        const data = await response.json();

        const stationList = data.RESPONSE.RESULT[0].TrainStation.map((item: any) => ({
          label: item.AdvertisedLocationName,
          value: item.LocationSignature,
        }));

        setStations(stationList);
      } catch (error) {
        console.error("Error fetching stations", error);
        setError("Could not load stations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    preloadTrainStations();
  }, []);

  // Handle station search input
  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    const filteredStations = stations.filter((s) =>
      s.label.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestions(filteredStations); // Update suggestions based on input
    const station = stations.find((s) => s.label.toLowerCase() === value.toLowerCase());
    setSelectedStation(station || null);
  };

  // Select a station from the suggestion list
  const handleSuggestionClick = (station: Station) => {
    setSelectedStation(station);
    setSearchTerm(station.label);
    setSuggestions([]); // Clear suggestions after selection
  };

  // Type guard for TrainAnnouncement
  const isTrainAnnouncement = (announcement: TrainAnnouncement | FerryAnnouncement): announcement is TrainAnnouncement => {
    return (announcement as TrainAnnouncement).InformationOwner !== undefined;
  };

  // Fetch trains and ferries
  const searchTrainsAndFerries = async () => {
    if (!selectedStation) return;

    // Fetch train announcements
    const trainXmlRequest = `
    <REQUEST>
      <LOGIN authenticationkey='cc9e2bf1823a444cb75801b6777440c5'/>
      <QUERY objecttype='TrainAnnouncement' orderby='AdvertisedTimeAtLocation' schemaversion='1'>
        <FILTER>
          <AND>
            <OR>
              <AND>
                <GT name='AdvertisedTimeAtLocation' value='$dateadd(-00:15:00)'/>
                <LT name='AdvertisedTimeAtLocation' value='$dateadd(14:00:00)'/>
              </AND>
              <GT name='EstimatedTimeAtLocation' value='$now'/>
            </OR>
            <EQ name='LocationSignature' value='${selectedStation.value}'/>
            <EQ name='ActivityType' value='Avgang'/>
          </AND>
        </FILTER>
        <INCLUDE>InformationOwner</INCLUDE>
        <INCLUDE>AdvertisedTimeAtLocation</INCLUDE>
        <INCLUDE>TrackAtLocation</INCLUDE>
        <INCLUDE>FromLocation</INCLUDE>
        <INCLUDE>ToLocation</INCLUDE>
        <INCLUDE>TypeOfTraffic</INCLUDE>
      </QUERY>
    </REQUEST>`;

    // Fetch ferry announcements
    const ferryXmlRequest = `
    <REQUEST>
      <LOGIN authenticationkey='cc9e2bf1823a444cb75801b6777440c5'/>
      <QUERY objecttype='FerryAnnouncement' orderby='DepartureTime' schemaversion='1'>
        <FILTER>
          <EQ name='FromHarbor' value='${selectedStation.value}'/>
          <EQ name='ActivityType' value='Avgang'/>
        </FILTER>
        <INCLUDE>DepartureTime</INCLUDE>
        <INCLUDE>FromHarbor</INCLUDE>
        <INCLUDE>ToLocation</INCLUDE>
        <INCLUDE>TypeOfTraffic</INCLUDE>
      </QUERY>
    </REQUEST>`;

    try {
      setQueryLoading(true);
      const [trainResponse, ferryResponse] = await Promise.all([
        fetch("https://api.trafikinfo.trafikverket.se/v2/data.json", {
          method: "POST",
          headers: { "Content-Type": "text/xml" },
          body: trainXmlRequest,
        }),
        fetch("https://api.trafikinfo.trafikverket.se/v2/data.json", {
          method: "POST",
          headers: { "Content-Type": "text/xml" },
          body: ferryXmlRequest,
        }),
      ]);

      const trainData = await trainResponse.json();
      const ferryData = await ferryResponse.json();

      const trainAnnouncements = trainData.RESPONSE.RESULT[0]?.TrainAnnouncement || [];
      const ferryAnnouncements = ferryData.RESPONSE.RESULT[0]?.FerryAnnouncement || [];

      // Combine both train and ferry announcements
      const combinedAnnouncements = [
        ...trainAnnouncements,
        ...ferryAnnouncements.map((ferry: any) => ({
          DepartureTime: ferry.DepartureTime,
          FromHarbor: ferry.FromHarbor,
          ToLocation: ferry.ToLocation,
          TypeOfTraffic: ferry.TypeOfTraffic,
        })),
      ];

      setAnnouncements(combinedAnnouncements);
      setCurrentPage(1); // Reset to the first page when new announcements are fetched
    } catch (error) {
      console.error("Error fetching train and ferry announcements", error);
      setError("Could not load announcements. Please try again later.");
    } finally {
      setQueryLoading(false);
    }
  };

  const formatTime = (timeString: string) => {
    const advertisedTime = new Date(timeString);
    const hours = advertisedTime.getHours().toString().padStart(2, "0");
    const minutes = advertisedTime.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const mapLocationLabels = (locations: string[]) => {
    return locations.map((loc) => {
      const station = stations.find((station) => station.value === loc);
      return station ? station.label : loc; // Show the label if found, else show the location signature
    }).join(", ") || "N/A";
  };

  // Pagination logic
  const indexOfLastAnnouncement = currentPage * rowsPerPage;
  const indexOfFirstAnnouncement = indexOfLastAnnouncement - rowsPerPage;
  const currentAnnouncements = announcements.slice(indexOfFirstAnnouncement, indexOfLastAnnouncement);

  // Calculate total pages
  const totalPages = Math.ceil(announcements.length / rowsPerPage);

  // Handle page change
  const handlePageChange = (direction: "next" | "prev") => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (


    <div className="departureContainer">
      {loading ? (
        <p>Laddar stationer...</p>
      ) : (
        <div>
          {/* Search Input */}
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              value={searchTerm}
              onChange={handleSearchInput}
              placeholder="Search station..."
              className="form-control"
            />
          </Form.Group>

          {/* Dropdown Suggestions */}
          {suggestions.length > 0 && (
            <ul className="list-group mb-3">
              {suggestions.slice(0, 4).map((suggestion) => (
                <li
                  key={suggestion.value}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="list-group-item list-group-item-action"
                >
                  {suggestion.label}
                </li>
              ))}

            </ul>
          )}

          {/* Search Button */}
          <Button
            variant="primary"
            onClick={searchTrainsAndFerries}
            disabled={!selectedStation}
            className="mb-3"
          >
            Search departures
          </Button>

          {/* Loading and Error Handling */}
          {queryLoading && <p>Loading departures</p>}
          {error && <p className="text-danger">{error}</p>}

          {/* Train and Ferry Announcements Table */}
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Time</th>
                <th>From</th>
                <th>To</th>
                <th>Platform</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {currentAnnouncements.map((announcement, index) => (
                <tr key={index}>
                  {isTrainAnnouncement(announcement) ? (
                    <>
                      <td>{formatTime(announcement.AdvertisedTimeAtLocation)}</td>
                      <td>{mapLocationLabels(announcement.FromLocation)}</td>
                      <td>{mapLocationLabels(announcement.ToLocation)}</td>
                      <td>{announcement.TrackAtLocation}</td>
                      <td>{announcement.TypeOfTraffic}</td>
                    </>
                  ) : (
                    <>
                      <td>{announcement.DepartureTime}</td>
                      <td>{mapLocationLabels(announcement.ToLocation)}</td>
                      <td>{announcement.FromHarbor}</td>
                      <td>{announcement.TypeOfTraffic}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination */}
          <Pagination className="justify-content-center">
            <Pagination.Prev
              onClick={() => handlePageChange("prev")}
              disabled={currentPage === 1}
            >
              Previous
            </Pagination.Prev>
            <Pagination.Item active>{`Page ${currentPage} of ${totalPages}`}</Pagination.Item>
            <Pagination.Next
              onClick={() => handlePageChange("next")}
              disabled={currentPage === totalPages}
            >
              Next
            </Pagination.Next>
          </Pagination>
        </div>
      )}
    </div>
  )

};

export default Departures;
