$(document).ready(function () {
    /* global moment */

    // menuContainer holds all of our menus
    var menuContainer = $(".menu-container");
    var menuCategorySelect = $("#category");
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
        newMenuCard.css({
            "flex-direction": "row-reverse",
            "margin": "15px 0px"
        });
        var newMenuCardHeading = $("<div>");
        newMenuCardHeading.addClass("card-header");
        newMenuCardHeading.css({
            "width": "65%"
        });
        var newMenuTitle = $("<h3>");
        var newMenuRestaurant = $("<p>");
        newMenuRestaurant.text("Category: " + menu.Restaurant.name);
        var newMenuBody = $("<p>");
        var newMenuPrice = $("<p>");
        var newImageCardBody = $("<div>");
        newImageCardBody.css({
            "background": "url(../images/food.png) no-repeat center center /contain",
            "width": "35%"
        });
        newMenuTitle.text(menu.title + " ");
        newMenuBody.text(menu.body);
        newMenuPrice.text("$ " + menu.price);
        newMenuCardHeading.append(newMenuPrice);
        newMenuCardHeading.append(newMenuTitle);
        newMenuCardHeading.append(newMenuRestaurant);
        newMenuCardHeading.append(newMenuBody);
        newMenuCard.append(newMenuCardHeading);
        newMenuCard.append(newImageCardBody);
        newMenuCard.data("menu", menu);
        newMenuTitle.css({
            "font-weight": "bold",
            "font-size": "20px"
        });
        newMenuPrice.css({
            "font-weight": "bold",
            "font-size": "30px",
            "line-height": "30px",
            "float": "right",
        });
        return newMenuCard;
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
