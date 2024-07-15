import { NextApiHandler } from "next";
import path from "path";
import fs from "fs/promises";

const handler: NextApiHandler = async (req, res) => {
  const { type } = req.query;

  if (!type) {
    return res.status(400).json({ error: "Type is required" });
  }

  const folderPath = path.join(process.cwd(), `/public/${type}_faces`);

  try {
    await fs.rm(folderPath, { recursive: true, force: true });
    return res.status(200).json({ message: "Folder deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export default handler;
