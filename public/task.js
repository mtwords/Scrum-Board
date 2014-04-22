$(function () {
    'use strict';

    // --------------------- models ---------------------

    /**
     * Main task model
     */
    var Task = Backbone.Model.extend({
        urlRoot: '/tasks',
        defaults: {
            title: '',
            description: '',
            estimate: '2',
            responsible: 'Oliver',
            state: 'todo'
        }
    });

    /**
     * Collection of Task models
     */
    var TasksCollection = Backbone.Collection.extend({
        model: Task,
        url: '/tasks',

        all: function() {
          console.log('fetching all');
          this.fetch({reset: true});
          this.trigger('reload');
        }
    });

    // --------------------- views ---------------------
    /**
     * View of a single Task
     */
    var TaskView = Backbone.View.extend({
        tagName: 'li',
        template: _.template($('#item-template').html()),

        events: {
            "dblclick .view": "edit"
        },

        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.toggleClass('done', this.model.get('done'));
            this.input = this.$('.edit');
            return this;
        },
        edit: function () {
            taskList.showTaskForm(this.model);
        },
    });

    /**
     * View of the Task form. Used for creating new Tasks.
     */
    var TaskFormView = Backbone.View.extend({
        template: _.template($('#item-add-template').html()),

        events: {
            'click #save-task': 'saveTask',
            'click #delete': 'deleteTask',
            'click #cancel': 'close'
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));

            this.$('#title').val(this.model.get('title'));
            this.$('#description').val(this.model.get('description'));
            this.$('#estimate').val(this.model.get('estimate'));
            this.$('#responsible').val(this.model.get('responsible'));
            this.$('#state').val(this.model.get('state'));

            // only show delete button in edit mode
            if (this.model.isNew()) {
                this.$('#delete').detach();
            }

            return this;
        },
        
        saveTask: function() {
            this.model.set('title', this.$('#title').val());
            this.model.set('description', this.$('#description').val());
            this.model.set('estimate', this.$('#estimate').val());
            this.model.set('responsible', this.$('#responsible').val());
            this.model.set('state', this.$('#state').val());
            
            if (!this.model.isNew()) {
                // TODO: doesn't refresh automatically
                this.model.save({}, {
                    success: _.bind(function (model) {
                        Backbone.history.navigate("/", {trigger: true});
                        $('#modal').empty();
                        taskList.showAll();
                    })
                });
            } else {
                taskList.createItem(this.model);
                this.close();
            }
        },

        deleteTask: function() {
            this.model.destroy();
            this.close();
        },

        close: function() {
            Backbone.history.navigate("/", {trigger: true});
            $('#modal').empty();
            taskList.showAll();
        }
    });

    // --------------------- routers ---------------------
    /**
     * Main task router
     */
    var TaskRouter = Backbone.Router.extend({
        routes: {
            '' : 'showAllTasks',
            'add': 'addTask',
            'all': 'showAllTasks',
        },

        setApp: function(app) {
            this.app = app;
        },

        index: function() {
            console.log('we are in the index');
            this.app.showAll();
        },
        showAllTasks: function() {
            console.log('showing all Tasks');
            this.app.showAll();
        },
        addTask: function() {
            console.log('showing form for creating a new Task');
            this.app.showNewTaskForm();
        }
    });


    // --------------------- application ---------------------
    var TaskList = Backbone.View.extend({
        el: $('#taskapp'),

        events: {
            'click #add-item': 'createItem',
            'keypress #new-task': 'createItemOnEnter'
        },

        initialize: function () {
            this.tasks =  new TasksCollection();

            this.todoList = $('#todo-list');
            this.progressList = $('#progress-list');
            this.doneList = $('#done-list');

            this.listenTo(this.tasks, 'add', this.addItem);
            this.listenTo(this.tasks, 'all', this.render);
            this.listenTo(this.tasks, 'reload', this.reload);

            this.tasks.fetch({reset: true});
        },

        addItem: function (item) {
            var taskView = new TaskView({ model: item });
            var state = item.get('state');
            if (state === 'todo') this.todoList.append(taskView.render().el);
            if (state === 'progress') this.progressList.append(taskView.render().el);
            if (state === 'done') this.doneList.append(taskView.render().el);
        },

        addAll: function () {
            console.log('addAll');
            this.tasks.each(this.addItem, this);
        },

        reload: function() {
            console.log('reloading');
            this.todoList.empty();
            this.progressList.empty();
            this.doneList.empty();
            this.addAll();
        },

        createItemOnEnter: function (e) {
            if (e.keyCode != 13) return;
            this.createItem();
        },
        createItem: function (item) {
            this.tasks.create(item.toJSON());
        },

        updateItem: function(item) {
            this.tasks.update(item.toJSON());
        },

        showNewTaskForm: function() {
            this.showTaskForm(new Task())
        },
        showTaskForm: function(model) {
            var taskFormView = new TaskFormView({model: model});
            $('#modal').append(taskFormView.render().el);
        },
        showAll: function() {
            console.log('get all Items');
            this.tasks.all();
            console.log('nr. of items:' + this.tasks.length);
        }

    });

    // --------------------- initialisation tasks ---------------------
    var taskList = new TaskList();
    var router = new TaskRouter();
    router.setApp(taskList);
    Backbone.history.start();
});
