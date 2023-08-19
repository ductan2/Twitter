
import { Fields, File, Files, Part } from "formidable";
import fs from "fs"
import { Request } from 'express';
import { UPLOAD_TEMP_DIR } from "~/constants/dir";
import { includes } from "lodash";


export const initFolder = () => {
  if (!fs.existsSync(UPLOAD_TEMP_DIR)) {
    fs.mkdirSync(UPLOAD_TEMP_DIR, { recursive: true }) // auto create folder uploads 
  }
}

export const getFileName = (files: File): string => {
  console.log("🚀 ~ file: file.ts:15 ~ getFileName ~ files:", files)
  let nameFile = "";
  if (files && files && Array.isArray(files)) {
    const mediaFiles = files;
    for (const file of mediaFiles) {
      if (file.newFilename) {
        nameFile = file.newFilename;
      }
    }
  }
  if (files && files && !Array.isArray(files)) {
    const mediaFile = files;
    if (mediaFile.newFilename) {
      nameFile = mediaFile.newFilename;
    }
  }
  return nameFile;
};

export const isFileValid = (file: File) => {
  const nameFile = getFileName(file);
  const type = nameFile.split(".")[1];
  const validTypes = ["jpg", "jpeg", "png", "pdf"];
  if (validTypes.indexOf(type) === -1) {
    return false;
  }
  return true;
};

export const handleUploadFile = async (req: Request) => {
  const { default: formidable } = await import('formidable');
  const form = formidable({
    uploadDir: UPLOAD_TEMP_DIR,
    keepExtensions: true,
    multiples: true,
    maxFields: 1,
    maxFileSize: 2 * 1024 * 1024,
    filter: ({ name, originalFilename, mimetype }: Part): boolean => {
      // check ext empty file and type file
      const valid = name === 'image' && Boolean(mimetype?.includes("image/"))
      if (!valid) {
        form.emit('error' as any, new Error('File type is invalid') as any);
      }
      return valid;
    }
  });
  return new Promise(async (resolve, reject) => {
    try {
      form.parse(req, async (err, fields: Fields, files: Files) => {
        console.log("🚀 ~ file: file.ts:58 ~ form.parse ~ files:", files)
        if (err) {
          return reject({
            error: err.message,
            message: "Upload failed!",
            status: 400,
          });

        }
        if (!files.image) {
          return reject({
            message: "File is empty",
            status: 400,
          });

        }
        const file = files.image as File;
        const isCheckFile = isFileValid(file);
        if (!isCheckFile) {
          return reject({
            message: "File type is invalid",
            status: 415,
          });
        }
        resolve(files.image);
      });
    } catch (error) {
      reject({
        message: "Upload failed!",
        status: 400,
        error
      });
    }
  });
}