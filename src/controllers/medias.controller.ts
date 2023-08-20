import { Request, RequestHandler, Response, } from "express"
import MediaServices from "~/services/media.services";
import { initFolder } from "~/utils/file";

const mediaServices = new MediaServices();

export const uploadImageController = async (req: Request, res: Response) => {
  initFolder();
  try {
    const result = await mediaServices.uploadImage(req)
    console.log("🚀 ~ file: medias.controller.ts:11 ~ uploadImageController ~ result:", result)
    return res.json({
      message: "Upload file successfully",
      status: 200,
      result
    })
  } catch (error: any) {
    return res.status(error.status).json({
      message: error.error || error.message,
      status: error.status,

    })
  }
}
export const uploadVideoController = async (req: Request, res: Response) => {
  initFolder();
  try {
    const result = await mediaServices.uploadVideo(req)
    return res.json({
      message: "Upload file successfully",
      status: 200,
      result
    })
  } catch (error: any) {
    return res.status(error.status).json({
      message: error.error || error.message,
      status: error.status,
    })
  }
}