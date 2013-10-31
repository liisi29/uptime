var uti = require('./utilities');
var async = require('async');
var base64 = require('js-base64').Base64;

var dataUrl =  'http://88.196.48.87:8888/solr/select?q=*%3A*&rows=20&wt=json&indent=true';
var newestUrl =  'http://88.196.48.87:8888/solr/select?q=*%3A*&sort=date%20desc&rows=4&wt=json&indent=true';
var marketingUrl = 'http://88.196.48.87:8888/solr/select?q=category:marketing&sort=date%20desc&rows=3&wt=json&indent=true';
var cloudUrl = 'http://88.196.48.87:8888/solr/select?q=category:cloud&sort=date%20desc&rows=3&wt=json&indent=true';
var technologyUrl = 'http://88.196.48.87:8888/solr/select?q=category:technology&sort=date%20desc&rows=3&wt=json&indent=true';
var gadgetUrl = 'http://88.196.48.87:8888/solr/select?q=category:gadget&sort=date%20desc&rows=3&wt=json&indent=true';



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

exports.getData = function(dataType, cb){
	if (dataType === 1) {
		oneURlData(cb);
	} else {
		fiveURlData(cb);
	}
};

function oneURlData(cb){
	async.waterfall(
		[
			async.apply(async.parallel, {        
				d: async.apply(uti.find, dataUrl),
			}),
			
			function(results, cb) {
				// takes the posts from data
				var allPosts = results.d.response.docs;
				// specifies the lists to show
				var specialPosts = {	
					'newest' : [],
					'marketing' : [],
					'cloud': [],
					'technology' : [],
					'gadget' : [],
				};
							
				// sorts all posts by date: newest first
				sortByDate(allPosts);
				// specifies how many posts you want to show
				var nrOfNew = 4;
				// pushes the fresh posts to newest
				for (var fresh = 0; fresh < nrOfNew; fresh++) {
					specialPosts.newest.push(allPosts[fresh]);
				}
				// specifies important tags
				var tags = ['marketing','cloud','technology','gadget'];
				// makes the lists of posts with the tags
				for (var x = 0; x < allPosts.length; x++) {
						searchCat(allPosts[x], tags, specialPosts);
				}
				var newest = organize(specialPosts.newest);
				var marketing = organize(specialPosts.marketing);
				var cloud = organize(specialPosts.cloud);
				var technology = organize(specialPosts.technology);
				var gadget = organize(specialPosts.gadget);
				
				var finalData = {
					newest: newest,
					marketing: marketing,
					cloud: cloud,
					technology: technology,
					gadget: gadget				
				};
				
				// this is the data sent with export to different.js
				cb(null, finalData);
			}		
		], 
		function(err, finalData) {    
			if (err) {        
				console.error('Error: ' + err);
				cb(err);
			} else {
				cb(null, finalData);
			}
		}
	);
}

function fiveURlData(cb){
	async.waterfall(
		[    
			async.apply(async.parallel, {        
				n: async.apply(uti.find, newestUrl),
				m: async.apply(uti.find, marketingUrl),                
				c: async.apply(uti.find, cloudUrl),            
				t: async.apply(uti.find, technologyUrl),                
				g: async.apply(uti.find, gadgetUrl),
			}),
			
			function(results, cb) {
				// longD / shortD means the length of post content
				var newest = organize(results.n.response.docs, 'longD');
				var marketing = organize(results.m.response.docs, 'shortD');
				var cloud = organize(results.c.response.docs, 'shortD');
				var technology = organize(results.t.response.docs, 'shortD');
				var gadget = organize(results.g.response.docs, 'shortD');
				
				var finalData = {
					newest: newest,
					marketing: marketing,
					cloud: cloud,
					technology: technology,
					gadget: gadget				
				};
				
				cb(null, finalData);
			}		
		], 
		function(err, finalData) {    
			if (err) {        
				console.error('Error: ' + err);
				cb(err);
			} else {
				cb(null, finalData);
			}
		}
	);	
}



// finds posts with wanted categories from original data	
function searchCat(onePost, tags, specialPosts){	
	var cats = onePost.category;
	if  (typeof cats !== 'undefined') {
		for (var x = 0; x < cats.length; x++) {
			for (var y = 0; y < tags.length; y++) {
				var tag = tags[y];
				if (cats[x].toLowerCase() === tags[y].toLowerCase()) {
					specialPosts[tag].push(onePost);
				}
			}
		}
	}
}

// sorts all posts by date
function sortByDate(array){
	array.sort(function(a,b){
		var x = new Date(a.date);
		var xTime = x.getTime();
		var y = new Date(b.date);
		var yTime = y.getTime();
		return yTime - xTime;
	} );
}


