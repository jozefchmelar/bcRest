console.log('Node started');
// =======================
// packages
// ======================= 
var PORT = Number(process.env.PORT || 5000);
var express = require('express');
var app = express();
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan'); //logging
var config = require('./config');
var security = require('./security');
var db = mongoose.connection;
 // =======================
// configuration
// ======================= 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(securityMiddleware);
app.use(morgan('dev')); //logging style 

mongoose.connect('mongodb://test:test@ds049436.mlab.com:49436/jojko'  /*config.database*/);
console.log('Waiting for database \n url : ' + config.database);

// =======================
// routes 
// =======================
app.use(security);
app.use('/employee', require('./routes/employeeRoutes'));
app.use('/project', require('./routes/projectRoutes'));

// =======================
// start the server 
// =======================
db.once('open', function () {
    console.log('Database connected');
    app.listen(PORT, function () {
        console.log('Listening on ' + PORT +
            '\nCtrl+c to quit');
    });
});