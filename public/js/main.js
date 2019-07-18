$(function () {
    $.scrollify({
        section: ".panel",
        easing: "easeOutQuad",
        scrollSpeed: 1100,
        scrollbars: false,
        sectionName: false,
        setHeights: false,
        overflowScroll: false,
        before: function (i) {
            var active = $(".slide.active");

            active.addClass("remove");


            //setTimeout(function() {
            $("[data-slide=" + i + "]").addClass("active");
            active.removeClass("remove active");
            //},300);

        },
        afterRender() {
            $(".panel").each(function () {
                $(this).css("height", parseInt($(window).height()) * 6);

                $(this).find(".inner").css("height", $(window).height());

            });


            $.scrollify.update();

            $("[data-slide=0]").addClass("active");

        }
    });
});