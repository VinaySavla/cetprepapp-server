module.exports = (sequelize, DataTypes) => {
    const QuestionPaperQuestions = sequelize.define("QuestionPaperQuestions", {
      QuestionPaperQuestionsID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
    }, {
      createdAt:'TimeStamp',
      updatedAt:false,
    });
    return QuestionPaperQuestions;
  };
  