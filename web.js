process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || 5000;
process.env.DATABASE_URL = process.env.DATABASE_URL || require('./keys').DATABASE_URL;

var blogs = require('./routes/blogs');
var express = require('express');
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

mongoose.connect(process.env.DATABASE_URL);

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
app.listen(process.env.PORT, function() {
  console.log("Listening on " + process.env.PORT);
});
