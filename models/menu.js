module.exports = function (sequelize, DataTypes) {
    var Menu = sequelize.define("Menu", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: false,
            len: [1]
        },
        price: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    Menu.associate = function (models) {
        // We're saying that a Menu should belong to an Restaurant
        // A Menu can't be created without an Restaurant due to the foreign key constraint
        Menu.belongsTo(models.Restaurant, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Menu;
};