var app = require('express');
var router = app.Router();
var jwt = require('jsonwebtoken');
var config = require('./config');

router.post('/login', (req, res) => {
    var User = require(__parentDir + '/models/employeeModel');
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) {
            res.json({
                success: false,
                message: 'Error getting token',

            });
        }
        // test a matching password
        user.comparePassword(req.body.password, function (err, isMatch) {
            if (isMatch == true) {
                var token = jwt.sign(user, config.secret, {
                    expiresIn: 60 * 60 * 24 // expires in 24 hours
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }
        });
    });

});

router.get('/logout', (req, res) => {
    req.decoded = '';
    res.send(req.headers);
});

securityMiddleware = function (req, res, next) {
    if (req.originalUrl === '/login') {
        next();
    }
    else {
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, config.secret, function (err, decoded) {
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