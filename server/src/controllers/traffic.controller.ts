import axios from "axios";
import { Request, Response } from "express";

const url = "https://api.trafikinfo.trafikverket.se/v2/data.json";
const headers = {
    "Content-Type": "application/xml",
  };


export const fetchTrafficUpdates = async (req: Request, res: Response) => {
    const lng = req.body.lng;
    const lat = req.body.lat

    if (!lng  || !lat) {
        res.json({
            message: "Coordinates missing",
        })
        return;
    }
    const data = `
   <REQUEST>
  <LOGIN authenticationkey="0d573c6d58e448d0b4a97aaed9204dea"/>
  <QUERY objecttype="TrafficFlow" namespace="road.trafficinfo" schemaversion="1.5" limit="30">
    <FILTER>
    <WITHIN name ="Geometry.WGS84" shape="center" value="${lng} ${lat}" radius="20000m" />
    </FILTER>
  </QUERY>
</REQUEST>
   `;



    try {
      // getting data from trafficAPI
      const response = await axios.post(url, data, { headers });
      

      res.json(response.data);
    } catch (error:any) {
      console.error("Error fetching traffic data:", error.response.data.RESPONSE.RESULT[0].ERROR);

      res.status(500).json({ error: "Failed to fetch traffic data"  });
    }
  };