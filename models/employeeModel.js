var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var autoIncrement = require('mongoose-auto-increment');
var SALT_WORK_FACTOR = 10;
var projectSchema = require('./projectModel');
var employeeSchema = new Schema({
   _id: Number,
   firstName: { type: String, required: true },
   lastName: { type: String, required: true },
   email: { type: String, required: true , unique:true},
   password: { type: String, required: true },
   projectIds: [{type: Number, ref:'Project'}]
},
   {
      versionKey: false // disables __v  in schema
   });

//autoincrement ID
autoIncrement.initialize(mongoose.connection);
employeeSchema.plugin(autoIncrement.plugin, 'Employee');

//password hasing
employeeSchema.pre('save', function (next) {
   var user = this;

    // only hash the password if it has been modified (or is new)
   if (!user.isModified('password')) return next();

    // generate a salt
   bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
      if (err) return next(err);

        // hash the password along with our new salt
      bcrypt.hash(user.password, salt, function (err, hash) {
         if (err) return next(err);

            // override the cleartext password with the hashed one
         user.password = hash;
         next();
      });
   });
});

//password comparision
employeeSchema.methods.comparePassword = function (candidatePassword, cb) {
   bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
   });
};

var employeeModel = mongoose.model('Employee', employeeSchema);
module.exports = employeeModel;
