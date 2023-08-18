
import {  Files } from "formidable";
import fs from "fs"
import path from "path"

export const initFolder = () => {
  if (!fs.existsSync(path.resolve('uploads'))) {
    fs.mkdirSync(path.resolve('uploads'), { recursive: true }) // auto create folder uploads 
  }
}
export const isFileValid = (files: Files) => {
  let nameFile = "";
  if (files && files.media && Array.isArray(files.media)) {
    const mediaFiles = files.media;
    for (const file of mediaFiles) {
      if (file.originalFilename) {
        nameFile = file.originalFilename
      }
    }
  }
  const type = nameFile.split(".")[1];
  const validTypes = ["jpg", "jpeg", "png", "pdf"];
  if (validTypes.indexOf(type) === -1) {
    return false;
  }
  return true;
};