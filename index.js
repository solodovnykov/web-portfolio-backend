import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.7nqxsud.mongodb.net/?retryWrites=true&w=majority`
  )

  .then(() => {
    console.log("DB is OK");
  })
  .catch((error) => console.log("Db Error", error));

const app = express();

app.use(express.json());
app.use(cors());

app.listen(process.env.PORT || 5555, (error) => {
  if (error) {
    return console.log(error);
  }
  console.log("Server has been started.");
});
