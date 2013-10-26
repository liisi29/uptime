var data = require('../lib/data');

module.exports = function(app) {
	app.get('/', function(req, res) {
		data.getData(1, function(err, newest, marketing, cloud, technology, gadget){
			if (err) {
				console.error(new Date() + ' ' + err);
				// FIXME Saada üldisele vealehele.
				res.send(500);
			} else {
				res.render('task.html', {
					newest: newest, 
					marketing: marketing, 
					cloud: cloud, 
					technology: technology, 
					gadget: gadget
				}); 
				
			}
		});
	});
}