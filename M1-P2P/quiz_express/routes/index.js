var express = require("express");
var router = express.Router();
const quizControl = require("../controllers/quiz.js");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/* GET Credit page. */
router.get("/credits", function (req, res, next) {
  res.render("credits", { title: "Credits" });
});

/* GET Quizzes page. */
router.get("/quizzes", quizControl.index);

module.exports = router;
