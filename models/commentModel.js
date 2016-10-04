var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var project = require('./projectModel');
var employee = require('./employeeModel');


var commentSchema = new Schema({
    author: {type: Schema.Types.Number , ref:'Employee', required: true},
    text: { type: String, required: true },    
    created: {type: Date,  default: Date.now}
},
    {
        versionKey: false // disables __v  in schema
    });

 
 

var commentModel = mongoose.model('Comment', commentSchema);
module.exports = commentModel;