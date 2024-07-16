import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const unknownFacesDir = path.resolve(
      process.env.NODE_ENV === "production"
        ? "/tmp/unknown_faces"
        : "./public/unknown_faces"
    );
    const knownFacesDir = path.resolve(
      process.env.NODE_ENV === "production"
        ? "/tmp/known_faces"
        : "./public/known_faces"
    );
    const microserviceUrl = process.env.MICROSERVICE_URL;

    if (!microserviceUrl) {
      return res
        .status(500)
        .json({ message: "Microservice URL is not configured" });
    }

    const response = await axios.post(microserviceUrl, {
      unknown_faces_dir: unknownFacesDir,
      known_faces_dir: knownFacesDir,
    });

    if (response.status === 200) {
      return res.status(200).json(response.data);
    } else {
      return res
        .status(response.status)
        .json({ message: "Error from microservice", data: response.data });
    }
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}
