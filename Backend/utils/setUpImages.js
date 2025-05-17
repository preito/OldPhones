// setupImages.js
const fs = require("fs");
const path = require("path");
const Image  = require("../models/Image");

const folderPath = path.resolve("./data/phone_default_images");

exports.uploadImages = async function uploadImages() {
  const files = fs.readdirSync(folderPath);

  for (const fileName of files) {
    const filePath = path.join(folderPath, fileName);
    const existing = await Image.findOne({ name: fileName });

    if (!existing) {
      const imageBuffer = fs.readFileSync(filePath);
      const contentType = `image/${fileName.split('.').pop()}`;

      const newImage = new Image({
        name: fileName,
        data: imageBuffer,
        contentType,
      });

      await newImage.save();
      console.log(`Uploaded ${fileName} to server.`);
    }
  }
};
