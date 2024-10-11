import express, { Request, Response } from "express";
import cors from 'cors';

const PORT = 3005;
const app = express();
const corsOptions = {
    origin: ["http://localhost:3005"],
};

app.use(cors(corsOptions));


// An example API request with root endpoint
app.get("/", (request: Request, response: Response) => {
  response.status(200).send("Hello World");
});


// An example API request with endpoint
// Link, endpoint, request parameter will be changed for the purpose.
app.get("/weather", (request: Request, response: Response) => {
    (async () => {
        const res = await fetch('https://api.nextbike.net/maps/gbfs/v1/nextbike_se/gbfs.json');
        const json = await res.json();
        console.log(json);
        response.status(200).send(json);
    })();
});


app.listen(PORT, () => {
  console.log("Server running at PORT: ", PORT);
}).on("error", (error:any) => {
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