
var _ = require('underscore');
var errors = require('../errors');
var mongoose = require('mongoose');
var db = mongoose.connection;

exports.registerSchema = function() {
	mongoose.model('Blog', new mongoose.Schema({
	  title:  String,
	  author: String,
	  body:   String,
	  comments: [{ body: String, date: Date }],
	  date: { type: Date, default: Date.now },
	  hidden: Boolean,
	  meta: {
	    votes: Number,
	    favs:  Number
	  }
	}));
}

exports.populateSchema = function() {
	var Blog = db.model('Blog');

	var blogs = [
		new Blog({
			title:'Impossiblilty', 
			author: 'Audrey Hepburn', 
			body: "Nothing is impossible, the word itself says 'I'm possible'!"
		}),
		new Blog({
			title:'Whats up doc', 
			author: 'Walt Disney', 
			body: "You may not realize it when it happens, but a kick in the teeth may be the best thing in the world for you"
		}),
		new Blog({
			title:'Beginners', 
			author: 'Unknown', 
			body: "Even the greatest was once a beginner. Don't be afraid to take that first step."
		}),
		new Blog({
			title:'Life', 
			author: 'Neale Donald Walsch', 
			body: "You are afraid to die, and you're afraid to live. What a way to exist."
		})
	];

	_.each(blogs, function(blog) {
		blog.save(function (err) {
		  if (err) {
		  	errors.dbErrorHandler(err, 'Failed to save blog.');
		  }
		  else {
		  	console.log('saved blog');
		  }
		});
	});

	console.log('populated schema');
}

exports.findAll = function(req, res) {
	var Blog = db.model('Blog');
	Blog.find(function(err, blogs) {
		if (err) {
			errors.dbErrorHandler(err, 'failed to find blogs');
			res.statusCode = 404;
			return res.send('Error 404: No blogs found');
		}

		res.json(blogs);
	});
}

exports.findById = function(req, res) {
	var Blog = db.model('Blog');
	Blog.findById(req.params.id, function (err, blog) {
		if (err) {
			errors.dbErrorHandler(err, 'failed to find blog by id');
			res.statusCode = 404;
			return res.send('Error 404: No blog found');
		}

		res.json(blog);
	});
}

exports.create = function(req, res) {
	var Blog = db.model('Blog');

	if(!req.body.hasOwnProperty('title') ||
	   !req.body.hasOwnProperty('author') || 
	   !req.body.hasOwnProperty('body')) {
		res.statusCode = 400;
		return res.send('Error 400: Post syntax incorrect.');
	}

	var newBlog = new Blog({
		title: req.body.title,
		author: req.body.author,
		body: req.body.body
	});

	newBlog.save(function (err, created) {
		if (err) {
			errors.dbErrorHandler(err, 'Failed to save blog.');		
			res.statusCode = 500;
			return res.send('Error 500: Failed to create blog.');
		}

		res.json(created);
	});
}

exports.delete = function(req, res) {
	var Blog = db.model('Blog');
	Blog.findByIdAndRemove(req.params.id, function(err, blog) {
		if (err) {
			errors.dbErrorHandler(err, 'failed to delete blog by id');
			res.statusCode = 404;
			return res.send('Error 404: No blog found');
		}
			
		res.json(true);
	});
}

exports.update = function(req, res) {
	var Blog = db.model('Blog');
	Blog.findByIdAndUpdate(req.params.id, function(err, blog) {
		if (err) {
			errors.dbErrorHandler(err, 'failed to update blog by id');
			res.statusCode = 404;
			return res.send('Error 404: No blog found');
		}
			
		res.json(true);
	});
}
