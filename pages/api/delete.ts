import { NextApiHandler } from "next";
import path from "path";
import fs from "fs/promises";

const handler: NextApiHandler = async (req, res) => {
  const { type } = req.query;

  if (!type) {
    return res.status(400).json({ error: "Type is required" });
  }

  const folderPath = path.join(process.cwd(), `/public/${type}_faces`);
  console.log(`Deleting folder: ${folderPath}`);

  try {
    await fs.rm(folderPath, { recursive: true, force: true });
    console.log(`Folder deleted successfully: ${folderPath}`);
    return res.status(200).json({ message: "Folder deleted successfully" });
  } catch (error: any) {
    console.error(`Error deleting folder: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
};

export default handler;
