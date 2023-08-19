import { Request } from 'express';
import path from 'path';
import sharp from 'sharp';
import { UPLOAD_DIR } from '~/constants/dir';
import { getFileName, handleUploadFile } from "~/utils/file";
import fs from 'fs';
import { isProduction } from '~/constants/config';
import { config } from 'dotenv';
import { Media, mediaType } from '~/constants/commonType';
import { File, Files } from 'formidable';
config();

export default class MediaServices {
  async uploadFile(req: Request) {
    const files = await handleUploadFile(req) as any;
    const result: Media[] = await Promise.all(files.map(async (file: File) => {
      const fileName = getFileName(file)
      const newPath = path.resolve(UPLOAD_DIR, `${fileName}`)
      await sharp(file.filepath).jpeg().toFile(newPath)
      fs.unlink(file.filepath, (err) => {
        console.log(err)
      })
      return {
        url: isProduction ? `${process.env.HOST}/uploads/image/${fileName}`
          : `http://localhost:${process.env.PORT}/uploads/image/${fileName}`,
        type: mediaType.Image
      }
    }))
    return result;
  }
}