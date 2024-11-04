"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocationName = void 0;
const getLocationName = async ({ lat, lng }) => {
    if (!lat || !lng) {
        console.error("Latitude and longitude are required");
        return null;
    }
    const locationXmlRequest = `
      <REQUEST>
        <LOGIN authenticationkey="cc9e2bf1823a444cb75801b6777440c5"/>
        <QUERY objecttype="TrainStation" namespace="rail.infrastructure" schemaversion="1.5" limit="10">
          <FILTER><NEAR name="Geometry.WGS84" value="${lng} ${lat}" mindistance="0" maxdistance="4000" /></FILTER>
          <INCLUDE>AdvertisedLocationName</INCLUDE>
        </QUERY>
      </REQUEST>`;
    try {
        const locationResponse = await fetch("https://api.trafikinfo.trafikverket.se/v2/data.json", {
            method: "POST",
            headers: { "Content-Type": "text/xml" },
            body: locationXmlRequest,
        });
        if (!locationResponse.ok) {
            throw new Error(`Failed to fetch: ${locationResponse.statusText}`);
        }
        const locationData = await locationResponse.json();
        // Safeguard in case of unexpected response structure
        const locationAnnouncements = locationData?.RESPONSE?.RESULT?.[0]?.TrainStation || [];
        const locationNames = locationAnnouncements.map((location) => location.AdvertisedLocationName);
        console.log("Location Names:", locationNames);
        return locationNames[0] || null; // Return null if no locations found
    }
    catch (error) {
        console.error("Error fetching location name:", error);
        return null; // Return null in case of error
    }
};
exports.getLocationName = getLocationName;
//# sourceMappingURL=departure.controller.js.map