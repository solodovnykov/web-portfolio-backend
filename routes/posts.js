import express from 'express'
import { PostController } from '../controllers/index.js'
import { checkAuth, handleValidationErrors, cache } from '../utils/index.js'
import { postCreateValidation } from '../validations.js'

const router = express.Router()

router.get('/', cache(30), PostController.getAll)
router.get('/:id', cache(30), PostController.getOne)
router.post(
    '/',
    checkAuth,
    postCreateValidation,
    handleValidationErrors,
    PostController.create
)
router.delete('/:id', checkAuth, PostController.remove)
router.patch('/:id', checkAuth, handleValidationErrors, PostController.update)

export default router
