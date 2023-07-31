const bcrypt = require("bcryptjs");

const User = require("../models/userModel");

// TODO: Sign Up (Create new user)
const signUp = async (request, response) => {
  /**
   * Request body:
   * - username
   * - email
   * - password
   */
  const { username, email, password } = request.body;

  if (!username | !email | !password) {
    return response
      .status(400)
      .json({ message: "Please enter all the fields" });
  }

  try {
    // TODO: Hash password before save in database
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT));
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user in DB
    const userDoc = await User.create({
      username: request.body.username,
      email: request.body.email,
      password: hashedPassword,
    });

    if (!userDoc || userDoc.length === 0) {
      return response.status(500).send(userDoc);
    }

    response.status(201).json({ userDoc, message: "Sign Up Successfully!" });
  } catch (error) {
    // Announce if username or password is exists in DB
    if (error.keyPattern.username === 1 || error.keyPattern.email === 1) {
      return response.status(500).json({
        message:
          "Cannot sign up! Please try again with other username and email.",
      });
    }

    // Other errors
    return response.status(500).json(error);
  }
};

// TODO: Log In (check user info)
const logIn = async (request, response) => {
  /**
   * Request body:
   * - email
   * - password
   */
  const { email, password } = request.body;

  if (!email | !password) {
    return response
      .status(400)
      .json({ message: "Please enter all the fields" });
  }

  try {
    // Find user by email
    const userDoc = await User.findOne({
      email: email,
    });

    if (!userDoc) {
      return response
        .status(401)
        .json({ message: "Invalid email! Please try again" });
    }

    // Compare input password with password in DB
    const isValidPassword = await bcrypt.compare(password, userDoc.password);

    if (!isValidPassword) {
      return response
        .status(401)
        .json({ message: "Invalid password! Please try again" });
    }

    response.status(200).json({ userDoc, message: "Login successfully" });
  } catch (error) {
    return response.status(500).json(error);
  }
};

// TODO: Get all users in database
const getAllUsers = async (request, response) => {
  try {
    const usersDoc = await User.find();
    response.status(201).json(usersDoc);
  } catch (error) {
    return response.status(500).json(error);
  }
};

// TODO: Get specific user by request parameter
const getSpecificUser = async (request, response) => {
  /**
   * Request body:
   * - username
   */
  const { username } = await request.params;

  try {
    const userDoc = await User.findOne({
      username: username,
    });

    if (!userDoc) {
      return response.status(404).json({ message: "User not found!" });
    }

    response.status(200).json(userDoc);
  } catch (error) {
    return response.status(500).json(error);
  }
};

// TODO: Update user
const updateUser = async (request, response) => {
  /**
   * Request body:
   * - username
   * - email
   * - password
   */
  const { username } = request.params;
  const {
    username: newUsername,
    email: newEmail,
    password: newPassword,
  } = request.body;

  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT));
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    const updatedUserDoc = await User.findOneAndUpdate(
      {
        username: username,
      },
      {
        username: newUsername,
        email: newEmail,
        password: newHashedPassword,
      },
      { new: true }
    );

    if (!updatedUserDoc) {
      return response.status(404).json({ message: "User not found!" });
    }

    response
      .status(201)
      .json({ updatedUserDoc, message: "Update user successfully!" });
  } catch (error) {
    return response.status(500).json(error);
  }
};

// TODO: Delete User
const deleteUser = async (request, response) => {
  /**
   * Request body:
   * - username
   */
  const { username } = request.params;

  try {
    const deletedUserDoc = await User.findOneAndRemove({ username: username });

    if (!deletedUserDoc) {
      return response.status(404).json({ message: "User not found!" });
    }

    response.json({ message: "Delete User Successfully" });
  } catch (error) {
    return response.status(500).json(error);
  }
};

module.exports = {
  signUp,
  logIn,
  getAllUsers,
  getSpecificUser,
  updateUser,
  deleteUser,
};
