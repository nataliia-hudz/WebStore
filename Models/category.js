var mongoose=require('../mongoose');

var schemaCateg=new mongoose.Schema({
	category: {
		type: String,
		unique: true
	}
});

exports.Categ=mongoose.model('Categ', schemaCateg);