var app = require('express');
var ObjectId = require('mongodb').ObjectId;
var path = require('path');
var router = app.Router();

__parentDir = path.dirname(process.mainModule.filename);

var User = require(__parentDir + '/models/employeeModel');
var Project = require(__parentDir + '/models/projectModel');

router.get('/', (req, res) => {
   Project.find({}, function (err,projects) {
      res.send(projects);
   });
});

router.get('/:number', (req, res) => {
   var number = req.params.number;
   
   Project.findOne({ number: number }, function (err, item) {
      if (err || item == null) {
         res.send("not found");
      } else {
         res.send(item);
      }
   });
});


router.post('/', (req, res) => {
   var newProject = new Project(req.body);
   var saved = newProject.save();
   res.send(saved);
});

router.put('/:id', (req, res) => {
   Project.findOne({ _id: id }, function (err, item) {
      if (err || item == null) {
         res.send("not found");
      } else {
         item = req.body;
         item.save;
         send(item);
      }
   });
});

router.delete('/:id', (req, res) => {
   var id = req.params.id;
   Project.findOne({ _id: id }).remove(function (err, item) {
      if (err || item == null) {
         res.send("not deleted");
      } else
			res.send("deleted");
   });
});


module.exports = router;