module.exports = (sequelize, DataTypes) => {
    const Skill = sequelize.define(
      'Skill',
      {
       
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
      }
    );
  
    Skill.associate = function (models) {
      Skill.belongsToMany(models.User, { through: 'UserSkill',as:'users', foreignKey: 'skillId' });
    };
  
    return Skill;
  };