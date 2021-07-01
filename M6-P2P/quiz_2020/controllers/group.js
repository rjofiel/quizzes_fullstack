const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { models } = require("../models");

//Autoload group asociated a groupId
exports.load = async (req, res, next, groupId) => {
  try {
    const group = await models.Group.findByPk(groupId, {
      include: [{ model: models.Quiz, as: "quizzes" }],
    });

    if (group) {
      req.load = { ...req.load, group };
      next();
    }
  } catch (error) {
    next(error);
  }
};

exports.index = async (req, res, next) => {
  try {
    const groups = await models.Group.findAll();
    res.render("groups/index", { groups });
  } catch (error) {
    console.log(error);
  }
};

exports.new = async (req, res, next) => {
  try {
    console.log(req.body);
    const group = { name: "" };
    res.render("groups/new", { group });
  } catch (error) {
    console.log(error);
  }
};

exports.create = async (req, res, next) => {
  const { name } = req.body;

  const authorId = req.loginUser.id || 0;

  let group = models.Group.build({
    name,
    authorId,
  });

  try {
    // Saves only the fields question and answer into the DDBB
    group = await group.save({ fields: ["name", "authorId"] });
    req.flash("success", "group created successfully.");
    res.redirect("groups/");
  } catch (error) {
    if (error instanceof Sequelize.ValidationError) {
      req.flash("error", "There are errors in the form:");
      error.errors.forEach(({ message }) => req.flash("error", message));
      res.render("groups/new", { group });
    } else {
      req.flash("error", "Error creating a new Group: " + error.message);
      next(error);
    }
  }
};

exports.edit = async (req, res, next) => {
  try {
    const { group } = req.load;
    const allQuizzes = await models.Quiz.findAll();
    const groupQuizzesIds = await group.getQuizzes().map((quiz) => quiz.id);
    res.render(`groups/edit`, {
      group,
      allQuizzes,
      groupQuizzesIds,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { name, quizzesIds = [] } = req.body;
    const { group } = req.load;
    group.name = name.trim();
    try {
      await group.save({ fields: ["name"] });
      req.flash("success", "Quiz edited successfully.");
      await group.setQuizzes(quizzesIds);
      res.redirect(`/groups/`);
    } catch (error) {
      if (error instanceof Sequelize.ValidationError) {
        req.flash("error", "There are errors in the form:");
        error.errors.forEach(({ message }) => req.flash("error", message));
        res.render("groups/edit", { group });
      } else {
        req.flash("error", "Error editing the Group: " + error.message);
        next(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

exports.destroy = async (req, res, next) => {
  try {
    await req.load.group.destroy();
    req.flash("success", "Group deleted successfully.");
    res.redirect("/goback");
  } catch (error) {
    req.flash("error", "Error deleting the Group: " + error.message);
    next(error);
  }
};

exports.randomplay = async (req, res, next) => {
  try {
    req.session.score = req.session.score || 0;
    req.session.quizzesResolved = req.session.quizzesResolved || [];

    const { group } = req.load;
    const groupQuizzesIds = await group.getQuizzes().map((quiz) => quiz.id);
    let random = Math.floor(Math.random() * groupQuizzesIds.length);
    groupQuizzesIds.length === 1 ? (index = 0) : (index = random);

    const quiz = await models.Quiz.findOne({
      where: {
        id: req.session.randomPlayLastQuizId || {
          [Sequelize.Op.notIn]: req.session.quizzesResolved,
        },
      },
      order: Sequelize.literal("RANDOM()"),
      limit: 1,
      include: [
        {
          model: models.Group,
          as: "groups",
          where: { id: group.dataValues.id },
        },
      ],
    });

    if (quiz) {
      //req.session.randomPlayLastQuizId = quiz.dataValues.id;

      res.render("groups/random_play", {
        group,
        quiz,
        score: req.session.score,
      });
    } else {
      const score = req.session.score;
      delete req.session.quizzesResolved;
      delete req.session.score;
      res.render("groups/random_nomore", { group, score });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.randomcheck = async (req, res, next) => {
  try {
    const { groupId, quizId } = req.params;
    const { query } = req;

    let result = false;
    const score = req.session.score;

    try {
      const { group } = req.load;
      const quiz = await models.Quiz.findByPk(quizId);
      const answer = query.answer;

      if (answer.toLowerCase().trim() === quiz.answer.toLowerCase().trim()) {
        result = true;

        if (!req.session.quizzesResolved.includes(quizId)) {
          req.session.quizzesResolved.push(quizId);
          req.session.score++;
        }
        req.session.randomPlayLastQuizId = null;
      } else {
        delete req.session.quizzesResolved;
        delete req.session.score;
      }
      res.render("groups/random_result", {
        group,
        answer: quiz.answer,
        result,
        score: req.session.score || score,
      });
    } catch (err) {
      console.log(err);
    }
  } catch (error) {}
};
