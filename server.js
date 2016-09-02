//підключаєм фреймворк express
var express=require('express');
var app=express();

//вмістиме робимо статичним контентом
app.use(express.static(__dirname));

//підключаємо router
//var router=require('./router');
//app.use('/router',router);

//підключаєм body-parser для post-запитів
var bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//підключаєм cookie-parser
var cookieParser=require('cookie-parser');
app.use(cookieParser());

//підключаємо multer для завантаження файлів на сервер
var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
  cb(null, './Img/')
  },
  filename: function (req, file, cb) {
  cb(null,  file.originalname );
  }
  });
var upload = multer({ storage: storage });

app.post('/uploadFile', upload.single('upl'), function(req,res){
	req.filename=req.originalname;
	console.log(req.filename);
	console.log(req.body); //form fields
	console.log(req.file); //form files
	res.send(req.file.path);
});

// var newStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//   cb(null, './Img2/')
//   },
//   filename: function (req, file, cb) {
//   cb(null,  file.originalname );
//   }
//   });
// var newUpload = multer({ storage: newStorage });

// app.post('/loadFiles', newUpload.single('upl'), function(req,res){
// 	req.filename=req.originalname;
// 	console.log(req.filename);
// 	console.log(req.body); //form fields
// 	console.log(req.file); //form files
// 	res.send(req.file.path);
// });


//підключаєм cookie-сесію
var session=require('cookie-session');
app.use(session({keys:['secret']}));

//підключаєм passport для логування
var passport=require('passport');
app.use(passport.initialize());
app.use(passport.session());

//підключаєм локальну стратегію для passport
var LocalStrategy=require('passport-local').Strategy;

//підключаєм модель логування
var Login=require('./Models/login').Login;
var Product=require('./Models/product').Product;
var Cartorder=require('./Models/cartorder').Cartorder;
var Order=require('./Models/order').Order;
var Categ=require('./Models/category').Categ;

//прив'язуєм локальну стратегію до passport
passport.use(new LocalStrategy(
  function(username,password,done){
	Login.find({username:username,password:password},function(err,data){
	if(data.length==1)
	return done(null,{username:username});
	else
	return done(null,false,{message:'Невірний логін або пароль!'});	

	}) 
}))

//збереження інформації в сесію
passport.serializeUser(function(user,done){
	//console.log(user.message);
	done(null,user.username);
})

//всі наступні звернення по id сесії
passport.deserializeUser(function(id,done){
	done(null,{username:id});
})

//авторизація з маршрутизатором
var auth=passport.authenticate(
	'local',{
		successRedirect:'/admin',
		failureRedirect:'/login'
	})

app.route('/login')
  .get(function(req, res) {
    res.sendFile(__dirname+'/Views/login.html');
  })
  .post(auth);

app.get('/admin',function(req,res){
	res.sendFile(__dirname+'/Views/admin.html');
	});

app.get('/productLoad',function(req,res){
	Product.find(function(err,data){
		// console.log(data);
	res.send(data);
	})
	})

app.post('/productCreate',function(req,res){
	//console.log(req.body);
	var product=new Product({
	name:req.body.name,
	descname:req.body.descname,
	category:req.body.category.category,
	count:req.body.count,
	price:req.body.price,
	path:req.body.path,
	details:req.body.details
	})
	product.save(function(err,product){
	res.send(product);
	})
	})

app.post("/productUpdate",function(req,res){
	// console.log(req.body);
	Product.update({_id:req.body._id},{$set:{
	name:req.body.name,
	descname:req.body.descname,
	category:req.body.category.category,
	count:req.body.count,
	price:req.body.price,
	path:req.body.path
	}
	},{multi:false},function(err,number){
	if(!err){
		console.log(number);
		res.send(number);
	}
	else console.log(err);
	})
	})

app.post('/productDelete',function(req,res){
	console.log(req.body);
	Product.remove({_id:req.body._id},function(err,data){
	console.log("deleted!");
	//console.log(data);
	res.send(data);
	})
})

app.get('/',function(req,res){
	res.sendFile(__dirname+'/Views/index.html');
});

app.post('/cartSendOrder',function(req,res){
	//console.log(req.body);
	var cartorder=new Cartorder({
		username:req.body.username,
		mail:req.body.mail,
		total:req.body.total,
		phone:req.body.phone,
		adress:req.body.adress,
		products:req.body.products

	})
	cartorder.save(function(req,order){
		res.send("order save!");
	})
})

app.get('/showOrders',function(req,res){
	// console.log(req.body);
	Cartorder.find(function(err,data){
		console.log(data);
	res.send(data);
	});
});

// оформити замовлення
app.post('/finalOrder', function(req, res){
	// console.log(req.body);
	var order=new Order({
		username:req.body.username,
		mail:req.body.mail,
		total:req.body.total,
		phone:req.body.phone,
		adress:req.body.adress,
		products:req.body.products
	});
	order.save(function(err,data){
		res.send(data);
	});

	Cartorder.remove({_id: req.body._id},
		function(err, data){
			console.log(data)
		});

	var product=req.body.products;

	for(i=0; i<product.length; i++){
		Product.update({_id: req.body.products[i]._id},
		{$inc:{count:-req.body.products[i].newcount}},
		{multi: false},
		function(err, data){
			console.log("update");
		});
	}

});

// відмінити ціле замовлення 
app.post('/deleteOrder', function(req, res){
	Cartorder.remove({_id: req.body._id},
		function(err, data){
			console.log(data)
		});
});

// відмінити певний продукт в замовленні
app.post('/cancelOrderItem', function(req, res){
	// console.log(req.body);
	Cartorder.update({_id:req.body.id},
		{$inc:{total:-req.body.newprice}},
		function(err,data){
			console.log(data)
	});
	Cartorder.update({_id:req.body.id},
		{$pull:{products:{_id:req.body._id}}},
		function(err,data){
			console.log(data)
		});
});

// додати категорію
app.post("/addCategory", function(req, res){
	// console.log(req.body);
	var category=new Categ({
		category:req.body.category
	});
	category.save(function(err,data){
		res.status(204).end();
	});
});

app.get('/getCategory',function(req,res){
	console.log(req.body);
	Categ.find(function(err,data){
	res.send(data);
	});
});

app.get('/distinct', function(req, res){
	Categ.distinct("category", function(err, data){
		res.send(data);
	});
});

app.get('/selectName', function(req, res){
	Product.distinct("name", function(err, data){
		res.send(data);
	});
});



//порт для прослуховування
app.listen(8080);
console.log('Server is running!');