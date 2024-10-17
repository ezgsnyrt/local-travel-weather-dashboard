"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchWeatherData = void 0;
const axios_1 = __importDefault(require("axios"));
const fetchWeatherData = async (coordinates) => {
    const apiKey = 'f40f4543214ad55ead8d6ca12cb39ee0';
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${apiKey}`;
    try {
        const response = await axios_1.default.get(url);
        return response.data;
    }
    catch (error) {
        throw new Error('Failed to fetch weather data');
    }
};
exports.fetchWeatherData = fetchWeatherData;
//# sourceMappingURL=weather.controller.js.map