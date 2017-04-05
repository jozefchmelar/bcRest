var config = require('./config');
var app = require('express');
var router = app.Router();
var jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {
    var User = require(__parentDir + '/models/employeeModel');
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) {
            res.json({
                success: false,
                message: 'Error getting token',

            });
        }else if(user == null)
            {res.json({success: false, message:'Eror while finding user'})}
        else{
            user.comparePassword(req.body.password, function (err, isMatch) {
            if (isMatch == true) {
                var token = jwt.sign(user, SECRET, {
                    expiresIn: 60 * 60 * 24 // expires in 24 hours
                });
                
                 { password: 0 }
                 user=user.toObject()
                 delete user["password"]
                // return the information including token as JSON
                res.json({
                    success: true,
                    token: token,
                    user:user
                });
            }else{
                res.json({success:false,message:'wrong passsword'})
            }
        });
        }
        // test a matching password

    });

});

router.post('/register',(req,res)=>{
    /*
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true , unique:true},
    password:
    */
    var User = require(__parentDir + '/models/employeeModel');
    var user = new User()
    console.log(req.body)
    user.firstName=req.body.firstName
    user.lastName=req.body.lastName
    user.email=req.body.email
    user.password=req.body.password
    user.save(function (err,user,isSuccess){
        if(isSuccess)
            return  res.json({success:true,message:err})
        else
             res.json({succes:false,message:err})

    })
    res.json({success:true,message:'user saved'})



});

router.get('/logout', (req, res) => {
    req.decoded = '';
    res.send(req.headers);
});

securityMiddleware = function (req, res, next) {
    if (req.originalUrl === '/login' || req.originalUrl==='/register') {
        next();
    }
    else {
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, SECRET, function (err, decoded) {
                if (err) {
                   
                   return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });

        } else {

            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    }
};

module.exports = securityMiddleware;
module.exports = router;