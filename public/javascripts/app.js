var app = app || {};

$(function () {
    "use scrict";

    new app.TaskRouter();

    Backbone.history.start();
});
