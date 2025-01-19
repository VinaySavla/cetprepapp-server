module.exports = (sequelize, DataTypes) => {
    const Grievance = sequelize.define("Grievance", {
      GrievanceID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      Type:{
        type: DataTypes.TEXT,
        allowNull: false
      },
      Options:{
        type: DataTypes.TEXT,
        allowNull: true
      },
      Description:{
        type: DataTypes.TEXT,
        allowNull: false
      },
      Resolution:{
        type: DataTypes.TEXT,
        allowNull: true
      },
      Status:{
        type: DataTypes.TEXT,
        allowNull: true
      },
    }, {
      createdAt:'TimeStamp',
      updatedAt:false,
    });
    return Grievance;
  };
  