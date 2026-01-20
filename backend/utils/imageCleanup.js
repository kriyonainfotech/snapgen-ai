const { cloudinary } = require('./cloudinary');

/**
 * Deletes an image from Cloudinary given its URL.
 * @param {string} imageUrl - The full Cloudinary URL of the image.
 */
const deleteImageFromCloudinary = async (imageUrl) => {
    if (!imageUrl || !imageUrl.includes('cloudinary.com')) return;

    try {
        // Extract the public_id from the URL
        // Example: https://res.cloudinary.com/cloud_name/image/upload/v1/folder/image.jpg
        // public_id: folder/image
        const parts = imageUrl.split('/');
        const fileNameWithExtension = parts.pop();
        const folder = parts.pop();
        const publicId = `${folder}/${fileNameWithExtension.split('.')[0]}`;

        console.log("Deleting Cloudinary image with publicId:", publicId);
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
        // We don't throw the error so that the main operation (delete/update doc) can continue
    }
};

module.exports = { deleteImageFromCloudinary };
