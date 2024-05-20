module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define(
      'Student',
      {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
          },
      }
    );
  
    Student.associate = function (models) {
        Student.hasMany(models.Post);
    };
  
    return Student;
  };