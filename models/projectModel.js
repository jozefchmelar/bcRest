var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var employeeSchema = require('./employeeModel');

var ProjectSchema = new Schema({   
   name: { type: String, required: true },
   number: { type: String, required: true, unique: true },
   costumer: { type: String, required: true },
   employeeIds: [{type: Number , ref: 'Employee'}]
},
   {
      versionKey: false // disables __v  in schema
   });

var projectModel = mongoose.model('Project', ProjectSchema);
module.exports = projectModel;