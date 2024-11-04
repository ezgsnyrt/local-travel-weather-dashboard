import { useEffect, useState } from 'react';
import './Departures.css';
import AnnouncementsTable from './AnnouncementsTable';
import PaginationControls from './PaginationControls';
import {fetchFerries, fetchTrainAnnouncements } from './Api';
import { preloadLocations } from './preloadLocations';

// Define the types
interface Station {
  label: string;
  value: string;
}

export interface TrainAnnouncement {
  AdvertisedTimeAtLocation: string;
  ToLocation: string[];
  FromLocation: string[];
  TrackAtLocation: string;
  TypeOfTraffic?: string;
}

export interface FerryAnnouncement {
  DepartureTime: string;
  FromHarbor: string;
  ToHarbor: string;
}

interface DeparturesProps {
  locationName: string | null; // This will come from UserInput
}

const Departures = ({ locationName }: DeparturesProps) => {
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [announcements, setAnnouncements] = useState<(TrainAnnouncement | FerryAnnouncement)[]>([]);
  const [loading, setLoading] = useState(false);
  const [queryLoading, setQueryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cleanedLocationName = locationName
  ?.replace(', Sweden', '')
  .trim()
  .split(' ')
  .slice(0, 2) // Get the first two words
  .join(' '); // Join them back into a string

  const [announcementsFetched, setAnnouncementsFetched] = useState(false);


  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Fetch stations on component mount
  useEffect(() => {
    const fetchLocations = async () => {
        await preloadLocations(setLoading, setStations, setError);
    };

    fetchLocations();
}, [locationName]);

  
  // Fetch trains and ferries when locationName changes
  // useEffect for fetching announcements when locationName changes
useEffect(() => {
  if (!locationName) return; // Do nothing if locationName is null or empty
  
  // Clear previous announcements and reset pagination for a new search
  setAnnouncements([]); // Clear old announcements
  setCurrentPage(1); // Reset pagination to the first page

  // Find the station by name
  const station = stations.find((s) => s.label.toLowerCase() === locationName.toLowerCase());
  setSelectedStation(station || null); // Update selected station

  if (station) {
    // Fetch trains if it's a valid station
    searchTrains(station);
  } else if (cleanedLocationName) {
    // Fetch ferries if cleanedLocationName is valid
    searchFerries(cleanedLocationName);
  }
  
  setLoading(false); // Stop loading after setting up fetch
}, [locationName, stations]); // Remove announcementsFetched dependency

  


  // Type guard for TrainAnnouncement


  // Fetch trains
  const searchTrains = async (station: Station) => {
    try {
      setQueryLoading(true);
      const trainAnnouncements = await fetchTrainAnnouncements(station.value);
      setAnnouncements((prev) => [...prev, ...trainAnnouncements]);
    } catch (error) {
      console.error("Error fetching train announcements", error);
      setError("Could not load train announcements. Please try again later.");
    } finally {
      setQueryLoading(false);
    }
};

  // Fetch ferries
  const searchFerries = async (location: string) => {
    try {
      setQueryLoading(true); // Start loading state
      
      // Call the fetchFerries function, passing the location
      const ferryAnnouncements = await fetchFerries(location);
  
      // Update the announcements state with the fetched ferry data
      setAnnouncements((prev) => [...prev, ...ferryAnnouncements]);
    } catch (error) {
      console.error("Error fetching ferry announcements", error);
      setError("Could not load ferry announcements. Please try again later.");
    } finally {
      setQueryLoading(false); // Stop loading state
    }
  };
  

  const formatTime = (timeString: string) => {
    const advertisedTime = new Date(timeString);
    const hours = advertisedTime.getHours().toString().padStart(2, "0");
    const minutes = advertisedTime.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };



  // Calculate current announcements for pagination
  const indexOfLastAnnouncement = currentPage * rowsPerPage;
  const indexOfFirstAnnouncement = indexOfLastAnnouncement - rowsPerPage;
  const currentAnnouncements = announcements.slice(indexOfFirstAnnouncement, indexOfLastAnnouncement);
  const totalPages = Math.ceil(announcements.length / rowsPerPage);

  const handlePageChange = (direction: "next" | "prev") => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const getFullStationName = (shortName: string) => {
    const station = stations.find(s => s.value === shortName);
    return station ? station.label : shortName; // Return the full name or the short name if not found
  };

  return (
    <div className="departures">
      <h1>Departures</h1>
      {loading && <p>Loading stations and harbors...</p>}
      {error && <p className="error">{error}</p>}
      {selectedStation && (
        <div>
          <h2>{selectedStation.label}</h2>
        </div>
      )}
      {queryLoading && <p>Loading announcements...</p>}
      <AnnouncementsTable announcements={currentAnnouncements} formatTime={formatTime} getFullStationName={getFullStationName}/>
      <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange}/>
    </div>
  );
};

export default Departures;
