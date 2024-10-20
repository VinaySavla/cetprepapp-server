module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
      Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      Name:{
        type: DataTypes.STRING,
        allowNull: false
      },
      Email:{
        type: DataTypes.STRING,
        allowNull: false
      },
      PhoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Password:{
        type: DataTypes.STRING,
        allowNull: false
      },
      Role:{
        type: DataTypes.STRING,
        allowNull: false
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    }, {
      createdAt:'TimeStamp',
      updatedAt:false,
    });
    return Users;
  };
  