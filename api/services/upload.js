const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const dotenv = require('dotenv')

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_HOST,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  })
  
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'user-images'
    }
  })
  
  const upload = multer({ storage: storage })

  module.exports = upload