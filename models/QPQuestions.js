module.exports = (sequelize, DataTypes) => {
    const QPQuestions = sequelize.define("QPQuestions", {
      QPQuestionID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
          }
    }, {
      createdAt: 'TimeStamp',
      updatedAt: false,
    });
    
    return QPQuestions;
  };
  