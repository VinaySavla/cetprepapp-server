module.exports = (sequelize, DataTypes) => {
    const QuestionPaperQuestions = sequelize.define("QuestionPaperQuestions", {
        QuestionPaperQuestionID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
      QuestionPaperID: {
        type: DataTypes.INTEGER,
        references: {
          model: 'QuestionPaper',
          key: 'QuestionPaperID',
        },
        allowNull: false
      },
      QuestionID: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Questions',
          key: 'QuestionID',
        },
        allowNull: false
      }
    }, {
      createdAt: 'TimeStamp',
      updatedAt: false,
    });
    
    return QuestionPaperQuestions;
  };
  