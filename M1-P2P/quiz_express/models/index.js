const { Sequelize, DataTypes, Model } = require("sequelize");

const sequelize = new Sequelize("sqlite:quiz.sqlite");

class Quiz extends Model {}

Quiz.init(
  {
    question: {
      type: DataTypes.STRING,
      unique: { msg: "La pregunta ya existe." },
    },
    answer: { type: DataTypes.STRING },
  },
  { sequelize }
);

module.exports = sequelize;
