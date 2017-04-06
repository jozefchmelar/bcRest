var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var employeeSchema = require('./employeeModel');
var autoIncrement = require('mongoose-auto-increment');

//var projectSchema = require('./projectModel');
var ObjectId = mongoose.Schema.Types.ObjectId;

var businessTripSchema = new Schema({  

    employees: [{type: Number , ref:'Employee',required: true}],
    car:  {type: String ,required: true } ,
    reason:{type:String ,required: true },
    date :{type: Date}
},
    {
        versionKey: false // disables __v  in schema
    });

 

var businessTripModel = mongoose.model('Trip', businessTripSchema);
module.exports = businessTripModel;