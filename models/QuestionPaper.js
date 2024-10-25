module.exports = (sequelize, DataTypes) => {
  const QuestionPaper = sequelize.define("QuestionPaper", {
    QuestionPaperID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Result: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, {
    createdAt: 'TimeStamp',
    updatedAt: false,
  });

  // Associations
  QuestionPaper.associate = (models) => {
    QuestionPaper.belongsToMany(models.Questions, {
      through: models.QuestionPaperQuestions,
      foreignKey: 'QuestionPaperID',
      otherKey: 'QuestionID',
      as: 'questions'
    });
  };

  return QuestionPaper;
};
