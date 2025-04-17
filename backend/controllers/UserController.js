const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email, 
      isAdmin: user.isAdmin 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Register new user
module.exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User with this email already exists." });
    }
    
    // Create new user
    const newUser = await User.create({ 
      email, 
      password,
      likedMovies: []
    });
    
    // Generate token
    const token = generateToken(newUser);
    
    // Return success response without password
    const userWithoutPassword = {
      _id: newUser._id,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      likedMovies: newUser.likedMovies
    };
    
    return res.status(201).json({ 
      msg: "User registered successfully", 
      user: userWithoutPassword,
      token 
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ msg: "Error registering user", error: error.message });
  }
};

// Login user
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ msg: "Invalid password" });
    }
    
    // Generate token
    const token = generateToken(user);
    
    // Return user without password
    const userWithoutPassword = {
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
      likedMovies: user.likedMovies
    };
    
    return res.json({ 
      msg: "Login successful", 
      user: userWithoutPassword,
      token 
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ msg: "Error during login", error: error.message });
  }
};

// Get user profile
module.exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    
    return res.json({ user });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({ msg: "Error fetching user profile", error: error.message });
  }
};

// Admin: Get all users
module.exports.getAllUsers = async (req, res) => {
  try {
    // Check if the requester is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ msg: "Unauthorized. Admin access required." });
    }
    
    const users = await User.find().select('-password');
    return res.json({ users });
  } catch (error) {
    console.error("Get all users error:", error);
    return res.status(500).json({ msg: "Error fetching users", error: error.message });
  }
};

// Admin: Delete user
module.exports.deleteUser = async (req, res) => {
  try {
    // Check if the requester is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ msg: "Unauthorized. Admin access required." });
    }
    
    const { userId } = req.params;
    
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ msg: "User not found" });
    }
    
    return res.json({ msg: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({ msg: "Error deleting user", error: error.message });
  }
};

// Get liked movies
module.exports.getLikedMovies = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (user) {
      return res.json({ msg: "success", movies: user.likedMovies });
    } else return res.json({ msg: "User with given email not found." });
  } catch (error) {
    return res.status(500).json({ msg: "Error fetching movies." });
  }
};

// Add to liked movies
module.exports.addToLikedMovies = async (req, res) => {
  try {
    const { email, data } = req.body;

    // Validate request parameters
    if (!email || !data) {
      return res.status(400).json({ msg: "Invalid request parameters" });
    }

    const user = await User.findOne({ email });

    if (user) {
      const { likedMovies } = user;
      const movieAlreadyLiked = likedMovies.find(({ id }) => id === data.id);

      if (!movieAlreadyLiked) {
        const updatedUser = await User.findByIdAndUpdate(
          user._id,
          {
            likedMovies: [...user.likedMovies, data],
          },
          { new: true }
        );

        return res.status(200).json({ msg: "Movie successfully added to liked list.", user: updatedUser });
      } else {
        return res.status(200).json({ msg: "Movie already added to the liked list." });
      }
    } else {
      return res.status(404).json({ msg: "User not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error adding movie to the liked list", error: error.message });
  }
};

// Remove from liked movies
module.exports.removeFromLikedMovies = async (req, res) => {
  try {
    const { email, movieId } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const movies = user.likedMovies;
      const movieIndex = movies.findIndex(({ id }) => id === movieId);

      if (movieIndex !== -1) {
        movies.splice(movieIndex, 1);

        const updatedUser = await User.findByIdAndUpdate(
          user._id,
          {
            likedMovies: movies,
          },
          { new: true }
        );

        return res.json({ msg: "Movie successfully removed.", movies: updatedUser.likedMovies });
      } else {
        return res.status(404).json({ msg: "Movie not found." });
      }
    } else {
      return res.status(404).json({ msg: "User with given email not found." });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Error removing movie from the liked list" });
  }
};
