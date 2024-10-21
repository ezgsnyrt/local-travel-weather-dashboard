"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchHotel = void 0;
const axios_1 = __importDefault(require("axios"));
const fetchHotel = async (req, res) => {
    const { lat, lng } = req.query;
    try {
        const response = await axios_1.default.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=lodging&key=${process.env.HOTEL_APT_KEY}`);
        const hotelData = response.data.results.slice(0, 3);
        console.log(hotelData);
    }
    catch (error) {
        throw new Error('Failed to fetch hotel API');
    }
};
exports.fetchHotel = fetchHotel;
//# sourceMappingURL=hotel.controller.js.map