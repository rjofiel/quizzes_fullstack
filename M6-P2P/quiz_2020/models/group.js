const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Group extends Model {}

  Group.init(
    {
      name: {
        type: DataTypes.STRING,
        validate: { notEmpty: { msg: "Group must not be empty" } },
      },
    },
    {
      sequelize,
    }
  );
  return Group;
};
