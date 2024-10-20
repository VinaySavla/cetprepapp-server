module.exports = (sequelize, DataTypes) => {
    const StudentUser = sequelize.define("StudentUser", {
      StudentID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      FirstName:{
        type: DataTypes.STRING,
        allowNull: false
      },
      LastName:{
        type: DataTypes.STRING,
        allowNull: false
      },
      Email:{
        type: DataTypes.STRING,
        allowNull: false
      },
      Password:{
        type: DataTypes.STRING,
        allowNull: false
      },
      PhoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      CurrentClass:{
        type: DataTypes.STRING,
        allowNull: false
      },
      Gap: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    }, {
      createdAt:'TimeStamp',
      updatedAt:false,
    });
    return StudentUser;
  };
  