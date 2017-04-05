var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var employeeSchema = require('./employeeModel');
var autoIncrement = require('mongoose-auto-increment');

var projectSchema = new Schema({  
	_id : { type: String, required: true, unique: true },    
    //number: { type: String, required: true, unique: true },    
    name: { type: String, required: true },
    costumer: { type: String, required: true },
    employees: [{type: Number , ref: 'Employee'}],
    comments: [{type: Schema.Types.ObjectId, ref:'Comment'}]
},
    {
        versionKey: false // disables __v  in schema
    });

//autoincrement ID
// autoIncrement.initialize(mongoose.connection);
// projectSchema.plugin(autoIncrement.plugin, 'Project');

var projectModel = mongoose.model('Project', projectSchema);
module.exports = projectModel;