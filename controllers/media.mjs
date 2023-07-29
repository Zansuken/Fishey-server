import database from "../database/photographers.json" assert { type: "json" };

export const getMediaByPhotographer = (req, res) => {
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
};
