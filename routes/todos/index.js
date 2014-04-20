
var controller = require('../../controllers/todos_controller');

module.exports = function(app) {

  app.get('/todos', function(req, res) {
      controller.index(app, req, res);
    }
  );

  app.get('/todos/:id', function(req,res) {
    controller.show(app, req, res);
  });

  app.put('/todos/:id', function(req,res) {
    controller.update(app, req, res);
  });

  app.post('/todos', function(req,res) {
    controller.create(app, req, res);
  });

  app.delete('/todos/:id', function(req,res) {
    controller.remove(app, req, res)
  })
}