// gets encoded links from server as string
var allLinks = allLinks; 
// converts the string into an array
var linksArr = allLinks.split(',');

var nextLink = document.getElementById('nextLink');
var prevLink = document.getElementById('prevLink');
setNext(nextLink);
setPrev(prevLink);

function setNext(nextLink) {
	// get current location
	var loc = getLoc();
	var nextLoc = loc[0];
	
	// get the :link of next post location
	var next = nextPrevLink(loc[1], linksArr, 'next');
	
	// set the :link for next post
	nextLoc.push(next);
	var nextHref = nextLoc.join('/');	
	nextLink.href = nextHref;
}

function setPrev(prevLink) {
	// get current location
	var loc = getLoc();
	var prevLoc = loc[0];
	
	// get the :link of previous post location	
	var prev = nextPrevLink(loc[1], linksArr, 'prev');
	
	// set the :link for previous post	
	prevLoc.push(prev);
	var prevHref = prevLoc.join('/');
	prevLink.href = prevHref;
}

function getLoc(){

	var path = window.location.pathname;
	var pathArray = window.location.pathname.split( '/' );	
	var link = pathArray.pop();
	var pathBegin = pathArray;
	
	var arr = [pathBegin, link];	
	return arr;
}

function nextPrevLink(link, arr, direction){
	for (var x = 0; x < arr.length; x++) {
	
		// if it's the last article in an array
		if (x === arr.length - 1 && link === arr[x]) {
			if (direction === 'next'){
				return arr[0];
			} else {
				return arr[x - 1];
			}
		
		// if it's the first article in an array
		} else if (x === 0 && link === arr[x]) {
			if (direction === 'next'){
				return arr[x + 1];
			} else {
				return arr[arr.length - 1];
			}
		
		// if it's any article but first or last
		} else if (link === arr[x]) {
			if (direction === 'next'){
				return arr[x + 1];
			} else {
				return arr[x - 1];
			}
		}
	}
	return arr[0];
}