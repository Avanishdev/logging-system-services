const express = require("express");
const { registerUser, loginUser, updateProfile, logout } = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/update", authMiddleware, updateProfile);

router.post("/logout", authMiddleware, logout);

module.exports = router;
