import database from "../database/photographers.json" assert { type: "json" };
import {
  findImagePath,
  findVideoPath,
  getPhotographerAvatarPath,
} from "../helpers/media.mjs";
import fs from "fs";

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

export const updateMediaLikes = (req, res) => {
  const mediaId = req.params.mediaId;
  const sessionId = req.params.sessionId;

  let media = database.media.find((media) => media.id == mediaId);

  try {
    if (!media) {
      res.status(404).send("Media not found");
      return;
    }

    const likeCount = media.likes;

    const isLikedByUser = media?.usersLiked?.includes(sessionId);

    const usersLiked = media?.usersLiked ? media.usersLiked : [];

    if (isLikedByUser) {
      media.likes = likeCount - 1;
      media.usersLiked = usersLiked.filter((user) => user !== sessionId);
    } else {
      media.likes = likeCount + 1;
      media.usersLiked = [...usersLiked, sessionId];
    }

    database.media = database.media.map((item) =>
      item.id === media.id ? media : item
    );

    fs.writeFileSync(
      "./database/photographers.json",
      JSON.stringify(database),
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );

    const updatedMedia = database.media.find((media) => media.id == mediaId);

    res.send(JSON.stringify({ media: updatedMedia }));
  } catch (error) {
    console.log(`updateMediaLikes: ${error}`);
  }
};
