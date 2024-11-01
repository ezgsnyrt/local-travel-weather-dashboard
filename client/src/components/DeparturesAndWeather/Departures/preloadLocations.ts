// locationService.ts
const API_URL = "https://api.trafikinfo.trafikverket.se/v2/data.json";

export const preloadLocations = async (setLoading: (loading: boolean) => void, setStations: (stations: any[]) => void, setError: (error: string | null) => void) => {
    const trainXmlRequest = `
      <REQUEST>
        <LOGIN authenticationkey='cc9e2bf1823a444cb75801b6777440c5'/>
        <QUERY objecttype='TrainStation' schemaversion='1'>
          <FILTER/>
          <INCLUDE>Prognosticated</INCLUDE>
          <INCLUDE>AdvertisedLocationName</INCLUDE>
          <INCLUDE>LocationSignature</INCLUDE>
        </QUERY>
      </REQUEST>`;

    const ferryXmlRequest = `
      <REQUEST>
        <LOGIN authenticationkey='cc9e2bf1823a444cb75801b6777440c5'/>
        <QUERY objecttype='FerryAnnouncement' schemaversion='1.2'>
          <FILTER></FILTER>
          <INCLUDE>FromHarbor</INCLUDE>
          <INCLUDE>ToHarbor</INCLUDE>
        </QUERY>
      </REQUEST>`;

    try {
        setLoading(true);
        
        // Fetch train stations and ferry harbors in parallel
        const [trainResponse, ferryResponse] = await Promise.all([
            fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "text/xml" },
                body: trainXmlRequest,
            }),
            fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "text/xml" },
                body: ferryXmlRequest,
            }),
        ]);

        const trainData = await trainResponse.json();
        const ferryData = await ferryResponse.json();

        // Process train stations
        const stationList = trainData.RESPONSE.RESULT[0].TrainStation.map((item: any) => ({
            label: item.AdvertisedLocationName,
            value: item.LocationSignature,
        }));

        // Process ferry harbors (both from and to harbors)
        const ferryHarbors = new Set(); // Use a set to avoid duplicates
        ferryData.RESPONSE.RESULT[0].FerryAnnouncement.forEach((ferry: any) => {
            ferryHarbors.add(ferry.FromHarbor.Name);
            ferryHarbors.add(ferry.ToHarbor.Name);
        });

        const harborList = Array.from(ferryHarbors).map((harbor) => ({
            label: harbor
        }));

        // Combine both train stations and harbors
        setStations([...stationList, ...harborList]);
    } catch (error) {
        console.error("Error fetching stations or harbors", error);
        setError("Could not load stations or harbors. Please try again later.");
    } finally {
        setLoading(false);
    }
};
