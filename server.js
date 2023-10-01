const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();
require("./config/config-passport");
const path = require("path");
const fs = require("fs").promises;

const uriDb = process.env.DATABASE_URI;

const connection = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const isAccessible = (path) => {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false);
};

const createFolderIsNotExist = async (folder) => {
  if (!(await isAccessible(folder))) {
    await fs.mkdir(folder);
  }
};

const uploadDir = path.join(process.cwd(), "uploads");
const storeImage = path.join(process.cwd(), "images");

connection
  .then(() => {
    console.log("Database connection successful.");
    app.listen(3000, () => {
      createFolderIsNotExist(uploadDir);
      createFolderIsNotExist(storeImage);
      console.log("Server running. Use our API on port: 3000");
    });
  })
  .catch((err) => {
    console.log(`Server not running. Error message: ${err.message}`);
    process.exit(1);
  });

module.exports = connection;
