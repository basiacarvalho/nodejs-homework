const app = require("./app");
const mongoose = require("mongoose");

const uriDb =
  "mongodb+srv://basiacarvalho:CPEODGZl2A3FR1cm@cluster0.zv2z0gw.mongodb.net/?retryWrites=true&w=majority";

const connection = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connection
  .then(() => {
    console.log("Database connection succesfull.");
    app.listen(3000, () => {
      console.log("Server running. Use our API on port: 3000");
    });
  })
  .catch((err) => {
    console.log(`Server not running. Error message: ${err.message}`);
    process.exit(1);
  });

module.exports = connection;
