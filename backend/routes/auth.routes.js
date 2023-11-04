const express = require("express");

const router = express.Router();

const {
  login,
  signup,
  authenticateManagerMiddleware: authenticateManager,
  addUser,
  updateUser,
  removeUser,
  verifyUser,
  getSingleUser,
  listUsers,
  getCurrentUser,
} = require("../controllers/auth.controller");

const { authenticateJWT } = require("../middleware/auth");

router.post("/login", login);

/**
 * @route POST /signup
 * @bodyparam username, password, role
 */
router.post("/signup", signup);

router.get("/users", authenticateJWT, authenticateManager, listUsers);
router.post("/users", authenticateJWT, authenticateManager, addUser);
router.post(
  "/users/:id/update",
  authenticateJWT,
  authenticateManager,
  updateUser
);
router.post(
  "/users/:id/delete",
  authenticateJWT,
  authenticateManager,
  removeUser
);
router.post(
  "/users/:id/verify",
  authenticateJWT,
  authenticateManager,
  verifyUser
);
router.get("/users/profile", authenticateJWT, getCurrentUser);
router.get("/users/:id", authenticateJWT, authenticateManager, getSingleUser);

module.exports = router;
