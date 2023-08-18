import { RequestHandler, } from "express"
import { Files } from "formidable";
import PersistentFile from "formidable/PersistentFile";
import path from "path";
import { initFolder, isFileValid } from "~/utils/file";
const pathUpload = path.resolve('uploads');


export const uploadImageController: RequestHandler = async (req, res) => {
  initFolder();
  try {
    import('formidable').then(({ default: formidable }) => {
      const form = formidable({
        uploadDir: pathUpload,
        keepExtensions: true,
        multiples: true,

        maxFields: 5,
        maxFileSize: 2 * 1024 * 1024,
      });
      form.parse(req, async (err, fields, files: Files) => {

        if (err) {
          return res.json({
            message: "Upload failed!",
            status: 400,
          })
        }
        if (!files.media) {
          return res.json({
            message: "File is empty", status: 400
          })
        }

        const isCheckFile = isFileValid(files)
        if (!isCheckFile) {
          return res.json({
            message: "File type is invalid", status: 400
          })
        }
        return res.json({
          message: "Upload successfully!",
          status: 200,
          files
        })
      })
    })
  } catch (error) {
    return res.json({
      message: "Upload failed!",
      status: 400,
    })
  }
}
