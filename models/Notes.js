module.exports = (sequelize, DataTypes) => {
    const Notes = sequelize.define("Notes", {
      NoteID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      DocumentLink:{
        type: DataTypes.TEXT,
        allowNull: false
      },
    }, {
      createdAt:'TimeStamp',
      updatedAt:false,
    });
    return Notes;
  };
  