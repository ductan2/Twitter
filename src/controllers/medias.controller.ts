import { Request, Response, } from "express"
import MediaServices from "~/services/media.services";
import { initFolder } from "~/utils/file";

const mediaServices = new MediaServices();

export const uploadImageController = async (req: Request, res: Response) => {
  initFolder();
  try {
    const result = await mediaServices.uploadImage(req)
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
export const getVideoController = async (req: Request, res: Response) => {
  try {
    const { name } = req.params
    console.log("🚀 ~ file: medias.controller.ts:44 ~ getVideoController ~ name:", name)
    const result = await mediaServices.getVideo(name)
    return res.json({
      message: "Get video successfully",
      status: 200,
      result
    })
  } catch (error) {
    return res.status(400).json({
      message: "Get video failed",
      status: 400,
      error
    })
  }
}