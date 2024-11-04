
import React from 'react';
import { Table } from 'react-bootstrap';
import { FerryAnnouncement, TrainAnnouncement } from './Departures';
import './Departures.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrain, faShip } from '@fortawesome/free-solid-svg-icons';

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
      {/* Standard table for larger screens */}
      <Table striped bordered hover className="d-none d-lg-table">
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
                  ? announcement.FromLocation.map(shortName => getFullStationName(shortName))[0]
                  : announcement.FromHarbor}
              </td>
              <td>
                {isTrainAnnouncement(announcement)
                  ? announcement.ToLocation.map(shortName => getFullStationName(shortName))[0]
                  : announcement.ToHarbor}
              </td>
              <td>{isTrainAnnouncement(announcement) ? announcement.TrackAtLocation : "X"}</td>
              <td>{isTrainAnnouncement(announcement) ? formatTime(announcement.AdvertisedTimeAtLocation) : formatTime(announcement.DepartureTime)}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {announcements.map((announcement, index) => (
        <div key={index} className="mobail">
          <div className="striped">
            <div className="mobile-row">
              <div className="mobile-type">
              {isTrainAnnouncement(announcement) ? (
                  <>
                    <FontAwesomeIcon icon={faTrain} /> 
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faShip} /> 
                  </>
                )}
              </div>
              <div className="mobile-details fromto">
                <div>
                  {isTrainAnnouncement(announcement)
                    ? announcement.FromLocation.map(shortName => getFullStationName(shortName))[0]
                    : announcement.FromHarbor}
                </div>
                &nbsp;-&nbsp;
                <div>
                  {isTrainAnnouncement(announcement)
                    ? announcement.ToLocation.map(shortName => getFullStationName(shortName))[0]
                    : announcement.ToHarbor}
                </div>
              </div>
            </div>
          </div>
          <div className="bordah">
            <div className="mobile-row">
              <div className="mobile-details">
                <div>
                  <strong>Departure Time:</strong>{" "}
                  {isTrainAnnouncement(announcement) ? formatTime(announcement.AdvertisedTimeAtLocation) : formatTime(announcement.DepartureTime)}
                </div>
                <div>
                  <strong>Track:</strong>{" "}
                  {isTrainAnnouncement(announcement) ? announcement.TrackAtLocation : "X"}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnnouncementsTable;





