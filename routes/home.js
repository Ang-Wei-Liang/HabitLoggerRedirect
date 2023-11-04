const express = require("express");
const router = express.Router();
const path = require("path");

// Import the EJS module
const ejs = require("ejs");

router.get("/", async (req, res, next) => {
  
  const filePath = path.join(__dirname, "views", "index.html");
  return res.sendFile(filePath);
});

router.get("/loggedin", async (req, res, next) => {
  const filePath = path.join(__dirname, "views", "loggedin.html");
  return res.sendFile(filePath);
});

/*
router.get("/", async (req, res, next) => {
  return res.status(200).json({
    title: "Express Testing",
    message: "The app is working properly!",
  });
});*/

module.exports = router;

