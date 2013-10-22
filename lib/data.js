var dataUrl = 'http://88.196.48.87:8888/solr/select?q=*%3A*&rows=20&wt=json&indent=true';
var request = require('request');
	
function getData(request, url, cb){
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			cb(body)
		}
	});	
}

getData(request, dataUrl, data);

function data(body){
	var data = JSON.parse(body);
	var allArticles = data.response.docs;
	var tagArticles = {
		'newest' : [],
		'marketing' : [],
		'cloud': [],
		'technology' : [],
		'gadget' : [],
	}
	var tags = ['marketing','cloud','technology','gadget'];
	for (var x = 0; x < allArticles.length; x++){
		searchCat(allArticles[x], tags, tagArticles);
	}
	console.log(tagArticles);
}

function searchCat(oneArt, tags, tagArticles){	
	var cats = oneArt.category;
	for (var x = 0; x < cats.length; x++){
		for (var y = 0; y < tags.length; y++){
			var tag = tags[y];
			if(cats[x].toLowerCase() === tags[y].toLowerCase()){
				tagArticles[tag].push(oneArt);
			}
		}
	}
}



	


