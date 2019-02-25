var express = require("express");
var ejs = require("ejs");
var bodyParser = require("body-parser");
var path = require("path");
var redis = require("redis");
var app = express();
var client = redis.createClient();
client.on("connect",function(){
	console.log(" Redis is connected...")
})
app.set("views" , path.join(__dirname, "views"));
app.set("view engine" , "ejs");
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({extended : false}));
app.get("/", function(req,res){
	var title = "Redis Todos";
	client.lrange("todos",0,-1,function(err,todo){
		if(err){
			console.log(err);
		}
			res.render("index", {title : title ,todos : todo});
	})
});
app.post("/todo/add",function(req,res,next){
	var todo = req.body.todo;
	client.rpush("todos", todo,function(err,todo){
		if(err){
			console.log(err);
		}
		res.redirect("/");
	})
})
app.post("/todo/delete",function(req,res,next){
	var delTodo = req.body.delete;
	client.lrange("todos", 0,-1,function(err,todos){
		if(err){
			console.log(err);
		}
		for(var i=0; i<todos.length; i++){
			if(delTodo && delTodo.indexOf(todos[i])>-1){
				client.lrem("todos",0,todos[i]);
			}
		}
		res.redirect("/");
	})
})














app.listen(3000, function(){
	console.log("Server started on port 3000.....");
});
module.exports = app;