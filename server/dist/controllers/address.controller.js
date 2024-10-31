"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.predictAddress = exports.getCoordinates = void 0;
const axios_1 = __importDefault(require("axios"));
async function getCoordsForAddress(address) {
    const response = await axios_1.default.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyD7VrTsMRUAYbNzASLk-1BdfNIXoTEzL5s`);
    const data = response.data;
    const location = data.results[0].geometry.location;
    console.log(location);
    return location;
}
const getCoordinates = async (req, res) => {
    const address = req.query.address;
    const result = await getCoordsForAddress(address);
    res.send(result);
};
exports.getCoordinates = getCoordinates;
const predictAddress = async (req, res) => {
    const input = req.query.input;
    const response = await (0, axios_1.default)({
        method: 'post',
        url: 'https://places.googleapis.com/v1/places:autocomplete',
        data: {
            input: input,
            includedRegionCodes: ['se'],
        },
        headers: {
            'X-Goog-Api-Key': "AIzaSyD7VrTsMRUAYbNzASLk-1BdfNIXoTEzL5s",
        },
    });
    console.log(JSON.stringify(response.data));
    res.send(response.data);
};
exports.predictAddress = predictAddress;
//# sourceMappingURL=address.controller.js.map