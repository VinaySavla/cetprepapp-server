module.exports = (sequelize, DataTypes) => {
    const FacultyUserSubjects = sequelize.define("FacultyUserSubjects", {
      FacultyUserSubjectID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
          }
    }, {
      createdAt: 'TimeStamp',
      updatedAt: false,
    });
    
    return FacultyUserSubjects;
  };
  