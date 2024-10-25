module.exports = (sequelize, DataTypes) => {
    const QuestionPaperQuestions = sequelize.define("QuestionPaperQuestions", {
        QuestionPaperQuestionID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
          }
    }, {
      createdAt: 'TimeStamp',
      updatedAt: false,
    });
    
    return QuestionPaperQuestions;
  };
  