function organize(arrayOfPosts, descrLength){
	var orgArray = [];

	for (var x = 0; x < arrayOfPosts.length; x++) {
		var obj = {};
		if (typeof arrayOfPosts[x].date !== 'undefined') {
			obj.date = dateify(arrayOfPosts[x].date);
		} else {
			obj.date = 'Not specified';
		}
		
		if (typeof arrayOfPosts[x].title !== 'undefined') {
			obj.title = cleanTitle(arrayOfPosts[x].title);
		} else {
			obj.title = 'Not specified';
		}
		
		if (typeof arrayOfPosts[x].description !== 'undefined') {
			obj.img = findIMG(arrayOfPosts[x].description);
		} else {
			obj.img = '../img/EarthInHand.jpg';
		}
		
		if (typeof arrayOfPosts[x].description !== 'undefined') {
			obj.description = cleanDescription(arrayOfPosts[x].description, descrLength);
		} else {
			obj.description = 'Not specified';
		}
		
		if (typeof arrayOfPosts[x]['slash-comments'] !== 'undefined') {
			obj['slash-comments'] = arrayOfPosts[x]['slash-comments'];
		} else {
			obj['slash-comments'] = '0';
		}
		
		if (typeof arrayOfPosts[x].author !== 'undefined') {
			obj.author = uppercaseify(arrayOfPosts[x].author);
		} else {
			obj.author = 'Not specified';
		}
		if (typeof arrayOfPosts[x].category !== 'undefined') {
			obj.category = findSpacesFromCatsArray(arrayOfPosts[x].category);
		} else {
			obj.category = ['None'];
		}
		
		if (typeof arrayOfPosts[x].link !== 'undefined') {
			//encodes the post link it to normal looks. something like: ZGFua29nYWk
			obj.link = base64.encodeURI(arrayOfPosts[x].link);
		} else {
			obj.link = 'Not specified';
		}
		orgArray.push(obj);
	}
	return orgArray;
}

// finds category tags with spaces and removes them from the list
// they break the tag url-s
function findSpacesFromCatsArray(array){
	var b = [];
	for (var x = 0; x < array.length; x++) {
		var g = array[x];
		var s = g.indexOf(' ');
		if(s === -1){
			b.push(g);
		}
	}
	if (b.length > 0) {
		return b;
	} else {
		return ['None'];
	}
}

// finds first .jpg from description and assumes it is relevant
function findIMG(desc){
	var indexJPG = desc.indexOf('.jpg');
	var imageUrl;
	if (indexJPG === -1) {
		// if no .jpg is found, finds the first .png
		imageUrl = findPNG(desc);
		return imageUrl;
	} else {
		var descUntilFirstJPG = desc.substring(0, indexJPG);
		var indexHTTP = descUntilFirstJPG.lastIndexOf('http');
		if (indexHTTP === -1) {
			imageUrl = '../img/EarthInHand.jpg';
			return imageUrl;
		}
		imageUrl = desc.substring(indexHTTP, indexJPG + 4);
		
		return imageUrl;
	}
}

// finds the first .png from description
function findPNG(desc){
	var indexPNG = desc.indexOf('.png');
	var imageUrl;
	if (indexPNG === -1) {
		imageUrl = '../img/EarthInHand.jpg';
		return imageUrl;
	} else {
		var descUntilFirstPNG = desc.substring(0, indexPNG);
		var indexHTTP = descUntilFirstPNG.lastIndexOf('http');
		
		if (indexHTTP === -1) {
			// if no .png is found returns default image
			imageUrl = '../img/EarthInHand.jpg';
			return imageUrl;
		
		} else {
			// if .png is found checks whether it is social network icon
			imageUrl = desc.substring(indexHTTP, indexPNG + 4);
			var social = findSocial(imageUrl);
			if (social === true) {
				imageUrl = '../img/EarthInHand.jpg';
			} else {
				return imageUrl;
			}
		}
		
		return imageUrl;
	}
}

// checks social tags from images and returns true if found, false if not found
function findSocial(imageUrl){

	var socialImages = ['twitter', 'facebook', 'linkedin', 'googleplus','social'];
	var social;
	var x = 0;
	
	while ( x < socialImages.length) {
		social = imageUrl.indexOf(socialImages[x]);
		if(social === -1) {
			x+=1;
		} else {
			return true;
		}
	}
	return false;
}

// capitalizes the the first letter of authors name
function uppercaseify(string){
	return string.charAt(0).toUpperCase() + string.slice(1);
}

// gives day, long name month, short name month and year in an array
function dateify(postDate){
	var date = new Date(postDate);	
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

// cleans and trims the title
function cleanTitle(title){
// cleans the title string from html trash and [] stuff
	var clean1 = title.replace(/<\/?[^>]+(>|$)/g, '');
	var clean2 = clean1.replace(/\[.*?\]/g, '');
	
	var minNr = 160;
	var maxNr = 180;
	var cutMax = clean2.slice(0, minNr);
	var tab = cutMax.indexOf(' ', maxNr);
	var cut;
	
	if (tab !== -1) {
		cut = clean2.slice(0, tab);
	} else {
		cut = clean2.slice(0, minNr);
	}
	
	return cut;
}

// cleans and trims the content 
function cleanDescription(descr, descrLength){
	// cleans the content string from html trash and [] stuff
	var clean1 = descr.replace(/<\/?[^>]+(>|$)/g, '');
	var clean2 = clean1.replace(/\[.*?\]/g, '');
	
	var minNr;
	var maxNr;
	// cuts the content of description leaving minNr-maxNr characters
	if (descrLength === 'longD') {
		minNr = 260;
		maxNr = 360;
	} else {
		minNr = 80;
		maxNr = 140;	
	}

	var cutMax = clean2.slice(0, maxNr);
	var tab = cutMax.indexOf(' ', minNr);
	var cut;
	
	if (tab !== -1) {
		cut = clean2.slice(0, tab);
	} else {
		cut = clean2.slice(0, minNr);
	}
	var read = cut.indexOf('Read more');
	if (read === -1) {
		return cut;
	} else {
		var result = cut.slice(0, read);
		return read;		
	}
	
	return read;
}