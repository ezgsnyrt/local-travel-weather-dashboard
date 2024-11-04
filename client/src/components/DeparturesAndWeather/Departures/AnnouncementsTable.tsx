import React from 'react';
import { Table } from 'react-bootstrap';
import { FerryAnnouncement, TrainAnnouncement } from './Departures';

interface AnnouncementsTableProps {
  announcements: (TrainAnnouncement | FerryAnnouncement)[];
  formatTime: (timeString: string) => string;
  getFullStationName: (shortName: string) => string;
}

const AnnouncementsTable: React.FC<AnnouncementsTableProps> = ({
  announcements,
  formatTime,
  getFullStationName,
}) => {
  const isTrainAnnouncement = (announcement: TrainAnnouncement | FerryAnnouncement): announcement is TrainAnnouncement => {
    return (announcement as TrainAnnouncement).FromLocation !== undefined;
  };

  return (
    <div className="table-responsive"> 
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Type</th>
            <th>From</th>
            <th>To</th>
            <th>Track</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {announcements.map((announcement, index) => (
            <tr key={index}>
              <td>{isTrainAnnouncement(announcement) ? announcement.TypeOfTraffic : "Ferry"}</td>
              <td>
                {isTrainAnnouncement(announcement)
                  ? announcement.FromLocation.map(shortName => getFullStationName(shortName)).join(", ")
                  : announcement.FromHarbor}
              </td>
              <td>
                {isTrainAnnouncement(announcement)
                  ? announcement.ToLocation.map(shortName => getFullStationName(shortName)).join(", ")
                  : announcement.ToHarbor}
              </td>
              <td>{isTrainAnnouncement(announcement) ? announcement.TrackAtLocation : "X"}</td>
              <td>{isTrainAnnouncement(announcement) ? formatTime(announcement.AdvertisedTimeAtLocation) : formatTime(announcement.DepartureTime)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AnnouncementsTable;
