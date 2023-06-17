const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../models/user.model");
const post = require("../models/post.models");

const createUserProfile = async (req, res) => {
  //console.log({ req: req?.body, file: req?.file });
  try {
    const { firstName, lastName, email, password, mobile_number } = req.body;
    if (!firstName || !lastName || !email || !password || !mobile_number) {
      res.status(400).json({ success: false, message: "Validation failed" });
    }

    const findEmailExists = await user.findOne({ email });
    if (findEmailExists) {
      res.status(400).json({ message: "Email already exists" });
    }
    // hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserDetails = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      mobile_number,
    };

    const newUser = await user.create(newUserDetails);

    if (newUser) {
      res
        .status(201)
        .json({ success: true, message: "User profile created successfully." });
    } else {
      res
        .status(400)
        .json({ message: "Something wrong with the user details" });
    }
  } catch (e) {
    console.error("Error creating user profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create user profile.",
      error: error.message,
    });
  }
};

//@desc login route
//@access public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Validation failed" });
    }

    const findUserData = await user.findOne({ email });

    if (findUserData && bcrypt.compare(password, findUserData.password)) {
      const token = jwt.sign(
        {
          user: {
            username: findUserData?.firstName,
            email: findUserData?.email,
            id: findUserData?._id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "90m" }
      );
      res.status(200).json({ success: true, message: "Logged In", token });
    }
  } catch (e) {
    console.log("logged In error");
    res.status(500).send("Something went wrong!");
  }
};

//@desc fetching logged in user id
//@access private
const getUserID = async (req, res) => {
  res.status(200).json({ userDetails: req.user });
};

//@desc fetching user details by id
//@access private
const getUserByID = async (req, res) => {
  try {
    const userDetails = await user.findById(req.params.id).select("-password");
    if (userDetails) {
      res.status(200).json({ success: true, userDetails });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

//@desc updating the profile info
//@access private
const updateProfile = async (req, res) => {
  try {
    const updatedUser = await user
      .findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true } // Set the `new` option to true to return the updated document
      )
      .select("-password");
    res
      .status(200)
      .json({ success: true, message: "user details updated", updatedUser });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

//@desc uploading the profile picture
//@access private
const uploadProfilePicture = async (req, res) => {
  try {
    const id = req.params.id;
    //console.log(req.file.filename);
    const updatedDoc = await user.findByIdAndUpdate(
      req.params.id,
      { avatar: req.file.filename },
      { new: true }
    );
    res.status(200).json({ message: "Picture updated" });
  } catch (e) {
    console.log(e);
  }
};

//@desc adding connections
//@access private
const addConnections = async (req, res) => {
  try {
    const { friend_user_id, user_id } = req.body;

    //validations
    if (!friend_user_id || !user_id) {
      res.status(400).json({ message: "validation missing" });
    }

    const accountOwnerDetails = await user.findById(user_id);
    accountOwnerDetails.friendConnections.push(friend_user_id);
    const updatedFriendsList = await accountOwnerDetails.save();

    if (updatedFriendsList)
      res.status(200).json({ message: "Friend connection added successfully" });
  } catch (e) {
    res.status(500).send("Something went wrong");
  }
};

//@desc getting connected friends posts to show in dashboard
//@access private
const getUserFeedAndConnections = async (req, res) => {
  try {
    const userFriendObjectIds = await user
      .findById(req.params.id)
      .select("friendConnections");
    const allFriendsPosts = await Promise.all(
      userFriendObjectIds?.friendConnections?.map(async (id, index) => {
        const res = await post.find({ user_id: id });
        return res;
      })
    );
    res.status(200).json({ success: true, details: allFriendsPosts });
  } catch (e) {
    console.log(e);
    res.status(500).send("Something went wrong");
  }
};

//@desc API for showing user names on searching
//@access private
const getAllUserNames = async (req, res) => {
  try {
    const allUsers = await user
      .find({})
      .select("_id firstName lastName avatar");
    if (allUsers) {
      res.status(200).json({ details: allUsers });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send("Something went wrong");
  }
};

module.exports = {
  createUserProfile,
  loginUser,
  getUserID,
  getUserByID,
  updateProfile,
  uploadProfilePicture,
  addConnections,
  getUserFeedAndConnections,
  getAllUserNames,
};
