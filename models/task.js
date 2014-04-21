/**
 * a Task / Card model
 */
var Task = {
    tasks: [
    {
        id: '1',
        title: 'Title',
        description: 'Description',
        estimate: '2',
        responsible: 'Oliver',
        state: 'todo',
    },
    {
      id: '2',
        title: 'Title2',
        description: 'Description2',
        estimate: '2',
        responsible: 'Oliver',
        state: 'progress',
    },
    {
      id: '3',
        title: 'Title3',
        description: 'Description3',
        estimate: '3',
        responsible: 'Oliver',
        state: 'todo',
    },
    {
      id: '4',
        title: 'Write a scrum board app',
        description: 'scrum board app written in node.js and backbone.js',
        estimate: '2',
        responsible: 'Oliver',
        state: 'done',
    }
    ],
    
    last_id: 4,

  getNextId: function () {
    this.last_id += 1;
    return this.last_id;
  },

  clone: function (data) {
    // JavaScript doesn't have a real clone function
    // This is good enough for simple, data-only objects
    return JSON.parse(JSON.stringify(data));
  },

  // merges object with the attributes passed into this function
  //
  merge: function(object, attr) {
    for (var attrname in attr) {
      object[attrname] = attr[attrname];
    }
    return object;
  },

  add: function (data) {
    // poor mans 'dup' (ruby), otherwise we will be modifying the original object
    console.log('creating task with ' + data);
    var data = this.clone(data);
    var id = this.getNextId();
    data.id = id;
    this.tasks.push(data);
    return data;
  },

  update: function(data) {
    console.log('updating with ' + data);
    for (var i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].id == data['id']) {
        Task.merge(this.tasks[i], data);
        return this.tasks[i];
      }
    }
    return void 0;
  },

  find: function (id) {
    for (var i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].id == id) {
        return this.tasks[i];
      }
    }
    return void 0;
  },

  remove: function (id) {
    for (var i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].id == id) {
        var task = this.tasks[i];
        this.tasks.splice(i, 1);
        return task; // remove element and return it
      }

    }
    return void 0;
  },

  all: function () {
    return this.tasks;
  },

  clearAllEntries: function () {
    this.tasks = [];
    this.last_id = 0;
  }
};


exports.getAllEntries = function () {
  return Task.all();
};

exports.clearAllEntries = function () {
  return Task.clearAllEntries();
};



exports.create = function (data) {
  return Task.add(data);

};


exports.update = function (data) {
  return Task.update(data);
};



exports.find = function (id) {
  return Task.find(id);
};

exports.remove = function (id) {
  return Task.remove(id);
}


