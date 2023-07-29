import database from "../database/photographers.json" assert { type: "json" };

export const postContactForm = (req, res) => {
  const photographerId = req.params.id;

  if (!photographerId) {
    res.status(400).send("Missing photographerId");
    return;
  }

  if (
    !database.photographers.find(
      (photographer) => photographer.id == photographerId
    )
  ) {
    res.status(404).send("Photographer not found");
    return;
  }

  console.log(req);

  const { firstName, lastName, email, message } = req.body;
  const contact = { firstName, lastName, email, message };

  const missingData = [];

  if (!firstName) {
    missingData.push("firstName");
  }

  if (!lastName) {
    missingData.push("lastName");
  }

  if (!email) {
    missingData.push("email");
  }

  if (!message) {
    missingData.push("message");
  }

  if (missingData.length > 0) {
    res.status(400).send(`Missing data: ${missingData.join(", ")}`);
    return;
  }

  res.send(contact);
};
