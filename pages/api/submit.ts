import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const unknownFacesDir = path.resolve("./public/unknown_faces");
    const knownFacesDir = path.resolve("./public/known_faces");

    const response = await axios.post("http://127.0.0.1:5000/detect_faces", {
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
