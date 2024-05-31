import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import CloudinaryPackage from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

const cloudinary = CloudinaryPackage.v2;

//! Configuration for Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

//! Create Storage Engine
const storage = new CloudinaryStorage({
	cloudinary,
	allowedFormats: ["jpg", "png", "jpeg"],
	params: {
		folder: "E-Commerce",
	},
});

//! Init Upload
const upload = multer({ storage });

export default upload;
