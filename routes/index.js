"use strict";

/*
 * GET home page.
 */

module.exports = function(app) {
    var controller = require('../controllers/tasks');

    app.get('/', function(req, res) {
        controller.index(app, req, res);
    });

    app.get('/tasks', function(req, res) {
        controller.index(app, req, res);
    });
}

/*
exports.index = function(req, res) {
  res.render('index', { title: 'Scrum-Board' app: app });
};
*/