import { Request, Response, Router } from "express"
import path from "path";
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from "~/constants/dir";
import fs from "fs";
import mime from "mime";
const router = Router();

router.get('/image/:name', (req: Request, res: Response) => {
  const { name } = req.params;
  console.log(UPLOAD_IMAGE_DIR)
  return res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, name), (err) => {
    if (err) {
      return res.status(404).json({
        message: "File not found"
      })
    }
  })
})
// router.get('/video/:name', (req: Request, res: Response) => {
//   const { name } = req.params;
//   console.log(UPLOAD_VIDEO_DIR)
//   return res.sendFile(path.resolve(UPLOAD_VIDEO_DIR, name), (err) => {
//     if (err) {
//       return res.status(404).json({
//         message: "File not found"
//       })
//     }
//   })
// })
router.get('/video/:name', (req: Request, res: Response) => {
  const range = req.headers.range;
  console.log("🚀 ~ file: static.routes.ts:21 ~ router.get ~ range:", range)
  if (!range) {
    return res.status(400).json({
      message: "Range is required"
    })
  }
  const { name } = req.params;
  const videoPath = path.resolve(UPLOAD_VIDEO_DIR, name);
  //1mb=10^6 byte (tính theo hệ thập phân)

  // tính dung lượng video
  const videoSize = fs.statSync(videoPath).size;
  const chunkSize = 18 * 10 ** 6; // ** là lũy thừa 
  console.log(videoPath)
  //giá trị bắt đầu của range
  const start = Number(range.replace(/\D/g, "")); // replace tất cả kí tự không phải là số thành ""
  //giá trị kết thúc của range
  const end = Math.min(start + chunkSize, videoSize - 1);

  // Dung lương thực tế cho video stream 
  const contentLength = end - start + 1;
  const contentType = "video/*"

  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": contentType
  }
  res.writeHead(206, headers);
  const videoStream = fs.createReadStream(videoPath, { start, end });
  videoStream.pipe(res);

})

export default router