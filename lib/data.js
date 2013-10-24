var request = require('request');
var async = require('async');
var newestUrl = 'http://88.196.48.87:8888/solr/select?q=*%3A*&rows=4&wt=json&indent=true';
var marketingUrl = 'http://88.196.48.87:8888/solr/select?q=category:marketing&rows=3&wt=json&indent=true';
var cloudUrl = 'http://88.196.48.87:8888/solr/select?q=category:cloud&rows=3&wt=json&indent=true';
var technologyUrl = 'http://88.196.48.87:8888/solr/select?q=category:technology&rows=3&wt=json&indent=true';
var gadgetUrl = 'http://88.196.48.87:8888/solr/select?q=category:gadget&rows=3&wt=json&indent=true';

function find(url, cb) { 
    request(url, function (error, response, body) {        
        if (error) {            
            cb(error);            
        } else if (response.statusCode !== 200) {            
            cb(new Error('Status code not 200'));            
        } else {            
            cb(null, JSON.parse(body));
        }
    });
}
//Waterfall: Runs an array of functions in series, each passing their results to 
//the next in the array. One error calls general error
//waterfall(tasks, [callback])

//Parallel: Run an array/ object of functions in parallel, without waiting until the previous 
//function has completed. One error immediately calls the main error. 
//Once the tasks have completed, the results are passed to the final callback as an array/ object.
//parallel(tasks, [callback])

//Apply: Determines the best order for running functions based on their requirements. 
//Each function can optionally depend on other functions being completed first,
// and each function is run as soon as its requirements are satisfied.
//apply(function, arguments..)
function find(url, cb) {
 
    request(url, function (error, response, body) {        
        if (error) {            
            cb(error);            
        } else if (response.statusCode !== 200) {            
            cb(new Error('Status code not 200'));            
        } else {            
            cb(null, JSON.parse(body));
        }
    });
}

exports.getData = function(cb){async.waterfall([    
		async.apply(async.parallel, {        
			n: async.apply(find, newestUrl),
			m: async.apply(find, marketingUrl),                
			c: async.apply(find, cloudUrl),            
			t: async.apply(find, technologyUrl),                
			g: async.apply(find, gadgetUrl),
		}),
		
		function(results, cb) {
			var newest = [];
		//	console.log(results.n.response.docs);
			organize(results.n.response.docs)
		/*	newest
			var nDate = results.n.date;
			var nTitle = results.n.title; ;
			var nContent = givePosts(results.n); 
			var nComments = results.n.slash-comments;
			var nAuthor = results.n.author;
			var nReadMore = 
			var nCategories;
		*/	
		/*	var marketing = givePosts(results.m);        
			var cloud = givePosts(results.c);        
			var technology = givePosts(results.t);        
			var gadget = givePosts(results.g);
			
			cb(null, newest, marketing, cloud, technology, gadget);
		*/
			cb(null, newest);
		}		
	], function(err, newest) {    
		if (err) {        
			console.error('Error: ' + err);
		} else {
			cb(null, newest);
		}
	});
}
/*
var date;
var title;
var content;
var comments;
var author;
var categories;
*/
/*
function findAll(cb) {
	async.parallel({
		n: async.apply(find, newestUrl),
		m: async.apply(find, marketingUrl),                
		c: async.apply(find, cloudUrl),            
		t: async.apply(find, technologyUrl),                
		g: async.apply(find, gadgetUrl),		
	}, cb);
}
findAll(function(err, results){
	if (err) {
		console.error(new Date() + ' ' + err);
		// FIXME Saada üldisele vealehele.
		res.send(500);
	} else {
		var marketing = givePosts(results.m);
		console.log(marketing);
	}
}, cb);

*/
function organize(arrayOfPosts){
	var orgArray = [];
	for(var x = 0; x < arrayOfPosts.length; x++){
		var obj = {}
		if(typeof arrayOfPosts[x].date !== 'undefined'){
			obj.date = arrayOfPosts[x].date;
		} else {
			obj.date = 'Not specified';
		}
		if(typeof arrayOfPosts[x].title !== 'undefined'){
			obj.title = arrayOfPosts[x].title;
		} else {
			obj.title = 'Not specified';
		}
		if(typeof arrayOfPosts[x].description !== 'undefined'){
			obj.description = cleanDescription(arrayOfPosts[x].description);
		} else {
			obj.description = 'Not specified';
		}
		if(typeof arrayOfPosts[x]['slash-comments'] !== 'undefined'){
			obj['slash-comments'] = arrayOfPosts[x]['slash-comments'];
		} else {
			obj['slash-comments'] = '0';
		}
		if(typeof arrayOfPosts[x].author !== 'undefined'){
			obj.author = arrayOfPosts[x].author;
		} else {
			obj.author = 'Not specified';
		}
		if(typeof arrayOfPosts[x].category !== 'undefined'){
			obj.category = arrayOfPosts[x].category;
		} else {
			obj.category = 'Not specified';
		}
		if(typeof arrayOfPosts[x].link !== 'undefined'){
			obj.link = arrayOfPosts[x].link;
		} else {
			obj.link = 'Not specified';
		}
		orgArray.push(obj);
	}
	return orgArray;
}




function cleanDescription(descr){
	var clean = descr.replace(/<\/?[^>]+(>|$)/g, '');
	
	return clean;
}

function cleanPosts(obj){
	var posts = obj.response.docs;
	var clean = cleanDescription(posts);
	
	return clean;
}
function cleanDescriptionArray(postArray){
	var cleanedPosts = [];
	for (var x = 0; x < postArray.length; x++){
		var desc = postArray[x].description;
		//returns a new string
		var StrippedString = postArray[x].description.replace(/<\/?[^>]+(>|$)/g, '');
		postArray[x].description = StrippedString;
		cleanedPosts.push(postArray[x]);
	}
	return cleanedPosts;

}