import express, { RequestHandler, Request, Response } from 'express';
import axios from 'axios';
console.log('API Key: ', process.env.KEY);

interface GeocodeResponse {
  results: {
    geometry: {
      location: {
        lag: number;
        lng: number;
      };
    };
  }[];
}
async function getCoordsForAddress(address: string) {
  const response = await axios.get<GeocodeResponse>(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${process.env.KEY}`
  );

  const data = response.data;
  const location = data.results[0].geometry.location;
  console.log(location);
  return location;
}

export const getCoordinates: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const address = req.query.address as string;
  const result = await getCoordsForAddress(address);
  res.send(result);
};

export const predictAddress: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const input = req.query.input as string;

  const response = await axios({
    method: 'post',
    url: 'https://places.googleapis.com/v1/places:autocomplete',
    data: {
      input: input,
      includedRegionCodes: ['se'],
    },
    headers: {
      'X-Goog-Api-Key': process.env.KEY,
    },
  });
  console.log(JSON.stringify(response.data));

  res.send(response.data);
};
