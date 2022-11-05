import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import multer from 'multer'
import helmet from 'helmet'

import { checkAuth } from './utils/index.js'
import { postRoutes, authRoutes } from './routes/index.js'

dotenv.config()

const app = express()

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
})

const upload = multer({ storage })

app.use(express.json())
app.use(cors())
app.use(helmet())
app.use('/uploads', express.static('uploads'))

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    })
})

app.use('/auth', authRoutes)
app.use('/posts', postRoutes)

const DB_URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.7nqxsud.mongodb.net/web-portfolio?retryWrites=true&w=majority`

mongoose
    .connect(DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    .then(() => {
        console.log('DB is OK')
        app.listen(process.env.PORT || 5555, () =>
            console.log(`Server running on port: ${process.env.PORT}`)
        )
    })
    .catch((error) => console.log(error.message))
