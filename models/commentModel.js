var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

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

 
autoIncrement.initialize(mongoose.connection);
commentSchema.plugin(autoIncrement.plugin, 'Comment');

var commentModel = mongoose.model('Comment', commentSchema);
module.exports = commentModel;