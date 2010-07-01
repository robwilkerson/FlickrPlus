var new_layout    = document.querySelector( '#shortcuts' ) ? true : false;
var base_view_uri = document.querySelector( 'link[rel="canonical"]' ).getAttribute( 'href' );
var short_uri     = new_layout
	? document.querySelector('#shorturl').getAttribute( 'href' )
	: document.querySelector('link[rev="canonical"]').getAttribute( 'href' );
var sizes         = {
	'Original':  base_view_uri + 'sizes/o',
	'Large':     base_view_uri + 'sizes/l',
	'Medium':    base_view_uri + 'sizes/m',
	'Small':     base_view_uri + 'sizes/s',
	'Thumbnail': base_view_uri + 'sizes/t',
	'Square':    base_view_uri + 'sizes/sq'
}
var size_markup   = function() {
	var html = new Array();
	
	for( var size in sizes ) {
		html.push( '<a href="' + sizes[size] + '">' + size + '</a>' );
	}
	
	return html.join( ', ' );
}

var base_element = new_layout
	? document.querySelector( '#sidebar-contexts' )
	: document.querySelector( '.ContextsOther' );

var flickr_plus = function() {
	var container = document.createElement( 'div' );
	var header    = document.createElement( 'h4' );
	var list      = document.createElement( 'ul' );
	
	header.innerHTML = 'Flickr<strong>Plus</strong>';
	list.appendChild( list_item( 'Image URL: <a href="' + base_view_uri + '" rel="nofollow">' + ( new_layout ? base_view_uri : truncate( base_view_uri, 30, true ) ) + '</a>', true ) );
	list.appendChild( list_item( '<a href="http://fiveprime.org/blackmagic" rel="nofollow">View on Black</a>' ) );
	list.appendChild( list_item( 'View: ' + size_markup() ) );
	list.appendChild( list_item( 'Short URL: ' + ( short_uri != 'undefined' ? '<a href="' + short_uri + '" rel="nofollow">' + short_uri + '</a>' : 'Not Available' ), true ) );
	
	container.appendChild( header );
	container.appendChild( list );
	
	container.className = new_layout ? 'NeoFlickrPlus' : 'FlickrPlus';
	
	return container;
}

var list_item = function( html, truncate ) {
	truncate = truncate || false;
	
	var item = document.createElement( 'li' );
	
	if( new_layout ) {
		var list_dot = document.createElement( 'span' );
		list_dot.className = 'list-dot';
		
		item.appendChild( list_dot );
	}
	else {
		item.className = 'Stats';
	}
	
	item.innerHTML += html;
	
	console.log( item.innerHTML );
	
	item.className += truncate ? ' truncate' : '';
	
	return item;
}

base_element.appendChild( flickr_plus() );

/**
 * SUPPORTING FUNCTIONS
 */

function truncate( str, len, ellipsis ) {
	if( str.length <= len ) {
		return str;
	}
	
	return str.substring( 0, len ) + ( ellipsis ? '...' : '' );
}
