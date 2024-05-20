//const { DataTypes } = require('sequelize');
const dotenv = require("dotenv");
dotenv.config();

module.exports = (sequelize,DataTypes) => {
  const Session = sequelize.define(
    "Session",
    {
      date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('Pending', 'Accepted', 'Rejected'),
        defaultValue: 'Pending'
      },
      details: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }
  );

  Session.associate = function (models) {
    Session.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
    Session.belongsTo(models.User, { as: 'teacher', foreignKey: 'teacherId' });
  };

  return Session;
};