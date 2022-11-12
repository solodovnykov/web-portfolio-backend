import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import helmet from 'helmet'
import compression from 'compression'
import bodyParser from 'body-parser'
import mongoSanitize from 'express-mongo-sanitize'
import hpp from 'hpp'
import cookieParser from 'cookie-parser'

import { postRoutes, authRoutes, uploadRoutes } from './routes/index.js'
import { rateLimiter } from './utils/index.js'

dotenv.config()

const app = express()

app.use(cookieParser())
app.use(rateLimiter)
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(compression())
app.use(bodyParser.json({ limit: '2kb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '1kb', extended: true }))
app.use(
    mongoSanitize({
        allowDots: true,
    })
)
app.use(hpp())

app.use('/uploads/resized', express.static('uploads/resized'))

app.use('/upload/:imageUrl', uploadRoutes)
app.use('/upload', uploadRoutes)

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
