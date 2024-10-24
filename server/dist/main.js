"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const address_controller_1 = require("./controllers/address.controller");
const hotel_controller_1 = require("./controllers/hotel.controller");
const weather_controller_1 = require("./controllers/weather.controller");
const PORT = 3005;
const app = (0, express_1.default)();
const corsOptions = {
    origin: ['http://localhost:3001'], // Front-end local host
};
app.use((0, cors_1.default)(corsOptions));
// You can put the endpoints and request handlers here
app.get('/coordinates', address_controller_1.getCoordinates);
app.get('/autocomplete', address_controller_1.predictAddress);
app.get('/hotels', hotel_controller_1.fetchHotel);
app.get("/weatherforecast", weather_controller_1.getWeatherdata);
app.listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
}).on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
});
//# sourceMappingURL=main.js.map