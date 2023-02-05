const { DataTypes } = require('sequelize');

module.exports.import = (sequelize) => sequelize.define('members', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    discord_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rank: {
        type: DataTypes.STRING,
        defaultValue: 'member',
        allowNull: false
    },
    strikes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
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