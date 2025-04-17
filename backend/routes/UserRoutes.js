const {
  addToLikedMovies,
  getLikedMovies,
  removeFromLikedMovies,
  register,
  login,
  getProfile,
  getAllUsers,
  deleteUser
} = require("../controllers/UserController");

const { protect, admin } = require("../middleware/authMiddleware");
const router = require("express").Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.get("/liked/:email", getLikedMovies);

// Protected routes
router.post("/add", protect, addToLikedMovies);
router.put("/remove", protect, removeFromLikedMovies);
router.get("/profile", protect, getProfile);

// Admin routes
router.get("/admin/users", protect, getAllUsers);
router.delete("/admin/users/:userId", protect, deleteUser);

module.exports = router;
