import database from "../database/photographers.json" assert { type: "json" };
import { getPhotographerAvatarPath } from "../helpers/media.mjs";

export const getPhotographers = (req, res) => {
  const photographers = database.photographers.map(({ name, ...rest }) => {
    const avatarUrl = getPhotographerAvatarPath(name, req);

    return {
      name,
      avatarUrl,
      ...rest,
    };
  });

  res.send(photographers);
};

export const getPhotographer = (req, res) => {
  const id = req.params.id;
  const photographer = database.photographers.find(
    (photographer) => photographer.id == id
  );

  if (!photographer) {
    res.status(404).send("Photographer not found");
    return;
  }

  res.send(photographer);
};
