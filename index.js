import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { validationResult } from "express-validator";
import { registerValidation } from "./validations/auth.js";
import UserModel from "./models/User.js";

dotenv.config();

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.7nqxsud.mongodb.net/web-portfolio?retryWrites=true&w=majority`
  )

  .then(() => {
    console.log("DB is OK");
  })
  .catch((error) => console.log("Db Error", error));

const app = express();

app.use(express.json());
app.use(cors());

app.post("/auth/register", registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const hash = await argon2.hash(password, { type: argon2.argon2id });

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_KEY,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    const { passwordHash, ...useData } = user._doc;

    res.json({
      ...useData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Registration failed",
    });
  }
});

app.listen(process.env.PORT || 5555, (error) => {
  if (error) {
    return console.log(error);
  }
  console.log("Server has been started.");
});
