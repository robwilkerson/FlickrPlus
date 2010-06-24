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
		var short_uri = $('link[rev="canonical"]').attr( 'href' ) != 'undefined'
			? $('link[rev="canonical"]').attr( 'href' )
			: null;
		
		return '<ul>' +
	         '<li class="Stats"><a href="http://fiveprime.org/blackmagic" rel="nofollow">View on Black</a></li>' +
					 '<li class="Stats">View: ' + size_markup() + '</li>' +
					 '<li class="Stats">Short URL: ' + ( short_uri ? '<a href="' + short_uri + '" rel="nofollow">' + short_uri + '</a>' : 'Not Available' ) + '</li>' +
					 '</ul>';
	});
	
	/** For the new Flickr photo page */
	$('#sidecar').prepend( '<div class="NeoFlickrPlus"></div>' );
	$('.NeoFlickrPlus').html( '<h4>Flickr<strong>Plus</strong></h4>' );
	$('.NeoFlickrPlus').append( function() {
		var short_uri = $('#shorturl').attr( 'href' ) != 'undefined'
			? $('#shorturl').attr( 'href' )
			: null;
			
		return '<ul class="sidecar-list">' +
	         '<li><span class="list-dot"></span><a href="http://fiveprime.org/blackmagic" rel="nofollow">View on Black</a></li>' +
					 '<li><span class="list-dot"></span>View: ' + size_markup() + '</li>' +
					 '<li><span class="list-dot"></span>Short URL: ' + ( short_uri ? '<a href="' + short_uri + '" rel="nofollow">' + short_uri + '</a>' : 'Not Available' ) + '</li>' +
					 '</ul>';
	});
});
