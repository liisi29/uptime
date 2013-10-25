var request = require('request');
var async = require('async');
var newestUrl = 'http://88.196.48.87:8888/solr/select?q=sort=date%20desc=date&rows=4&wt=json&indent=true';
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
			var newest = organize(results.n.response.docs);
			var marketing = organize(results.m.response.docs);
			var cloud = organize(results.c.response.docs);
			var technology = organize(results.t.response.docs);
			var gadget = organize(results.g.response.docs);
			cb(null, newest, marketing, cloud, technology, gadget);
		}		
	], function(err, newest, marketing, cloud, technology, gadget) {    
		if (err) {        
			console.error('Error: ' + err);
		} else {
			cb(null, newest, marketing, cloud, technology, gadget);
		}
	});
}

function organize(arrayOfPosts){
	var orgArray = [];

	for(var x = 0; x < arrayOfPosts.length; x++){
		var obj = {}
		if(typeof arrayOfPosts[x].date !== 'undefined'){
			obj.date = dateify(arrayOfPosts[x].date);
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
			obj.author = uppercaseify(arrayOfPosts[x].author);
		} else {
			obj.author = 'Not specified';
		}
		if(typeof arrayOfPosts[x].category !== 'undefined'){
			obj.category = arrayOfPosts[x].category;
		} else {
			obj.category = ['Not specified'];
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

function uppercaseify(string){
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function dateify(date){
	var date = new Date(date);	
	var day = date.getDate();
	var longNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
	var shortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	// month [ longNames, shortNames ] ;
	var month = [longNames[date.getMonth()],shortNames[date.getMonth()]];
	var year = date.getFullYear();
	return [day, month, year];

}
function cleanDescription(descr){
	// cleans the content string from html trash and [] stuff
	var clean1 = descr.replace(/<\/?[^>]+(>|$)/g, '');
	var clean2 = clean1.replace(/\[.*?\]/g, '');
	
	// cuts the content of description leaving minNr-maxNr characters
	var minNr = 360;
	var maxNr = 460;
	var cutMax = clean2.slice(0, maxNr);
	var tab = cutMax.indexOf(' ', minNr)
	
	if( tab !== -1){
		var cut = clean2.slice(0, tab);
	} else {
		cut = clean2.slice(0, minNr);
	}
	return cut;
}