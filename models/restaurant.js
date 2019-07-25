module.exports = function (sequelize, DataTypes) {
    var Restaurant = sequelize.define("Restaurant", {
        // Giving the Restaurant model a name of type STRING
        name: DataTypes.STRING
    });

    Restaurant.associate = function (models) {
        // Associating Restaurant with Menu
        // When an Restaurant is deleted, also delete any associated Menu
        Restaurant.hasMany(models.Menu, {
            onDelete: "cascade"
        });
    };

    return Restaurant;
};