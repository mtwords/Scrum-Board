// not used here. use function form instead
// "use strict";


var app = app || {};

(function () {
    "use strict";

    /**
     * Model for a Task
     */
    app.Task = Backbone.Model.extend({
        title: 'test'
    });

    /**
     * Collection of Tasks
     */
    app.TaskList = Backbone.Collection.extend({
        
    });
})();