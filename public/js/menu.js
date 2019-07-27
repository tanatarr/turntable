$(document).ready(function () {
  /* global moment */

  // menuContainer holds all of our menus
  var menuContainer = $(".menu-container");
  var menuCategorySelect = $("#category");
  // Click events for the edit and delete buttons
  $(document).on("click", "button.delete", handleMenuDelete);
  $(document).on("click", "button.edit", handleMenuEdit);
  // Variable to hold our menus
  var menus;

  // The code below handles the case where we want to get blog menus for a specific restaurant
  // Looks for a query param in the url for restaurant_id
  var url = window.location.search;
  var restaurantId;
  if (url.indexOf("?restaurant_id=") !== -1) {
    restaurantId = url.split("=")[1];
    getMenus(restaurantId);
  }
  // If there's no restaurantId we just get all menus as usual
  else {
    getMenus();
  }


  // This function grabs menus from the database and updates the view
  function getMenus(restaurant) {
    restaurantId = restaurant || "";
    if (restaurantId) {
      restaurantId = "/?restaurant_id=" + restaurantId;
    }
    $.get("/api/menus" + restaurantId, function (data) {
      console.log("Menus", data);
      menus = data;
      if (!menus || !menus.length) {
        displayEmpty(restaurant);
      }
      else {
        initializeRows();
      }
    });
  }

  // This function does an API call to delete menus
  function deleteMenu(id) {
    $.ajax({
      method: "DELETE",
      url: "/api/menus/" + id
    })
      .then(function () {
        getMenus(menuCategorySelect.val());
      });
  }

  // InitializeRows handles appending all of our constructed menu HTML inside menuContainer
  function initializeRows() {
    menuContainer.empty();
    var menusToAdd = [];
    for (var i = 0; i < menus.length; i++) {
      menusToAdd.push(createNewRow(menus[i]));
    }
    menuContainer.append(menusToAdd);
  }

  // This function constructs a menu's HTML
  function createNewRow(menu) {
    var newMenuCard = $("<div>");
    newMenuCard.addClass("card");
    var newMenuCardHeading = $("<div>");
    newMenuCardHeading.addClass("card-header");
    var editBtn = $("<button>");
    editBtn.text("EDIT");
    editBtn.addClass("edit btn btn-warning");
    var deleteBtn = $("<button>");
    deleteBtn.text("DELETE");
    deleteBtn.addClass("delete btn btn-danger");
    var newMenuTitle = $("<h2>");
    var newMenuRestaurant = $("<h5>");
    newMenuRestaurant.text("Category: " + menu.Restaurant.name);
    deleteBtn.css({
      "margin":
        "15px"
    });
    editBtn.css({
      "margin":
        "15px"
    });
    newMenuCard.css({
      "width": "30%",
      "margin": "15px"
    });
    var newMenuCardBody = $("<div>");
    newMenuCardBody.addClass("card-body");
    var newMenuBody = $("<p>");
    var newMenuPrice = $("<p>");
    newMenuTitle.text(menu.title + " ");
    newMenuBody.text(menu.body);
    newMenuPrice.text("$ " + menu.price);
    newMenuCardHeading.append(newMenuTitle);
    newMenuCardHeading.append(newMenuRestaurant);
    newMenuCardHeading.append(newMenuPrice);
    newMenuCardBody.append(newMenuBody);
    newMenuCard.append(newMenuCardHeading);
    newMenuCard.append(newMenuCardBody);
    newMenuCardBody.append(editBtn);
    newMenuCardBody.append(deleteBtn);
    newMenuCard.data("menu", menu);
    newMenuPrice.css({
      "font-weight": "bold",
      "font-size": "15px"
    });
    return newMenuCard;
  }

  // This function figures out which menu we want to delete and then calls deleteMenu
  function handleMenuDelete() {
    var currentMenu = $(this)
      .parent()
      .parent()
      .data("menu");
    deleteMenu(currentMenu.id);
  }

  // This function figures out which menu we want to edit and takes it to the appropriate url
  function handleMenuEdit() {
    var currentMenu = $(this)
      .parent()
      .parent()
      .data("menu");
    window.location.href = "/dashboard?menu_id=" + currentMenu.id;
  }

  // This function displays a message when there are no menus
  function displayEmpty(id) {
    var query = window.location.search;
    var partial = "";
    if (id) {
      partial = " for restaurant #" + id;
    }
    menuContainer.empty();
    var messageH2 = $("<h2>");
    messageH2.css({ "text-align": "center", "margin-top": "50px" });
    messageH2.html("No menus yet");
    menuContainer.append(messageH2);
  }

});
