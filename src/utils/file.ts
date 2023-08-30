
import { Fields, File, Files, Part } from "formidable";
import fs from "fs"
import { Request } from 'express';
import { UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR, UPLOAD_VIDEO_TEMP_DIR } from "~/constants/dir";



export const initFolder = () => {
  [UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_TEMP_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

export const getFileName = (files: File): string => {
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


export const handleuploadImage = async (req: Request) => {
  const { default: formidable } = await import('formidable');
  const form = formidable({
    uploadDir: UPLOAD_IMAGE_TEMP_DIR,
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

export const handleUploadVideo = async (req: Request) => {
  const { default: formidable } = await import('formidable');
  const form = formidable({
    uploadDir: UPLOAD_VIDEO_DIR,
    keepExtensions: true,
    multiples: true,
    maxFields: 1,
    maxFileSize: 50 * 1024 * 1024,
    filter: ({ name, originalFilename, mimetype }: Part): boolean => {
      // check ext empty file and type file
      const valid = name === 'video' && Boolean(mimetype?.includes("video/"))
      if (!valid) {
        form.emit('error' as any, new Error('File type is invalid') as any);
      }
      return valid;
    }
  });
  return new Promise(async (resolve, reject) => {
    try {
      form.parse(req, async (err, fields: Fields, files: Files) => {
        if (err) {
          return reject({
            error: err.message,
            message: "Upload failed!",
            status: 400,
          });
        }
        if (!files.video) {
          return reject({
            message: "File is empty",
            status: 400,
          });
        }
        // const videos = files.video as File[];
        // videos.forEach((video) => {
        //   const extName = path.extname(video.originalFilename as string); // get extname file
        //   console.log("🚀 ~ file: file.ts:115 ~ videos.forEach ~ extName:", extName)
        //   fs.renameSync(video.filepath, video.filepath + "." + extName); // renmae file 
        // })

        resolve(files.video);
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
