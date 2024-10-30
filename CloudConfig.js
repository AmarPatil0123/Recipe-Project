const cloudinary = require('cloudinary').v2; // Using Cloudinary v2
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'recipes', // Cloudinary folder
        allowed_formats: ["png", "jpeg", "jpg", "avif"], // Use `allowed_formats` (underscore)
    },
});



module.exports = {
    cloudinary, storage
};
