// middlewares/uploadImage.js
const multer = require('multer')

const storage = multer.memoryStorage()

const imageFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only JPG/PNG images are allowed'), false)
  }
};

const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
})

module.exports = uploadImage
