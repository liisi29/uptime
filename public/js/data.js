function imgError(image) {
    image.onerror = '';
	var images = ['sd.png', 'paper.png','news.jpg'];
	var random = Math.ceil(Math.random() * images.length);
	console.log(random);
    image.src = '/img/' + images[random];
    return true;
}