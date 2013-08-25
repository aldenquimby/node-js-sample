var blogs = require('./routes/blogs');
var keys = require('./keys');

var express = require('express');
var async = require('async');
var mongoose = require('mongoose');
var db = mongoose.connection;

// connect to mongo
db.on('error', function(err) {
  console.error(err);
});
db.once('open', function callback() {
  console.log('opened mongo connection');
  blogs.registerSchema();
});
mongoose.connect(keys.dbConnString);

var app = express();

// config
app.configure(function () {
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});
app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
app.configure('production', function(){
    app.use(express.errorHandler());
});

// all responses are json
app.all("*", function(req, res, next) {
	res.type('application/json');
	next();
});

// routing
app.get('/', function(req, res) {
	res.send('{"message":"Hello world"}!');
});

// blogs
app.get('/blogs', blogs.findAll);
app.post('/blogs', blogs.create);
app.get('/blogs/:id', blogs.findById);
app.put('/blogs/:id', blogs.update);
app.del('/blogs/:id', blogs.remove);

// start server
var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
