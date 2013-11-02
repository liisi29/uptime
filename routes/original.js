var data = require('../lib/data');
var readability = require('../lib/readability');
var base64 = require('js-base64').Base64;

module.exports = function(app) {
	app.get('/', function(req, res) {
		data.getData(1, function(err, finalData){
			if (err) {
				console.error(new Date() + ' ' + err);
				// FIXME Saada üldisele vealehele.
				res.send(500);
			} else {
				res.render('task.html', {
					newest: finalData.newest, 
					marketing: finalData.marketing, 
					cloud: finalData.cloud, 
					technology: finalData.technology, 
					gadget: finalData.gadget
				});
			}
		});
	});
	
	// displays single posts
	app.get('/post/:link', function(req, res) {
		var link = req.params.link;			
		link = base64.decode(link);
		readability.showPost(link, function(err, post) {
			if (err) {
				// Error
				console.error(err);
				res.send(500);
			} else {
				res.render('page.html', {
					author: post.author,
					title: post.title,
					content: post.content,
					date: post.date,
					link: post.link,
					allLinks: post.allLinks
				});
			}
		});
	});
};
	
