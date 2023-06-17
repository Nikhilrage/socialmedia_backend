const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
require("dotenv").config();
const app = express();
const userRoute = require("./routes/user.route");
const postRoute = require("./routes/post.route");

//mongoose setup
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server is running at ${PORT}`));
  })
  .catch((error) => {
    console.log(`Connection error: ${error}`);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.options("*", cors());
app.use("/test", (req, res) => {
  res.send("testing successful");
});
app.use("/users", userRoute);
app.use("/posts", postRoute);
