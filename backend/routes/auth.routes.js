const express = require("express");

const router = express.Router();

const {
  login,
  signup,
  authenticateAdminOrOwnerMiddleware: authenticateAdminOrOwner,
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

router.get("/users", authenticateJWT, authenticateAdminOrOwner, listUsers);
router.post("/users", authenticateJWT, authenticateAdminOrOwner, addUser);
router.post(
  "/users/:id/update",
  authenticateJWT,
  authenticateAdminOrOwner,
  updateUser
);
router.post(
  "/users/:id/delete",
  authenticateJWT,
  authenticateAdminOrOwner,
  removeUser
);
router.post(
  "/users/:id/verify",
  authenticateJWT,
  authenticateAdminOrOwner,
  verifyUser
);
router.get("/users/profile", authenticateJWT, getCurrentUser);
router.get(
  "/users/:id",
  authenticateJWT,
  authenticateAdminOrOwner,
  getSingleUser
);

module.exports = router;
