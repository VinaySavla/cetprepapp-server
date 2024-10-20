module.exports = (sequelize, DataTypes) => {
    const QuestionPaper = sequelize.define("QuestionPaper", {
      QuestionPaperID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      Result:{
        type: DataTypes.STRING,
        allowNull: true
      },
    }, {
      createdAt:'TimeStamp',
      updatedAt:false,
    });
    return QuestionPaper;
  };
  