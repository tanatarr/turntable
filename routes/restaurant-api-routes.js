var db = require("../models");

module.exports = function (app) {
  app.get("/api/restaurants", function (req, res) {

    db.Restaurant.findAll({
      include: [db.Menu]
    }).then(function (dbRestaurant) {
      res.json(dbRestaurant);
    });
  });

  app.get("/api/restaurants/:id", function (req, res) {

    db.Restaurant.findOne({
      where: {
        id: req.params.id
      },
      include: [db.Menu]
    }).then(function (dbRestaurant) {
      res.json(dbRestaurant);
    });
  });

  app.post("/api/restaurants", function (req, res) {
    db.Restaurant.create(req.body).then(function (dbRestaurant) {
      res.json(dbRestaurant);
    });
  });

  app.delete("/api/restaurants/:id", function (req, res) {
    db.Restaurant.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (dbRestaurant) {
      res.json(dbRestaurant);
    });
  });

};
