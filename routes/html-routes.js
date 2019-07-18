// Dependencies
// =============================================================
var db = require("../models");

// Routes
// =============================================================
module.exports = function (app) {

  // Load index page
  app.get("/", function (req, res) {
    db.Post.findAll({}).then(function () {
      res.render("index", {

      });
    });
  });

  // Load example page and pass in an example by id
  app.get("/example/:id", function (req, res) {
    db.Post.findOne({ where: { id: req.params.id } }).then(function (dbExample) {
      res.render("example", {
        example: dbExample
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};
