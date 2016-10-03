var app = require('express');
var ObjectId = require('mongodb').ObjectId;
var path = require('path');
var router = app.Router();

__parentDir = path.dirname(process.mainModule.filename);

var User = require(__parentDir + '/models/employeeModel');
var Project = require(__parentDir + '/models/projectModel');

router.get('/', (req, res) => {
	User.find({}, function (err, users) {
		res.send(users);
	});
});

router.get('/:id', (req, res) => {
	var id = req.params.id;
	User.findOne({ _id: id }, function (err, item) {
		if (err || item == null) {
			res.send("not found");
		} else {
			res.send(item);
		}
	});
});

router.post('/', (req, res) => {
	var newEmployee = new User(req.body);
	var saved = newEmployee.save();
	res.send(newEmployee);
});

router.put('/:id', (req, res) => {
	var id = req.params.id
	User.findOne({ _id: id }, function (err, item) {
		if (err || item == null) {
			res.send("not found");
		} else {
			item = req.body;
			item.save;
			res.send(item);
		}
	});
});

router.delete('/:id', (req, res) => {
	var id = req.params.id;
	User.findOne({ _id: id }).remove(function (err, item) {
		if (err || item == null) {
			res.send("not deleted");
		} else
			res.send("deleted");
	});
});

router.get('/:id/project', (req, res) => {
	var id = req.params.id;
	User.findOne({ _id: id }, function (err, item) {
		if (err || item == null) {
			res.send("not found");
		} else {
			var arrProjectIds = item.projectIds
			var projectList = []
			for (val of arrProjectIds) {
				Project.findOne({ number: val }, (err, item) => {
					projectList.push(item)
					//TODO tuto asynchronnu kokotinu opravit.
				})
			}
			console.log(projectList)
			res.send(projectList);

		}
	});
});

module.exports = router;