
var request = require('request').defaults({jar: true});
var $       = require('jquery');
var _       = require('underscore');
var S       = require('string');

exports.get = function(req, res) {

	var url = 'http://www.google.com';

	if (req.param('ajax') == "true") {

		$.ajax({
	        type: 'GET',
	        url: url,
	        data: { particId: 7, otherParam: 9 },
	        success: function (html) {
	        	var dom = $(html);
	        	res.send(200, html);
	        },
	        error: function (err) {
	        	res.send(500, err);
	        }
	    });

	}
	else {

		request.get({
			url: url,
			qs: { particId: 7, otherParam: 9 }
		}, function (err, resp, body) {
			if (err || resp.statusCode != 200) {
				res.send(resp.statusCode, 'error! ' + err + body);
			}

			var dom = $(body);
			var firstImg = dom.find('img')[0];
			console.log(firstImg.outerHTML);
			res.send(200, firstImg.outerHTML.replace('src="', 'src="' + url));
		});

	}

}
