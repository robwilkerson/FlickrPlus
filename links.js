$(document).ready( function() {
	var base_view_uri = $('link[rel="canonical"]').attr( 'href' );
	var sizes = {
		'Original':  base_view_uri + 'sizes/o',
		'Large':     base_view_uri + 'sizes/l',
		'Medium':    base_view_uri + 'sizes/m',
		'Small':     base_view_uri + 'sizes/s',
		'Thumbnail': base_view_uri + 'sizes/t',
		'Square':    base_view_uri + 'sizes/sq'
	}
	var size_markup = function() {
		var html = new Array();
		
		for( var size in sizes ) {
			html.push( '<a href="' + sizes[size] + '">' + size + '</a>' );
		}
		
		return html.join( ', ' );
	}
	
	$('#faves_p').parent().after( '<div class="FlickrPlus"></div>' );
	$('.FlickrPlus').html( '<h4>Flickr<strong>Plus</strong></h4>');
	$('.FlickrPlus').append( function() {
		return '<ul>' +
	         '<li class="Stats"><a href="http://fiveprime.org/blackmagic" rel="nofollow">View on Black</a></li>' +
					 '<li class="Stats">View: ' + size_markup() + '</li>' +
					 '<li class="Stats">Short URL: <a href="' + $('link[rev="canonical"]').attr( 'href' ) + '" rel="nofollow">' + $('link[href^="http://flic.kr/p/"]').attr( 'href' ) + '</a></li>' +
					 '</ul>';
	});
});
