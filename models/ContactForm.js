module.exports = (sequelize, DataTypes) => {
    const ContactForm = sequelize.define("ContactForm", {
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
      PreferredMethodOfContact:{
        type: DataTypes.STRING,
        allowNull: true
      },
      InterestedServices: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      InvestmentExperience: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      City: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Subject: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Message: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isContacted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    }, {
      createdAt:'TimeStamp',
      updatedAt:false,
    });
    return ContactForm;
  };
  