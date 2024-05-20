module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define(
      'Post',
      {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          content: {
            type: DataTypes.TEXT,
            allowNull: false,
          },
      }
    );
  
    Post.associate = function (models) {
        Post.hasMany(models.Comment);
        Post.belongsTo(models.Student);
    };
  
    return Post;
  };