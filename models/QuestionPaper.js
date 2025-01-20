module.exports = (sequelize, DataTypes) => {
    const QuestionPaper = sequelize.define("QuestionPaper", {
      QuestionPaperID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      Title: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Result:{
        type: DataTypes.JSON,
        allowNull: true
      },
    }, {
      createdAt:'TimeStamp',
      updatedAt:false,
    });
    return QuestionPaper;
  };
  