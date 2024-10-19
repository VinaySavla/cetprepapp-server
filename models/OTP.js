module.exports = (sequelize, DataTypes) => {
    const OTP = sequelize.define("OTP", {
      ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      Email:{
        type: DataTypes.STRING,
        allowNull: false
      },
      OTP:{
        type: DataTypes.STRING,
        allowNull: false
      },
      ExpiresAt:{
        type: DataTypes.DATE,
        allowNull: false
      },
    }, {
      createdAt:'TimeStamp',
      updatedAt:false,
    });
    return OTP;
  };
  