// Dependencies
// =============================================================
var db = require("../models");

// Routes
// =============================================================
module.exports = function (app) {

  // Load index page
  app.get("/", function (req, res) {
    res.render("index");
  });

  app.get("/menu", function (req, res) {
    db.Menu.findAll({}).then(function (dbMenu) {
      res.render("menu", {
        menu: dbMenu
      });
    });
  });

  app.get("/menu/:id", function (req, res) {
    db.Menu.findOne({ where: { id: req.params.id } }).then(function (dbMenu) {
      res.render("menu", {
        menu: dbMenu
      });
    });
  });

  app.get("/dashboard", function (req, res) {
    db.Menu.findAll({}).then(function (dbMenu) {
      res.render("dashboard", {
        menu: dbMenu
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};
