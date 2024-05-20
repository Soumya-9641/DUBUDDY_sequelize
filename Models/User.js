//const { DataTypes } = require('sequelize');


module.exports = (sequelize,DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      isTeacher: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    }
  );

  User.associate = function (models) {
    User.hasMany(models.Session, { as: 'sessionsAsStudent', foreignKey: 'userId' });
    User.hasMany(models.Session, { as: 'sessionsAsTeacher', foreignKey: 'teacherId' });
    User.belongsToMany(models.Skill, { through: 'UserSkill',as: 'skills', foreignKey: 'userId' });
  };

  return User;
};