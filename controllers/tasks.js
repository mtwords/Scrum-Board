"use strict";

exports.index = function(app, req, res) {
    var tasks = app.models.task.getAll();
    res.json( tasks );
};