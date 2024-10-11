"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const PORT = 3005;
const app = (0, express_1.default)();
const corsOptions = {
    origin: ["http://localhost:3005"],
};
app.use((0, cors_1.default)(corsOptions));
// An example API request with root endpoint
app.get("/", (request, response) => {
    response.status(200).send("Hello World");
});
// An example API request with endpoint
// Link, endpoint, request parameter will be changed for the purpose.
app.get("/weather", (request, response) => {
    (async () => {
        const res = await fetch('https://api.nextbike.net/maps/gbfs/v1/nextbike_se/gbfs.json');
        const json = await res.json();
        console.log(json);
        response.status(200).send(json);
    })();
});
app.listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
}).on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
});
// import express, { Request, Response } from "express";
// const app = express();
// const PORT = 3005;
// app.get("/", (request: Request, response: Response) => {
//   response.status(200).send("Hello World");
// });
// // An example API request
// // Link, endpoint, request parameter will be changed for the purpose.
// app.get("/weather", (request: Request, response: Response) => {
//     (async () => {
//         const res = await fetch('https://api.nextbike.net/maps/gbfs/v1/nextbike_se/gbfs.json');
//         const json = await res.json();
//         console.log(json);
//         response.status(200).send(json);
//     })();
// });
// app.listen(PORT, () => {
//   console.log("Server running at PORT: ", PORT);
// }).on("error", (error) => {
//   // gracefully handle error
//   throw new Error(error.message);
// });
//# sourceMappingURL=main.js.map