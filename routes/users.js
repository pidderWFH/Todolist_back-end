const express = require('express');
const router = express.Router();

const handleErrorAsync = require('../service/handleErrorAsync');
const UsersControllers = require("../controllers/users");
const { isAuth } = require("../service/auth");


router.post("/sign_up", handleErrorAsync(UsersControllers.signUp));

router.post("/sign_in", handleErrorAsync(UsersControllers.signIn));

router.post("/updatePassword", isAuth, handleErrorAsync(UsersControllers.updatePassword));

router.get("/profile", isAuth, handleErrorAsync(UsersControllers.getProfile));

router.patch("/profile", isAuth, handleErrorAsync(UsersControllers.updateProfile));

module.exports = router;
