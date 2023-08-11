import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./routes.js";
import {
  getPhotographer,
  getPhotographers,
} from "./controllers/photographers.mjs";
import {
  getAvatarByPhotographer,
  getPhotographerImages,
  getPhotographerVideos,
  getVideoDetails,
} from "./controllers/media.mjs";
import { postContactForm } from "./controllers/contact.mjs";

const whitelist = ["http://localhost:5173"];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

export const app = express();
const port = 8080 || process.env.PORT;

const greenColor = "\x1b[32m";
const resetColor = "\x1b[0m";

const logRequestTime = (req, res, next) => {
  const currentTime = new Date().toLocaleString();
  console.log(`${greenColor}[${currentTime}]${resetColor} : ${req.url}`);
  next();
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(logRequestTime);
app.use(cors(corsOptions));

app.use("/public", express.static("public"));

app.get(routes.PHOTOGRAPHERS, getPhotographers);
app.get(routes.PHOTOGRAPHER, getPhotographer);
app.get(routes.IMAGES, getPhotographerImages);
app.get(routes.VIDEOS, getPhotographerVideos);
app.get(routes.VIDEO_DETAILS, getVideoDetails);
app.get(routes.AVATAR, getAvatarByPhotographer);

app.post(routes.CONTACT, postContactForm);

app.listen(port, () => console.log(`Express app running on port ${port}!`));
