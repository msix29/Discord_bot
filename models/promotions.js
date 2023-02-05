const { DataTypes } = require('sequelize');

module.exports.import = (sequelize) => sequelize.define('promotions', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    discord_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    staff: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    
    reason: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
})