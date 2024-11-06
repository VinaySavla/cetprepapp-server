module.exports = (sequelize, DataTypes) => {
    const Questions = sequelize.define("Questions", {
      QuestionID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      Question: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      OptionA:{
        type: DataTypes.TEXT,
        allowNull: false
      },
      OptionB:{
        type: DataTypes.TEXT,
        allowNull: false
      },
      OptionC:{
        type: DataTypes.TEXT,
        allowNull: false
      },
      OptionD:{
        type: DataTypes.TEXT,
        allowNull: false
      },
      CorrectOption:{
        type: DataTypes.STRING,
        allowNull: false
      },
      Difficulty:{
        type: DataTypes.STRING,
        allowNull: false
      },
      isPYQ: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    }, {
      createdAt:'TimeStamp',
      updatedAt:true,
    });
    return Questions;
  };
  