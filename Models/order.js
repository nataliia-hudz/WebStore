var mongoose=require('../mongoose');
var schemaOrder=new mongoose.Schema({
	username:{
		type:String,
		require:true
	},
	mail:{
		type:String,
		require:true
	},
	phone:{
		type:String,
		require:true
	},
	adress:{
		type:String,
		require:true
	},
	total:{
		type:Number,
		require:true
	},
	products:Array
	})
exports.Order=mongoose.model("Order",schemaOrder);