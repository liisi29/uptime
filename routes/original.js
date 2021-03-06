var data = require('../lib/data');
var readability = require('../lib/readability');

module.exports = function(app) {

	app.get('/', function(req, res) {
		data.getData(1, function(err, finalData){
			if (err) {
				console.error(new Date() + ' ' + err);
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
					next: post.next,
					prev: post.prev					
				});
			}
		});
	});
};
