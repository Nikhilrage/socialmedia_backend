const express = require("express");
const userRouter = express.Router();
const multer = require("multer");
const {
  createUserProfile,
  loginUser,
  getUserID,
  updateProfile,
  uploadProfilePicture,
  addConnections,
  getUserFeedAndConnections,
  getUserByID,
  getAllUserNames,
} = require("../controllers/user.controller");
const validateToken = require("../middlewares/validateTokenHandler");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

//api are done
userRouter.post("/register", createUserProfile).post("/login", loginUser);

userRouter.get("/getUserID", validateToken, getUserID);

userRouter.get("/getUserById/:id", validateToken, getUserByID);

userRouter.post(
  "/upload/:id",
  validateToken,
  upload.single("profile_avatar"),
  uploadProfilePicture
);

userRouter.patch("/addConnection", validateToken, addConnections);

userRouter.post("/updateProfile/:id", validateToken, updateProfile);

userRouter.get(
  "/getFeedAndConnection/:id",
  validateToken,
  getUserFeedAndConnections
);

userRouter.get("/allUsers", validateToken, getAllUserNames);

module.exports = userRouter;
