console.log('Node started')
// =======================
// packages
// ======================= 
const PORT      = 3000;
var express     = require('express');
var app         = express();
var jwt         = require('jsonwebtoken');
var mongoose    = require('mongoose'); 
var bodyParser  = require('body-parser');
var morgan      = require('morgan'); //logging

var config      = require('./config');
var employees   = require('./routes/employeeRoutes');
var db          = mongoose.connection;

// =======================
// configuration
// ======================= 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('superSecret', config.secret); // secret variable

// mongoose.Promise = global.Promise;
mongoose.connect(config.database);
console.log('waiting for db');

app.use(morgan('dev')); //logging style 

// =======================
// routes 
// =======================
app.post('/login', (req, res) => {
  var User = require(__parentDir + '/models/employeeModel');
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) throw err;
    // test a matching password
    user.comparePassword(req.body.password, function (err, isMatch) {
    if(isMatch==true){
       var token = jwt.sign(user, app.get('superSecret'), {
          expiresIn: 60 // expires in 24 hours
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
})
// middleware for authentication
app.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
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
});
app.use('/employee', employees);

// =======================
// start the server 
// =======================
db.once('open', function () {
  console.log('db connected');
  app.listen(PORT, function () {
    console.log('Listening on ' + PORT +
      '\nCtrl+c to quit');
  });
});