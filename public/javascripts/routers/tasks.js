var app = app || {};

(function() {
    "use strict";

    /**
     * The main task router.
     */
    app.TaskRouter = Backbone.Router.extend({
        routes: {
            '': 'index'
        },
        index: function() {
            this.navigate(randomBoard(), {trigger: true});
        }
    });

})();
