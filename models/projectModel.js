var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var employeeSchema = require('./employeeModel');
var tripSchema = require('./tripModel');
var autoIncrement = require('mongoose-auto-increment');
var ObjectId = mongoose.Schema.Types.ObjectId;

var projectSchema = new Schema({  
	_id : 		{ type: String, required: true			},    
    name: 		{ type: String, required: true 							},
    costumer: 	{ type: String, required: true 							},
    employees: 	[ {type: Number, 		ref: 	'Employee'	,default:[]	}],
    comments: 	[ {type:ObjectId, 		ref: 	'Comment'	,default:[]	}],
    trips : 	[ {type:ObjectId, 		ref: 	'Trip'		,default:[]	}]
    //number: { type: String, required: true, unique: true },    

},
    {
        versionKey: false // disables __v  in schema
    });

//autoincrement ID
// autoIncrement.initialize(mongoose.connection);
// projectSchema.plugin(autoIncrement.plugin, 'Project');

var projectModel = mongoose.model('Project', projectSchema);
module.exports = projectModel;