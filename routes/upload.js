import express from 'express'
import multer from 'multer'
import { UploadController } from '../controllers/index.js'
import { checkAuth } from '../utils/index.js'

const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },

    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.webp')
    },
})

const upload = multer({ storage })

router.delete('/:imageUrl', checkAuth, UploadController.deleteImage)
router.post(
    '/',
    checkAuth,
    upload.single('image'),
    UploadController.uploadImage
)

export default router
