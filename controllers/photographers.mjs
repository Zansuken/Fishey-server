import database from "../database/photographers.json" assert { type: "json" };

export const getPhotographers = (req, res) => res.send(database.photographers);

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
