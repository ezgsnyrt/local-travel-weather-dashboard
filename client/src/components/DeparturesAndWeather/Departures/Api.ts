// api.ts
// api.ts
export const fetchTrainAnnouncements = async (stationValue: string) => {
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
            <EQ name='LocationSignature' value='${stationValue}'/>
            <EQ name='ActivityType' value='Avgang'/>
          </AND>
        </FILTER>
        <INCLUDE>AdvertisedTimeAtLocation</INCLUDE>
        <INCLUDE>TrackAtLocation</INCLUDE>
        <INCLUDE>FromLocation</INCLUDE>
        <INCLUDE>ToLocation</INCLUDE>
        <INCLUDE>TypeOfTraffic</INCLUDE>
      </QUERY>
    </REQUEST>`;

    try {
      const response = await fetch("https://api.trafikinfo.trafikverket.se/v2/data.json", {
        method: "POST",
        headers: { "Content-Type": "text/xml" },
        body: trainXmlRequest,
      });

      const trainData = await response.json();
      return trainData.RESPONSE.RESULT[0]?.TrainAnnouncement || [];
    } catch (error) {
      console.error("Error fetching train announcements", error);
      throw new Error("Could not load train announcements.");
    }
};

  

  // Fetch ferries API function
export const fetchFerries = async (location: string) => {
    const ferryXmlRequest = `
    <REQUEST>
      <LOGIN authenticationkey='cc9e2bf1823a444cb75801b6777440c5'/>
      <QUERY objecttype='FerryAnnouncement' orderby='DepartureTime' schemaversion='1.2'>
        <FILTER> <EQ name='FromHarbor.Name' value='${location}'/> </FILTER>
        <INCLUDE>DepartureTime</INCLUDE>
        <INCLUDE>FromHarbor</INCLUDE>
        <INCLUDE>ToHarbor</INCLUDE>
      </QUERY>
    </REQUEST>`;
  
    try {
      const ferryResponse = await fetch("https://api.trafikinfo.trafikverket.se/v2/data.json", {
        method: "POST",
        headers: { "Content-Type": "text/xml" },
        body: ferryXmlRequest,
      });
  
      const ferryData = await ferryResponse.json();
      const ferryAnnouncements = ferryData.RESPONSE.RESULT[0]?.FerryAnnouncement || [];
      return ferryAnnouncements.map((ferry: any) => ({
        DepartureTime: ferry.DepartureTime,
        FromHarbor: ferry.FromHarbor.Name,
        ToHarbor: ferry.ToHarbor.Name,
      }));
    } catch (error) {
      console.error("Error fetching ferry announcements", error);
      throw new Error("Could not load ferry announcements. Please try again later.");
    }
  };
  
 
  
 
  
  
  