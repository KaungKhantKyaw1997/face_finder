import { NextApiHandler, NextApiRequest } from "next";
import formidable from "formidable";
import path from "path";
import fs from "fs/promises";

export const config = {
  api: {
    bodyParser: false,
  },
};

const readFile = (
  req: NextApiRequest,
  saveLocally: boolean,
  uploadDir: string
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const options: formidable.Options = {};
  if (saveLocally) {
    options.uploadDir = uploadDir;
    options.filename = (name, ext, path, form) => {
      return path.originalFilename + "";
    };
  }

  const form = formidable(options);
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

const handler: NextApiHandler = async (req, res) => {
  const { type } = req.query;
  const baseDir =
    process.env.NODE_ENV === "production" ? "/tmp" : process.cwd();
  const uploadDir = path.join(baseDir, `/public/${type}_faces`);

  try {
    await fs.readdir(uploadDir);
  } catch (error) {
    await fs.mkdir(uploadDir, { recursive: true });
  }

  try {
    const { fields, files } = await readFile(req, true, uploadDir);
    res.json({ done: "ok", fields, files });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export default handler;
