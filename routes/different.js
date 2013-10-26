var data = require('../lib/data');

module.exports = function(app) {
	app.get('/different', function(req, res) {
		data.getData(0, function(err, finalData){
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
};