module.exports = (sequelize, DataTypes) => {
    const Chapters = sequelize.define("Chapters", {
      ChapterID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      ChapterName:{
        type: DataTypes.STRING,
        allowNull: false
      },
    }, {
      createdAt:'TimeStamp',
      updatedAt:false,
    });
    return Chapters;
  };
  