$(function () {


// Model

  var Todo = Backbone.Model.extend({
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

  var TodosCollection = Backbone.Collection.extend({
    model: Todo,
    url: '/todos',

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




  var TodoView = Backbone.View.extend({

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

  // Router

  var TodoRouter = Backbone.Router.extend({

    routes: {
      '' : 'showAllTodos',
      'all': 'showAllTodos',
      'open': 'showOpenTodos',
      'completed' : 'showCompletedTodos'
    },

    setApp: function(app) {
      this.app = app;
    },

    index: function() {
      console.log('we are in the index');
      this.app.showAll();
    },
    showAllTodos: function() {
      console.log('showing all todos');
      this.app.showAll();
    },
    showOpenTodos: function() {
      console.log('showing open todos');
      this.app.showOpen();
    },
    showCompletedTodos: function() {
      console.log('showing completed todos');
      this.app.showCompleted();
    }

  });


  var TodoList = Backbone.View.extend({
    el: $('#todoapp'),


    events: {
      'click #add-item': 'createItem',
      'keypress #new-todo': 'createItemOnEnter'
    },

    initialize: function () {
      this.todos =  new TodosCollection();

      this.input = $('#new-todo');
      this.todoList = $('#todo-list');
      this.progressList = $('#progress-list');
      this.doneList = $('#done-list');

      this.listenTo(this.todos, 'add', this.addItem);
      this.listenTo(this.todos, 'all', this.render);
      // this.listenTo(this.todos, 'reset', this.reload);
      this.listenTo(this.todos, 'reload', this.reload);

      this.todos.fetch({reset: true});

    },

    addItem: function (item) {
      var todoView = new TodoView({ model: item });
        var state = item.get('state');
        if (state === 'todo') this.todoList.append(todoView.render().el);
        if (state === 'progress') this.progressList.append(todoView.render().el);
        if (state === 'done') this.doneList.append(todoView.render().el);
    },

    addAll: function () {
      console.log('addAll');
      this.todos.each(this.addItem, this);
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
    createItem: function () {
      if (!this.input.val()) return;
      this.todos.create({ title: this.input.val() });
      this.input.val('');
    },

    showOpen: function() {
      console.log('get open Items');
      this.todos.open();
      console.log('nr. of items:' + this.todos.length);
    },
    showCompleted: function() {
      console.log('get completed Items');
      this.todos.completed();
      console.log('nr. of items:' + this.todos.length);
    },
    showAll: function() {
      console.log('get all Items');
      this.todos.all();
      console.log('nr. of items:' + this.todos.length);
    }

  });





  var todoList = new TodoList();
  var router = new TodoRouter();
  router.setApp(todoList);
  Backbone.history.start();


});
