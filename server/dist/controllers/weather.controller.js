"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeatherdata = void 0;
const axios_1 = __importDefault(require("axios"));
async function fetchWeatherData(coordinates) {
    const apiKey = 'f40f4543214ad55ead8d6ca12cb39ee0';
    console.log("test", coordinates);
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lng}&units=metric&appid=${apiKey}`;
    try {
        const response = await axios_1.default.get(url);
        return response.data;
    }
    catch (error) {
        throw new Error('Failed to fetch weather data');
    }
}
;
const getWeatherdata = async (req, res) => {
    try {
        const { lat, lng } = req.query;
        if (!lat || !lng) {
            res.status(400).json({ error: 'Coordinates are required (lat and lon)' });
            return;
        }
        const coordinates = {
            lat: parseFloat(lat),
            lng: parseFloat(lng),
        };
        const result = await fetchWeatherData(coordinates);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
};
exports.getWeatherdata = getWeatherdata;
//# sourceMappingURL=weather.controller.js.map