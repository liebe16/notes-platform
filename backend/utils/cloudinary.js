import { v2 as cloudinary } from "cloudinary";

const uploadPDF = async (buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: "notes-pdf"
      },
      (error, result) => {
        if (error) reject(error);
        resolve(result);
      }
    ).end(buffer);
  });
};

export default uploadPDF;