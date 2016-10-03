var app = require('express');
var ObjectId = require('mongodb').ObjectId;
var path = require('path')
var router = app.Router();

 __parentDir = path.dirname(process.mainModule.filename);

var User = require(__parentDir + '/models/employeeModel');

router.get('/', (req, res) => {
	User.find({}, function (err, users) {
		res.send(users);
	});
});

router.get('/:id', (req, res) => {
	var id = req.params.id;
	User.findOne({ _id: id }, function (err, item) {
		if (err || item == null) {
			res.send("not found")
		} else {
			res.send(item)
		}
	});
});

router.post('/', (req, res) => {
	var newEmployee = new User(req.body)
	var saved = newEmployee.save()
	res.send(saved)
});

router.put('/:id', (req, res) => {
	User.findOne({ _id: id }, function (err, item) {
		if (err || item == null) {
			res.send("not found")
		} else {
			item = req.body
			item.save
			send(item)
		}
	});
});

router.delete('/:id', (req, res) => {
	var id = req.params.id;
	User.findOne({ _id: id }).remove(function (err, item) {
		if (err || item == null) {
			res.send("not deleted")
		} else
			res.send("deleted")
	});
});

module.exports = router;