const express = require("express");

const uploadController = require("../controllers/uploads");
const handleErrorAsync = require("../service/handleErrorAsync");
const imageFormat = require("../service/imageFormat");
const { isAuth } = require("../service/auth");

const router = express.Router();

router.post("/", isAuth, imageFormat, handleErrorAsync(uploadController.postUpload));

module.exports = router;