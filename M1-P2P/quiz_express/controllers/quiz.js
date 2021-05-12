const { models } = require("../models");

exports.index = async (req, res, next) => {
  try {
    const allQuizzes = await models.Quiz.findAll();
    res.render("quizzes/index", { quizzes: allQuizzes });
  } catch (error) {
    console.log(error);
  }
};
