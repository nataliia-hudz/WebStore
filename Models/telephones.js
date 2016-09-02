//підключаєм mongoose
var mongoose=require('../mongoose');
//схема логування
var schemaTelephone=new mongoose.Schema({
	Колір:{
		type:String,
	},
	Розмір{
		type:String,
	},
	Вага{
		type:String,
	},
	Дисплей{
		type:String,
	},
	Камера{
		type:String,
	}
	})
exports.Telephone=mongoose.model("Telephone",schemaTelephone);