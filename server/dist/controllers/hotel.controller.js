"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchHotel = void 0;
const axios_1 = __importDefault(require("axios"));
const fetchHotel = async (req, res) => {
    //* Receiving lat and lng by depending users address.
    const { lat, lng } = req.query;
    try {
        const response = await axios_1.default.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=lodging&key=AIzaSyAvM90CpjRpKkRCVcWsO59hOrVaBFIr7ek`);
        const hotelData = response.data.results.slice(0, 3);
        hotelData.forEach(hotel => {
            console.log(hotel);
        });
        console.log("Hotel Data" + JSON.stringify(hotelData, null, 2));
        //* Receiving hotels' name, website and image through the response(lat and lng)
        const hotelDetails = await Promise.all(hotelData.map(async (hotel) => {
            const placeDetails = await axios_1.default.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${hotel.place_id}&fields=name,website,photos&key=AIzaSyAvM90CpjRpKkRCVcWsO59hOrVaBFIr7ek`);
            const result = placeDetails.data.result;
            //* Sometime phones are unavailable, so added if condition.
            const imgUrl = result.photos
                ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photoreference=${result.photos[0].photo_reference}&key=AIzaSyAvM90CpjRpKkRCVcWsO59hOrVaBFIr7ek`
                : '';
            return {
                name: result.name,
                imgUrl: imgUrl,
                website: result.website || 'No website found😶',
            };
        }));
        res.json(hotelDetails);
    }
    catch (error) {
        res.status(500).send('Failed to fetch hotel API');
    }
};
exports.fetchHotel = fetchHotel;
//# sourceMappingURL=hotel.controller.js.map