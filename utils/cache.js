import NodeCache from 'node-cache'
const cache = new NodeCache()

export default (duration) => (req, res, next) => {
    if (req.method !== 'GET') {
        return next()
    }

    const key = req.originalUrl
    const cachedResponse = cache.get(key)

    if (cachedResponse) {
        res.send(cachedResponse)
    } else {
        res.originalSend = res.send
        res.send = (body) => {
            res.originalSend(body)
            cache.set(key, body, duration)
        }
        next()
    }
}
