const express = require("express");
const router = express.Router();

const {Login,SignIn} = require("../controller/UserController");



router.post("/signin", SignIn);
router.post("/login", Login);

module.exports = router