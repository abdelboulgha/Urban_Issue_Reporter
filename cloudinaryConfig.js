const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configuration de Cloudinary
cloudinary.config({
  cloud_name: 'dpube6x50',
  api_key: '229851989592399',
  api_secret: '8peJvrudYQqHcsR5J8i2sCw5cXk'
});

// Configuration du stockage Cloudinary avec multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif']
  }
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };