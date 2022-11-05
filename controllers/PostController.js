import PostModel from '../models/Post.js'

export const getAll = async (req, res) => {
    try {
        let { page = 1, size = 5 } = req.query

        const limit = parseInt(size)
        const skip = (parseInt(page) - 1) * size
        const total = await PostModel.countDocuments({})

        const posts = await PostModel.find()
            .limit(limit)
            .skip(skip)
            .populate('user', [
                'fullName',
                'email',
                '_id',
                'createdAt',
                'updatedAt',
            ])
            .exec()

        res.json({
            currentPage: parseInt(page),
            numberOfPages: Math.ceil(total / limit),
            data: posts,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Failed to get posts',
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id

        PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: {
                    viewsCount: 1,
                },
            },
            {
                returnDocument: 'after',
            },
            (error, doc) => {
                if (error) {
                    console.log(error)
                    return res.status(500).json({
                        message: 'Failed to return post',
                    })
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'Post not found',
                    })
                }

                res.json(doc)
            }
        )
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Failed to get posts',
        })
    }
}

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags.split(','),
            imageUrl: req.body.imageUrl,
            user: req.userId,
        })

        const post = await doc.save()

        res.json(post)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Failed to create post',
        })
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id

        PostModel.findOneAndRemove(
            {
                _id: postId,
            },
            (error, doc) => {
                if (error) {
                    console.log(error)
                    return res.status(500).json({
                        message: 'Failed to remove post',
                    })
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'Post not found',
                    })
                }

                res.json({
                    success: true,
                })
            }
        )
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Failed to get posts',
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id

        await PostModel.updateOne(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                user: req.userId,
                tags: req.body.tags,
            }
        )

        res.json({
            success: true,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Failed to update post',
        })
    }
}
