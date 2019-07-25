// Dependencies
var db = require("../models");

// Routes
module.exports = function (app) {


  app.get("/api/menus", function (req, res) {
    var query = {};
    if (req.query.restaurant_id) {
      query.RestaurantId = req.query.restaurant_id;
    }

    db.Menu.findAll({
      where: query,
      include: [db.Restaurant]
    }).then(function (dbMenu) {
      res.json(dbMenu);
    });
  });

  app.get("/api/menu/:id", function (req, res) {

    db.Menu.findOne({
      where: {
        id: req.params.id
      },
      include: [db.Restaurant]
    }).then(function (dbMenu) {
      res.json(dbMenu);
    });
  });


  app.post("/api/menus", function (req, res) {
    db.Menu.create(req.body).then(function (dbMenu) {
      res.json(dbMenu);
    });
  });


  app.delete("/api/menus/:id", function (req, res) {
    db.Menu.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (dbMenu) {
      res.json(dbMenu);
    });
  });


  app.put("/api/menus", function (req, res) {
    db.Menu.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function (dbMenu) {
        res.json(dbMenu);
      });
  });
};
