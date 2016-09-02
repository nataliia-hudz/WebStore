//підключаєм mongoose
var mongoose=require('../mongoose');
//схема логування
var schemaMp=new mongoose.Schema({
	Дисплей:{
		type:String,
	},
	Розмір{
		type:String,
	},
	Колір{
		type:String,
	},
	Память{
		type:String,
	}
	})
exports.Mp=mongoose.model("Mp",schemaMp);