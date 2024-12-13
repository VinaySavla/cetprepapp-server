module.exports = (sequelize, DataTypes) => {
    const UserSubject = sequelize.define("UserSubject", {
      UserSubjectID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
          }
    }, {
      createdAt: 'TimeStamp',
      updatedAt: false,
    });
    
    return UserSubject;
  };
  