var app = require('express');
var ObjectId = require('mongodb').ObjectId;
var path = require('path');
var router = app.Router();


__parentDir = path.dirname(process.mainModule.filename);

var User = require(__parentDir + '/models/employeeModel');
var Project = require(__parentDir + '/models/projectModel');
var Comment = require(__parentDir + '/models/commentModel');
var Trip = require(__parentDir + '/models/tripModel');

router.get('/', (req, res) => {
    Project.find({}, function (err, projects) {
        res.send(projects);
    });
});

router.get('/:number', (req, res) => {
    var number = req.params.number;
    var attributesToDispaly = 'firstName lastName email phone position';
    Project.findOne({ _id: number }).populate('employees',attributesToDispaly).exec(function (err, item) {
        if (err || item == null) {
            res.send("not found");
        } else {
            res.send(item);
        }
    });
});


router.post('/', (req, res) => {

    console.log(req.body)
    var newProject = new Project(req.body);
    console.log(newProject)
    var saved = newProject.save(function (err) {
        if(err) {
            console.error('ERROR!' + err);
        }else{
            Project.findOne({ _id: newProject._id }, function (err, foundProject) {
        if (err || foundProject == null) {
            res.send("project not found");
        } else {
            //found project
            var usersIDsToAdd = (newProject.employees);
            var project = foundProject;
            // add only new user numbers to project
            for (userID of usersIDsToAdd) {
                if (project.employees.indexOf(userID) === -1) {
                    project.employees.push(userID);
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
                        if (userToAdd.projects.indexOf(project._id) === -1) {
                            userToAdd.projects.push(project._id);
                        }
                        userToAdd.save();
                    }
                });
            }
            //res.send(true);
        }
    });
        }
    });

    

    console.log(saved)

    res.send(newProject);
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
    var numbeOfProjectToFind = ""+req.params.number+"" ;

    Project.findOne({ _id: numbeOfProjectToFind }, function (err, foundProject) {
        if (err ) {
            console.log(_id)
            console.log(numbeOfProjectToFind)
            console.log(_id===numbeOfProjectToFind)

            res.send(false);
            next()
        } else {
            //found project
            var usersIDsToAdd = (req.body.people);
            var project = foundProject;
            // add only new user numbers to project
            for (userID of usersIDsToAdd) {
                if (project.employees.indexOf(userID) === -1) {
                    project.employees.push(userID);
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
                             userToAdd.save();
                        }
                       

                    }
                });

            }
                        res.send(true);

        }
    });


});

// post comment on certain project
// format
// id is employeeID in model as _id: Number
// { "userId": id, "text":"lorem ipsum"} 
router.post('/:number/comment', (req, res) => {
    var number = req.params.number;

    Project.findOne({ _id: number }).exec(function (err, foundProject) {
        if (err || foundProject == null) {
            res.send("not found");
        } else {
            var comment = new Comment(req.body);
            comment.save()            
            foundProject.comments.push(comment._id);
            foundProject.save();
 
            res.send( {comment :comment, success:true});
        }
    });
});

router.get('/:number/comment', (req, res) => {
    var number = req.params.number;

    Project.findOne({ _id: number }).populate({ path: 'comments', populate: { path: 'author', model: 'Employee' } }).exec(function (err, foundProject) {
        if (err || foundProject == null) {
            res.send("not found");
        } else {
            var found = foundProject.comments;
            found = found.toObject();
            for (var i = 0; i < found.length; i++) {
                found[i].author.password = undefined;
                found[i].author.projects = undefined;
            }
            res.send(found);
        }
    });
});

router.put('/:number/comment', (req, res) => {
    var number = req.params.number
    var commentId = req.body._id;
    var changedText = req.body.text;
    Comment.findOne({ _id: commentId }, (err, commentToEdit) => {
        if (err || commentToEdit == null) {
            res.send("not found");
        } else {
            commentToEdit.text = changedText;
            commentToEdit.save();
            res.send(commentToEdit);
        }

    });
});

router.delete('/:number/comment', (req, res) => {
    var projectNumber = req.params.number;
    var commentId = req.body._id;
    Comment.findOne({ _id: commentId }).remove().exec();
    Project.findOne({ number: projectNumber }, (err, foundProject) => {
        delete(foundProject.comments.indexOf(projectNumber));
        res.send("del");
    });
});


router.post('/:number/trip', (req,res) => { 
    Project.findOne({ _id: (req.params.number) }, (err, foundProject) => {
        if(!err){

            var trip = new Trip(req.body)
          //  trip = trip.save()
          console.log(trip)
            foundProject.trips.push(trip._id)            
            trip.save()
            foundProject.save()
            res.send( {trip :trip, success:true , project:foundProject._id});
            }else
            {
                res.send({success:false})
            }

            })
})


router.get('/:number/trip', (req, res) => {
    var number = req.params.number;

    Project.findOne({ _id: number })
   .populate({ path: 'trips', populate: { path: 'employees', model: 'Employee', select:'firstName lastName email phone position' } })
    .exec(function (err, foundProject) {
        if (err || foundProject == null) {
            res.send("not found");
        } else {
            var found = foundProject   
            found = found.toObject();
            res.send(found.trips);
        }
    });
});

        



module.exports = router;