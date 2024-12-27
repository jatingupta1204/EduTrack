import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError";


cloudinary.config({ 
    cloud_name: <string>process.env.CLOUDINARY_CLOUD_NAME,
    api_key: <string>process.env.CLOUDINARY_API_KEY,
    api_secret: <string>process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath: string) => {
    try {
        if(!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.error("Cloudinary Upload Error: ", error);
        try {
            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath)
            }
        } catch (unlinkError) {
            console.error("File Cleanup Error: ", unlinkError);
        }
        throw new ApiError(400, "Failed to upload file to Cloudinary");
    }
}

const deleteFromCloudinary = async (publicId: string) => {
    try {
        const response = await cloudinary.uploader.destroy(publicId);
        return response;
    } catch (error) {
        console.error("Cloudinary Delete Error: ", error);
        throw new ApiError(500, "Failed to delete file from Cloudinary");
    }
};

export { uploadOnCloudinary, deleteFromCloudinary }