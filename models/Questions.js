module.exports = (sequelize, DataTypes) => {
  const Questions = sequelize.define("Questions", {
    QuestionID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    OptionA: {
      type: DataTypes.STRING,
      allowNull: false
    },
    OptionB: {
      type: DataTypes.STRING,
      allowNull: false
    },
    OptionC: {
      type: DataTypes.STRING,
      allowNull: false
    },
    OptionD: {
      type: DataTypes.STRING,
      allowNull: false
    },
    CorrectOption: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Difficulty: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isPYQ: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    createdAt: 'TimeStamp',
    updatedAt: false,
  });

  // Associations
  Questions.associate = (models) => {
    Questions.belongsToMany(models.QuestionPaper, {
      through: models.QuestionPaperQuestions,
      foreignKey: 'QuestionID',
      otherKey: 'QuestionPaperID',
      as: 'questionPapers'
    });
  };

  return Questions;
};
