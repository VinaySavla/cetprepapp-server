module.exports = (sequelize, DataTypes) => {
    const FacultySubjects = sequelize.define("FacultySubjects", {
      FacultySubjectsID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
    }, {
      createdAt:'TimeStamp',
      updatedAt:false,
    });
    return FacultySubjects;
  };
  