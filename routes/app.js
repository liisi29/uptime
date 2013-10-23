var data = require('../lib/data');

function(app) {
	app.get('/', function(req, res) {
		//moodul kus on eraldi funktsioon andmete andmebaasist võtmiseks
		// funktsiooni v2lja kutsumine (defineeritakse public.js-s)
		data.getData(data.data, function(cd){
			res.render('task.html', { 
				newest: cd.newest, 
				marketing: cd.marketing, 
				cloud:cd.cloud, 
				technology:cd.technology, 
				gadget: cd.gadget });

		});
		
	});
}
	
	// Saadab kasutajale põhivaate.
/*	
	app.get('/app', function(req, res) {
		if (req.session.userId !== undefined) {
			User.findOne({ _id: req.session.userId }, function(err, user) {
				if (err) {
					console.error(new Date() + ' ' + err);
					// FIXME Saada üldisele vealehele.
					res.send(500);
				} else if (user) {
					// Kuva app.html ja anna väärtused ette.
					res.render('app.html', { id: user.id, paid: !!user.paid, startDate: user.startDate });
				} else {
					// FIXME Saada üldisele vealehele.
					res.send(500);
				}
			});
		} else {
			res.redirect('/login');
		}
	});
	
	// Esileht.
	
	app.get('/', function(req, res) {
		res.render('index.html');
	});
};
*/