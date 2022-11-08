import rateLimit from 'express-rate-limit'

export default rateLimit({
    windowMs: 10 * 1000,
    max: 10,
    message: 'You have exceeded the 100 requests in 24 hrs limit!',
    standardHeaders: true,
    legacyHeaders: false,
})
