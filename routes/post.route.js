const express = require("express");
const postRouter = express.Router();
const validateToken = require("../middlewares/validateTokenHandler");
const { createPost } = require("../controllers/post.controller");

postRouter.get("/", (req, res) => {
  res.send("testing");
});

postRouter.post("/create", validateToken, createPost);

module.exports = postRouter;
