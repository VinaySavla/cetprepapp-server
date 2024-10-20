module.exports = (sequelize, DataTypes) => {
    const FacultyUser = sequelize.define("FacultyUser", {
      FacultyID: {
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
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    }, {
      createdAt:'TimeStamp',
      updatedAt:false,
    });
    return FacultyUser;
  };
  