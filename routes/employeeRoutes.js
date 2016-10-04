var app = require('express');
var ObjectId = require('mongodb').ObjectId;
var path = require('path');
var router = app.Router();

__parentDir = path.dirname(process.mainModule.filename);

var User = require(__parentDir + '/models/employeeModel');
var Project = require(__parentDir + '/models/projectModel');
//{passoword:0} don't dislpay passwords'
router.get('/', (req, res) => {
    User.find({}, { password: 0 }, function (err, users) {
        res.send(users);
    });
});

router.get('/:id', (req, res) => {
    var id = req.params.id;
    User.findOne({ _id: id }, { password: 0 }, function (err, item) {
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
    res.send(saved);
});

router.put('/:id', (req, res) => {
    var id = req.params.id;
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
    User.findOne({ _id: id }).populate('projects').exec(function (err, item) {
        if (err || item == null) {
            res.send("not found " + err);
        }
        res.send(item)
    });
});

module.exports = router;