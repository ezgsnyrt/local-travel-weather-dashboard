"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTrafficUpdates = void 0;
const axios_1 = __importDefault(require("axios"));
const url = "https://api.trafikinfo.trafikverket.se/v2/data.json";
const headers = {
    "Content-Type": "application/xml",
};
const fetchTrafficUpdates = async (req, res) => {
    const lng = req.body.lng;
    const lat = req.body.lat;
    if (!lng || !lat) {
        res.json({
            message: "Coordinates missing",
        });
        return;
    }
    const data = `
   <REQUEST>
  <LOGIN authenticationkey="0d573c6d58e448d0b4a97aaed9204dea"/>
  <QUERY objecttype="TrafficFlow" namespace="road.trafficinfo" schemaversion="1.5" limit="15">
    <FILTER>
    <WITHIN name ="Geometry.WGS84" shape="center" value="${lng} ${lat}" radius="20000m" />
    </FILTER>
  </QUERY>
</REQUEST>
   `;
    try {
        // getting data from trafficAPI
        const response = await axios_1.default.post(url, data, { headers });
        res.json(response.data);
    }
    catch (error) {
        console.error("Error fetching traffic data:", error.response.data.RESPONSE.RESULT[0].ERROR);
        res.status(500).json({ error: "Failed to fetch traffic data" });
    }
};
exports.fetchTrafficUpdates = fetchTrafficUpdates;
//# sourceMappingURL=traffic.controller.js.map