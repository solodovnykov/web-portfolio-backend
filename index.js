import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(5555, (error) => {
  if (error) {
    return console.log(error);
  }
  console.log("Server has been started.");
});
