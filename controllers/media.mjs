import database from "../database/photographers.json" assert { type: "json" };
import {
  findImagePath,
  findVideoPath,
  getPhotographerAvatarPath,
} from "../helpers/media.mjs";
import fs from "fs";

const generateThumbnail = (path) => {
  Ffmpeg("/path/to/video.mp4")
    .on("filenames", function (filenames) {
      console.log("Will generate " + filenames.join(", "));
    })
    .on("end", function () {
      console.log("Screenshots taken");
    })
    .screenshots({
      count: 1,
      folder: "/path/to/thumbnails",
      size: "320x240",
      filename: "thumbnail.png",
    });
};

export const getPhotographerImages = (req, res) => {
  const id = req.params.id;
  const photographer = database.photographers.find(
    (photographer) => photographer.id == id
  );

  if (!photographer) {
    res.status(404).send("Photographer not found");
    return;
  }

  const media = database.media.filter((media) => media.photographerId == id);

  if (!media) {
    res.status(404).send("media not found");
    return;
  }
  try {
    // filtering video by checking if media key "video" exists
    const photos = media.filter((media) => !media.video);

    // update image property with the path to the image
    const updatedPhotos = photos.map((photo) => {
      const imagePath = findImagePath(photographer.name, photo.image, req);

      return {
        ...photo,
        image: imagePath,
      };
    });

    const videos = media.filter((media) => !media.image);

    res.send([...updatedPhotos, ...videos]);
  } catch (error) {
    console.log(`Error reading file: ${error}`);
  }
};

export const getPhotographerVideos = (req, res) => {
  const id = req.params.id;
  const photographer = database.photographers.find(
    (photographer) => photographer.id == id
  );

  try {
    if (!photographer) {
      res.status(404).send("Photographer not found");
      return;
    }

    const media = database.media.filter((media) => media.photographerId == id);

    if (!media) {
      res.status(404).send("media not found");
      return;
    }

    // find video path

    const videos = media.filter((media) => !media.image);

    const videoPath = findVideoPath(photographer.name, videos[0].video);
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "video/mp4",
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      };

      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (error) {
    console.log(`getPhotographerVideos: ${error}`);
  }
};

// get video details
export const getVideoDetails = (req, res) => {
  const id = req.params.id;

  try {
    const media = database.media.filter((media) => media.id == id);

    if (!media) {
      res.status(404).send("media not found");
      return;
    }

    res.send(media);
  } catch (error) {
    console.log(`getVideoDetails: ${error}`);
  }
};

export const getAvatarByPhotographer = (req, res) => {
  const id = req.params.id;

  try {
    const photographer = database.photographers.find(
      (photographer) => photographer.id == id
    );

    if (!photographer) {
      res.status(404).send("Photographer not found");
      return;
    }

    const { name } = photographer;

    res.send(
      JSON.stringify({
        url: getPhotographerAvatarPath(name, req),
      })
    );
  } catch (error) {
    console.log(`getAvatarByPhotographer: ${error}`);
  }
};
