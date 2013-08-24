var quotes = require('./routes/quotes');
var blogs = require('./routes/blogs');
var errors = require('./errors');
var keys = require('./keys');

var express = require('express');
var _ = require('underscore');
var async = require('async');
var mongoose = require('mongoose');
var db = mongoose.connection;

// connect to mongo
db.on('error', function(err) {
	errors.dbErrorHandler(err, 'failed to connect to mongo.');
});
db.once('open', function callback() {
  console.log('opened mongo connection');
  blogs.registerSchema();
});
mongoose.connect(keys.dbConnString);

var app = express();

// express helpers
app.use(express.logger());
app.use(express.bodyParser());
app.use(express.methodOverride());

// routing
app.get('/', function(req, res) {
	res.send('Hello world!');
});

// quotes
app.get('/quotes', quotes.findAll);
app.post('/quotes', quotes.create);
app.get('/quotes/:id', quotes.findById);
app.delete('/quotes/:id', quotes.delete);

// blogs
app.get('/blogs', blogs.findAll);
app.post('/blogs', blogs.create);
app.get('/blogs/:id', blogs.findById);
app.put('/blogs/:id', blogs.update);
app.delete('/blogs/:id', blogs.delete);

// error handlers
app.use(errors.logErrors);
app.use(errors.clientErrorHandler);
app.use(errors.errorHandler);

// start server
var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
