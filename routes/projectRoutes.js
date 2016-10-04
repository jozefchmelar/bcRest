var app = require('express');
var ObjectId = require('mongodb').ObjectId;
var path = require('path');
var router = app.Router();

__parentDir = path.dirname(process.mainModule.filename);

var User = require(__parentDir + '/models/employeeModel');
var Project = require(__parentDir + '/models/projectModel');
var util = require(__parentDir + '/util');

router.get('/', (req, res) => {
    Project.find({}, function (err, projects) {
        res.send(projects);
    });
});

router.get('/:number', (req, res) => {
    var number = req.params.number;

    Project.findOne({ number: number }).populate('employees').exec(function (err, item) {
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

// add people to project
// req body requires list of ids of people to add to project
// {"people" : [1,2,3,5,6,4,64,56498,131,3]} will add people with these id
// to project of "number" 

router.post('/:number/add', (req, res) => {
    var numbeOfProjectToFind = req.params.number + '';

    Project.findOne({ number: numbeOfProjectToFind }, function (err, foundProject) {
        if (err || foundProject == null) {
            res.send("project not found");
        } else {
            //found project
            var usersIDsToAdd = (req.body.people);
            var project = foundProject;
            // add only new user numbers to project
            for (userID of usersIDsToAdd) {
                if (project.employees.indexOf(userID) === -1) {
                    project.employees.push(userID)
                }
            }
            project.save();
            //for every person I added to the project, update their project list.
            for (userID of usersIDsToAdd) {
                User.findOne({ _id: userID }, (err, foundUser) => {
                    if (err || foundUser == null) {
                        res.send("project not found");
                    } else {
                        var userToAdd = foundUser;
                        if (userToAdd.projects.indexOf(project.number) === -1) {
                            userToAdd.projects.push(project.number);
                        }
                        userToAdd.save();
                    }
                })
            }
            res.send("OK")
        }
    })
});

module.exports = router;