const express = require("express");
const router = express.Router();

const {
  signUp,
  logIn,
  getAllUsers,
  getSpecificUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

// TODO: Sign Up (Create new user)
router.post("/api/signup", signUp);

// TODO: Log In (check user info)
router.post("/api/login", logIn);

// TODO: Get all users in database
router.get('/api/users', getAllUsers);

// TODO: Get specific user by query string
router.get("/api/users/:username", getSpecificUser);

// TODO: Update user
router.put("/api/users/:username", updateUser);

// TODO: Delete User
router.delete("/api/users/:username", deleteUser);

module.exports = router;
