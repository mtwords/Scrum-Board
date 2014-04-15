"use strict";

var Task = {
    tasks: [
        {
            id: '1',
            title: 'Title',
            description: 'Description',
            estimate: '2',
            responsible: 'Oliver',
            state: 'todo',
        }
    ],
    lastId: 1,
    
    all: function() {
        return this.tasks;
    }
};

exports.getAll = function () {
    return Task.all();
};
