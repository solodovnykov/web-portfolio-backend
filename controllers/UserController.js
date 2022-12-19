import jwt from 'jsonwebtoken'
import argon2 from 'argon2'
import UserModel from '../models/User.js'

const cookieTokenResponse = (user, statusCode, res) => {
    const token = jwt.sign(
        {
            _id: user._id,
        },
        process.env.JWT_KEY,
        {
            expiresIn: '30d',
        }
    )

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    }
    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true
    }
    user.passwordHash = undefined
    user.twoFactorAuthCode = undefined

    res.status(statusCode).cookie('facade', token, cookieOptions).json({
        message: 'success',
        token,
        data: {
            user,
        },
    })
}

export const register = async (req, res) => {
    try {
        const password = req.body.password
        const hash = await argon2.hash(password, { type: argon2.argon2id })

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        })

        const user = await doc.save()

        cookieTokenResponse(user, 201, res)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Registration failed',
        })
    }
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email })
        if (!user) {
            return res.status(404).json({
                //The username or password is incorrect
                message: 'User not found',
            })
        }

        const isValidPassword = await argon2.verify(
            user._doc.passwordHash,
            req.body.password
        )

        if (!isValidPassword) {
            return res.status(404).json({
                message: 'The username or password is incorrect',
            })
        }

        if (user.twoFactorAuthEnabled) {
            res.send({
                twoFactorAuthEnabled: true,
            })
        } else {
            cookieTokenResponse(user, 200, res)
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Authorization failed',
        })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            })
        }

        const { passwordHash, ...userData } = user._doc

        res.json(userData)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'User not found',
        })
    }
}

export const logout = async (req, res) => {
    try {
        console.log(req.cookies)
        res.cookie('facade', 'loggedout', {
            expires: new Date(Date.now + 10 * 1000),
            httpOnly: true,
        })
    } catch (error) {
        console.log(error)
    }
}
