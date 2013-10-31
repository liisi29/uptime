var data = require('../lib/data');

module.exports = function(app) {
	// in http://something/different triggers this app.get
	app.get('/different', function(req, res) {
		data.getData(0, function(err, finalData){
			if (err) {
				console.error(new Date() + ' ' + err);
				// sends to general error page
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
};

