$(document).ready(function () {
  // Getting jQuery references to the menu body, title, form, and restaurant select
  var bodyInput = $("#body");
  var titleInput = $("#title");
  var priceInput = $("#price");
  var cmsForm = $("#cms");
  var restaurantSelect = $("#restaurant");
  // Adding an event listener for when the form is submitted
  $(cmsForm).on("submit", handleFormSubmit);
  // Gets the part of the url that comes after the "?" (which we have if we're updating a menu)
  var url = window.location.search;
  var menuId;
  var restaurantId;
  // Sets a flag for whether or not we're updating a menu to be false initially
  var updating = false;

  // If we have this section in our url, we pull out the menu id from the url
  // In '?menu_id=1', menuId is 1
  if (url.indexOf("?menu_id=") !== -1) {
    menuId = url.split("=")[1];
    getMenuData(menuId, "menu");
  }
  // Otherwise if we have an restaurant_id in our url, preset the restaurant select box to be our restaurant
  else if (url.indexOf("?restaurant_id=") !== -1) {
    restaurantId = url.split("=")[1];
  }

  // Getting the restaurants, and their menus
  getRestaurants();

  // A function for handling what happens when the form to create a new menu is submitted
  function handleFormSubmit(event) {
    event.preventDefault();
    // Wont submit the menu if we are missing a body, title, or restaurant
    if (!titleInput.val().trim() || !bodyInput.val().trim() || !priceInput.val().trim() || !restaurantSelect.val()) {
      return;
    }
    // Constructing a newMenu object to hand to the database
    var newMenu = {
      title: titleInput
        .val()
        .trim(),
      body: bodyInput
        .val()
        .trim(),
      price: priceInput
        .val()
        .trim(),
      RestaurantId: restaurantSelect.val()
    };

    // If we're updating a menu run updatemenu to update a menu
    // Otherwise run submitmenu to create a whole new menu
    if (updating) {
      newMenu.id = menuId;
      updateMenu(newMenu);
    }
    else {
      submitMenu(newMenu);
    }
  }

  // Submits a new menu and brings user to blog page upon completion
  function submitMenu(menu) {
    $.post("/api/menus", menu, function () {
      window.location.href = "/dashboard";
    });
  }

  // Gets menu data for the current menu if we're editing, or if we're adding to an restaurant's existing menus
  function getMenuData(id, type) {
    var queryUrl;
    switch (type) {
      case "menu":
        queryUrl = "/api/menus/" + id;
        break;
      case "restaurant":
        queryUrl = "/api/restaurants/" + id;
        break;
      default:
        return;
    }
    $.get(queryUrl, function (data) {
      if (data) {
        console.log(data.RestaurantId || data.id);
        // If this menu exists, prefill our cms forms with its data
        titleInput.val(data.title);
        bodyInput.val(data.body);
        priceInput.val(data.price);
        restaurantId = data.RestaurantId || data.id;
        // If we have a menu with this id, set a flag for us to know to update the menu
        // when we hit submit
        updating = true;
      }
    });
  }


  function getRestaurants() {
    $.get("/api/restaurants", renderRestaurantList);
  }

  function renderRestaurantList(data) {
    if (!data.length) {
      window.location.href = "/dashboard";
    }
    $(".hidden").removeClass("hidden");
    var rowsToAdd = [];
    for (var i = 0; i < data.length; i++) {
      rowsToAdd.push(createRestaurantRow(data[i]));
    }
    restaurantSelect.empty();
    console.log(rowsToAdd);
    console.log(restaurantSelect);
    restaurantSelect.append(rowsToAdd);
    restaurantSelect.val(restaurantId);
  }

  // Creates the restaurant options in the dropdown
  function createRestaurantRow(restaurant) {
    var listOption = $("<option>");
    listOption.attr("value", restaurant.id);
    listOption.text(restaurant.name);
    return listOption;
  }

  // Update a given menu, bring user to the menu page when done
  function updateMenu(menu) {
    $.ajax({
      method: "PUT",
      url: "/api/menus",
      data: menu
    })
      .then(function () {
        window.location.href = "/dashboard";
      });
  }
});


$(document).ready(function () {
  // Getting references to the name input and restaurant container, as well as the table body
  var nameInput = $("#restaurant-name");
  var restaurantList = $("tbody");
  var restaurantContainer = $(".restaurant-container");
  // Adding event listeners to the form to create a new object, and the button to delete
  // an restaurant
  $(document).on("submit", "#restaurant-form", handleRestaurantFormSubmit);
  $(document).on("click", ".delete-restaurant", handleDeleteButtonPress);

  // Getting the initial list of restaurants
  getRestaurants();

  // A function to handle what happens when the form is submitted to create a new restaurant
  function handleRestaurantFormSubmit(event) {
    event.preventDefault();
    // Don't do anything if the name fields hasn't been filled out
    if (!nameInput.val().trim().trim()) {
      return;
    }
    // Calling the upsertrestaurant function and passing in the value of the name input
    upsertRestaurant({
      name: nameInput
        .val()
        .trim()
    });
  }

  // A function for creating an restaurant. Calls getRestaurants upon completion
  function upsertRestaurant(restaurantData) {
    $.post("/api/restaurants", restaurantData)
      .then(getRestaurants);
  }

  // Function for creating a new list row for restaurants
  function createRestaurantRow(restaurantData) {
    var newTr = $("<tr>");
    newTr.data("restaurant", restaurantData);
    newTr.append("<td>" + restaurantData.name + "</td>");
    if (restaurantData.Menus) {
      newTr.append("<td> " + restaurantData.Menus.length + "</td>");
    } else {
      newTr.append("<td>0</td>");
    }
    newTr.append("<td><a href='/menu?restaurant_id=" + restaurantData.id + "'>Go to Menu</a></td>");
    newTr.append("<td><a href='/dashboard?restaurant_id=" + restaurantData.id + "'>Create a Menu item</a></td>");
    newTr.append("<td><a style='cursor:pointer;color:red' class='delete-restaurant'>Delete category</a></td>");
    return newTr;
  }

  // Function for retrieving restaurants and getting them ready to be rendered to the page
  function getRestaurants() {
    $.get("/api/restaurants", function (data) {
      var rowsToAdd = [];
      for (var i = 0; i < data.length; i++) {
        rowsToAdd.push(createRestaurantRow(data[i]));
      }
      renderRestaurantList(rowsToAdd);
      nameInput.val("");
    });
  }

  // A function for rendering the list of restaurants to the page
  function renderRestaurantList(rows) {
    restaurantList.children().not(":last").remove();
    restaurantContainer.children(".alert").remove();
    if (rows.length) {
      console.log(rows);
      restaurantList.prepend(rows);
    }
    else {
      renderEmpty();
    }
  }

  // Function for handling what to render when there are no restaurants
  function renderEmpty() {
    var alertDiv = $("<div>");
    alertDiv.addClass("alert alert-danger");
    alertDiv.text("You must create an restaurant before you can create a menu.");
    restaurantContainer.append(alertDiv);
  }

  // Function for handling what happens when the delete button is pressed
  function handleDeleteButtonPress() {
    var listItemData = $(this).parent("td").parent("tr").data("restaurant");
    var id = listItemData.id;
    $.ajax({
      method: "DELETE",
      url: "/api/restaurants/" + id
    })
      .then(getRestaurants);
  }
});
