export const findAvatarPath = (photographerName) => {
  const avatarPath = `/public/media/${photographerName}/${photographerName}.jpg`;
  return avatarPath;
};

export const findImagePath = (photographerName, fileName, req) => {
  const formattedFolderName = photographerName.replace(/[\s-]/g, "");
  const formattedFileName = fileName.replace(".jpg", ".webp");

  const imageUrl = `${req.protocol}://${req.get(
    "host"
  )}/public/media/${formattedFolderName}/${formattedFileName}`;

  return imageUrl;
};

export const findVideoPath = (photographerName, fileName) => {
  const formattedFolderName = photographerName.replace(/[\s-]/g, "");

  const videoUrl = `./public/media/${formattedFolderName}/${fileName}`;

  return videoUrl;
};

export const getPhotographerAvatarPath = (name, req) => {
  const formattedFileName = name.replace(/[\s-]/g, "");

  const imageUrl = `${req.protocol}://${req.get(
    "host"
  )}/public/media/${formattedFileName}/${formattedFileName}.webp`;

  return imageUrl;
};
