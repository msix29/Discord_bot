const ranks = [
    "member",
    "valued member",
    "vip",
    "admin"
]

module.exports = {
    authenticate: (client) => {
        try {
            client.sequelize.authenticate();

            return true
        } catch {
            return false
        }
    },
    isUserExists: async (client, user) => {
        return await client.sequelize.models.members.findOne({ where: { discord_id: user.id } }) !== null
    },
    getData: async (client, user) => {
        let data;

        try {
            data = await client.sequelize.models.members.findOne({ where: { discord_id: user.id } })
        } catch (err) {
            data = null
        }

        return data
    },
    getNewRank: (currentRank, increase) => {
        const index = ranks.indexOf(currentRank)
        const newIndex = increase === true ? index + 1 : index - 1
        const realIndex = (
            newIndex > ranks.length - 1 && ranks.length - 1 ||
            newIndex < 0 && 0 ||
            newIndex
        )

        return ranks[realIndex]
    },
    canUpdateRank: (currentRank, increase) => {
        const index = ranks.indexOf(currentRank);

        if (index === 0 && increase === false) {
            return false
        } else if (index === ranks.length - 1 && increase === true) {
            return false
        }

        return true
    },
    updateDataBase: async (client, modelName, data, where) => {
        try {
            await client.sequelize.models[modelName].update(data, where)

            return true
        } catch {
            return false
        }
    }
}