process.env.NODE_ENV = 'development';

require('./schemas.js');
var keys = require('./keys');
var express = require('express');
var mers = require('mers');

var app = express();

// config
app.configure(function () {
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use('/api', mers({ 
    uri: keys.dbConnString,
    transformers:{
        _idToId:function () {
            return function (obj) {
                var o = obj.toObject();
                o.id = obj._id;
                delete o._id;
                return o;
            }
        }
    }
  }).rest());
});
app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
app.configure('production', function(){
    app.use(express.errorHandler());
});

// routing
app.get('/', function(req, res) {
	res.send('Hello world!');
});

// all responses are json
app.all("*", function(req, res, next) {
	res.type('application/json');
  req.query.transform = '_idToId';
	next();
});

// start server
var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
