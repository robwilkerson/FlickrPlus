$(document).ready( function() {
	/**
	var img_uri = $('.photoImgDiv img').attr( 'src' );
	console.log( 'source: ' + img_uri );
	var img_base = img_uri.match( /[^.]/gi );
	console.log( img_base );
	*/
	
	$('.PeopleTagList').before( '<div class="FlickrPlus"></div>' );
	$('.FlickrPlus').html( '<h4>Flickr<strong>Plus</strong></h4>');
	$('.FlickrPlus').append( function() {
		return '<ul>' +
	         '<li class="Stats"><a href="http://fiveprime.org/blackmagic" rel="nofollow">View on Black</a></li>' +
					 // '<li class="Stats">Sizes: <a href=""></a>, <a href=""></a></li>' +
					 '<li class="Stats">Short URL: <a href="' + $('link[href^="http://flic.kr/p/"]').attr( 'href' ) + '" rel="nofollow">' + $('link[href^="http://flic.kr/p/"]').attr( 'href' ) + '</a></li>' +
					 '</ul>';
	});
});
