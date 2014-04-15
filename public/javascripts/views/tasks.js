// not used here. use function form instead
// "use strict";

var app = app || {};

(function () {
    "use strict";
    
    app.TaskView = Backbone.View.extend({
        tagName: 'li',
        render: function () {
            this.$el.html(this.model.toJSON());
            return this;
        }
    });
})();
