const express = require("express");
const routes = require("./routes");

const database = require("./database/photographers.json");

const cors = require("cors");

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

const app = express();
const port = 8080 || process.env.PORT;

const greenColor = "\x1b[32m";
const resetColor = "\x1b[0m";

const logRequestTime = (req, res, next) => {
  const currentTime = new Date().toLocaleString();
  console.log(`${greenColor}[${currentTime}]${resetColor} : ${req.url}`);
  next();
};

app.use(logRequestTime);
app.use(cors(corsOptions));

app.get(routes.PHOTOGRAPHERS, (req, res) => {
  res.send(database.photographers);
});

app.get(routes.PHOTOGRAPHERS + "/:id", (req, res) => {
  const id = req.params.id;
  const photographer = database.photographers.find(
    (photographer) => photographer.id == id
  );

  if (!photographer) {
    res.status(404).send("Photographer not found");
    return;
  }

  res.send(photographer);
});

app.get(routes.PHOTOGRAPHERS + "/:id/photos", (req, res) => {
  const id = req.params.id;
  const photographer = database.photographers.find(
    (photographer) => photographer.id == id
  );

  if (!photographer) {
    res.status(404).send("Photographer not found");
    return;
  }

  const photos = database.media.filter((media) => media.photographerId == id);

  if (!photos) {
    res.status(404).send("Photos not found");
    return;
  }

  res.send(photos);
});

app.listen(port, () => console.log(`Express app running on port ${port}!`));
