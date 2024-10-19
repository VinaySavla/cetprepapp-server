module.exports = (sequelize, DataTypes) => {
    const Subjects = sequelize.define("Subjects", {
      SubjectID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      SubjectName:{
        type: DataTypes.STRING,
        allowNull: false
      },
    }, {
      createdAt:'TimeStamp',
      updatedAt:false,
    });
    return Subjects;
  };
  