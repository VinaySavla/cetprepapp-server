module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
      UserID: {
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
        allowNull: true
      },
      Gap: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isFaculty: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    return User;
  };
  