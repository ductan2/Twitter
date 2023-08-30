import { Request } from 'express';
import path from 'path';
import sharp from 'sharp';
import { UPLOAD_IMAGE_DIR } from '~/constants/dir';
import { getFileName, handleUploadVideo, handleuploadImage } from "~/utils/file";
import fs from 'fs';
import { isProduction } from '~/constants/config';
import { config } from 'dotenv';
import { Media, mediaType } from '~/constants/commonType';
import { File, Files } from 'formidable';
import databaseServices from './database.services';
import VideoStatus from '~/models/schemas/videoStatus.schema';
config();


export default class MediaServices {
  async uploadImage(req: Request) {
    const files = await handleuploadImage(req) as any;
    const result: Media[] = await Promise.all(files.map(async (file: File) => {
      const fileName = getFileName(file)
      const newPath = path.resolve(UPLOAD_IMAGE_DIR, `${fileName}`)
      await sharp(file.filepath).jpeg().toFile(newPath)
      fs.unlink(file.filepath, (err) => {
        console.log(err)
      })
      return {
        url: isProduction ? `${process.env.HOST}/static/image/${fileName}`
          : `http://localhost:${process.env.PORT}/static/image/${fileName}`,
        type: mediaType.Image
      }
    }))
    return result;
  }
  async uploadVideo(req: Request) {
    const files = await handleUploadVideo(req) as any;
    const result: Media[] = files.map((file: File) => {
      const urlVideo = isProduction ? `${process.env.HOST}/static/video/${file.newFilename}`
        : `http://localhost:${process.env.PORT}/static/video/${file.newFilename}`
      databaseServices.videoStatus.insertOne(
        new VideoStatus({ name: file.newFilename, url: urlVideo })
      )
      return {
        url: urlVideo,
        type: mediaType.Video
      }
    })
    return result
  }
  async getVideo(name: string) {
    const video =await databaseServices.videoStatus.findOne({ name })
    return video 
  }
}