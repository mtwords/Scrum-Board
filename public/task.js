$(function () {
    'use strict';

    // --------------------- models ---------------------

    /**
     * Main task model
     */
    var Task = Backbone.Model.extend({
        defaults: {
            title: '',
            description: '',
            estimate: '2',
            responsible: 'Oliver',
            state: 'todo',
            done: false
        },

        toggle: function () {
          this.save({done: !this.get('done')});
        }
    });

    /**
     * Collection of Task models
     */
    var TasksCollection = Backbone.Collection.extend({
        model: Task,
        url: '/tasks',

        open: function() {
          console.log('fetching open');
          this.fetch({reset: true});
          this.reset(this.where({done: false}));
          this.trigger('reload');
        },
        completed: function() {
          console.log('fetching completed');
          this.fetch({reset: true});
          this.reset(this.where({done: true}));
          this.trigger('reload');
        },

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
            "click .toggle": "toggleDone",
            "dblclick .view": "edit",
            "keypress .edit": "updateOnEnter",
            "blur .edit": "close"
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
        toggleDone: function () {
            console.log('toggle model');
            this.model.toggle();
        },
        edit: function () {
            this.$el.addClass("editing");
            this.input.focus();
        },
        close: function () {
            var value = this.input.val();
            if (!value) {
                this.clear();
            } else {
                this.model.save({title: value});
                this.$el.removeClass("editing");
            }
        },
        updateOnEnter: function (e) {
            if (e.keyCode == 13) this.close();
        }
    });

    /**
     * View of the Task form. Used for creating new Tasks.
     */
    var TaskFormView = Backbone.View.extend({
        //tagName: 'div',
        //className: 'modal',
        template: _.template($('#item-add-template').html()),

        events: {
            'click #save-task': 'saveTask',
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));

            this.$('#title').val(this.model.get('title'));
            this.$('#description').val(this.model.get('description'));
            this.$('#estimate').val(this.model.get('estimate'));
            this.$('#responsible').val(this.model.get('responsible'));
            this.$('#state').val(this.model.get('state'));

            return this;
        },
        
        saveTask: function() {
            this.model.set('title', this.$('#title').val());
            this.model.set('description', this.$('#description').val());
            this.model.set('estimate', this.$('#estimate').val());
            this.model.set('responsible', this.$('#responsible').val());
            this.model.set('state', this.$('#state').val());
            
            //this.model.save(this.model.toJSON());
            //taskList.addItem(this.model);
            taskList.createItem(this.model);
            Backbone.history.navigate("/", {trigger: true});
            $('#modal').empty();
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

            this.input = $('#new-task');
            this.todoList = $('#todo-list');
            this.progressList = $('#progress-list');
            this.doneList = $('#done-list');

            this.listenTo(this.tasks, 'add', this.addItem);
            this.listenTo(this.tasks, 'all', this.render);
            // this.listenTo(this.tasks, 'reset', this.reload);
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
            this.todoList.empty(); // clear the DOM element
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
            /*
            if (!this.input.val()) return;
            this.tasks.create({ title: this.input.val() });
            this.input.val('');
            */
        },

        showNewTaskForm: function() {
            var taskFormView = new TaskFormView({model: new Task()});
            $('#modal').append(taskFormView.render().el);
        },
        showAll: function() {
            console.log('get all Items');
            this.tasks.all();
            //this.addAll();
            console.log('nr. of items:' + this.tasks.length);
        }

    });

    // --------------------- initialisation tasks ---------------------
    var taskList = new TaskList();
    var router = new TaskRouter();
    router.setApp(taskList);
    Backbone.history.start();
});
