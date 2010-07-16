const DEBUG = false

/** Only engage if this is a photo page */
if( document.querySelector( 'meta[name="medium"][content="image"]' ) ) {
	safari.self.addEventListener( 'message', handle_message, true );
	
	var new_layout     = document.querySelector( '#shortcuts' ) ? true : false;
	var base_view_uri  = document.querySelector( 'link[rel="canonical"]' ).getAttribute( 'href' ).replace( /\/$/, '' );
	var uri_components = base_view_uri.split( '/' ).slice( -2 );
	var user_id        = uri_components[0];
	var photo_id       = uri_components[1];
	var short_uri      = 'http://flic.kr/p/' + base58( photo_id );
	var img_sizes      = {
		'Original':  base_view_uri + '/sizes/o',
		'Large':     base_view_uri + '/sizes/l',
		'Medium':    base_view_uri + '/sizes/m',
		'Small':     base_view_uri + '/sizes/s',
		'Thumbnail': base_view_uri + '/sizes/t',
		'Square':    base_view_uri + '/sizes/sq'
	}
	var size_markup = function() {
		var html = new Array();
		
		for( var size in img_sizes ) {
			html.push( '<a href="' + img_sizes[size] + '">' + size + '</a>' );
		}
		
		return html.join( ', ' );
	}
	var exif = null;
	
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
		list.appendChild( list_item( 'Short URL: ' + ( short_uri ? '<a href="' + short_uri + '" rel="nofollow">' + short_uri + '</a>' : 'Not Available' ), true ) );
		list.appendChild( list_item( '<a id="exif-link" href="#" rel="nofollow">Show Exif info</a>' ) );
		
		container.appendChild( header );
		container.appendChild( list );
		
		container.className = 'FlickrPlus' + ( new_layout ? ' neo' : '' );
		
		
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
		item.className += truncate ? ' truncate' : '';
		
		return item;
	}
	
	base_element.appendChild( flickr_plus() );
	safari.self.tab.dispatchMessage( 'exif', { 'photo_id': photo_id } );
	document.querySelector( 'a#exif-link' ).addEventListener( 'click', toggle_exif_info, false );
}

/**
 * SUPPORTING FUNCTIONS
 */
function handle_message( msg_event ) {
	clog( 'Handling message: ' + msg_event.name );
	
	switch( msg_event.name ) {
		case 'exif':
			clog( '  --> exif' );
			clog( msg_event.message );
			exif = msg_event.message;
			break;
	}
}

/**
 * Applies the EXIF data to the bottom of the FlickrPlus element.
 */
function flickr_plus_exif() {
	clog( 'Displaying exif info' );
	
	if( document.querySelector( '#exif-wrapper' ) ) {
		return document.querySelector( '#exif-wrapper' );
	}
	
	var container = document.createElement( 'div' );
	var pad       = document.createElement( 'div' );
	var info      = document.createElement( 'table' );
	var title     = document.createElement( 'caption' );
	
	/** Build the Exif table */
	info.appendChild( title );
	for( var i = 0; i < exif.sequence.length; i++ ) {
		var prop = exif[exif.sequence[i]];
		
		row   = document.createElement( 'tr' );
		label = document.createElement( 'td' );
		value = document.createElement( 'td' );
		
		label.innerText = prop.label + ':';
		value.innerText = prop.value;
		
		row.appendChild( label );
		row.appendChild( value );
		info.appendChild( row );
	}
	
	title.innerText = 'Exif Information';
	
	pad.appendChild( info );
	container.appendChild( pad );
	
	info.setAttribute( 'cellspacing', 0 );
	info.setAttribute( 'cellpadding', 0 );
	container.setAttribute( 'id', 'exif-wrapper' );
	pad.className = 'pad';
	
	document.querySelector( '.FlickrPlus' ).appendChild( container );
	
	return container;
}

function toggle_exif_info( e ) {
	var exif = flickr_plus_exif();
	
	if( /^Show\s+/i.test( this.innerText ) ) {	
		exif.setAttribute( 'style', 'display: block' );
		this.innerText = 'Hide Exif info';
	}
	else {
		exif.setAttribute( 'style', 'display: none' );
		this.innerText = 'Show Exif info';
	}

	e.preventDefault();
}

/**
 * Generates the base58 variant of a value. Flickr's short URI ends with
 * the the base58 encoding of the image id.
 */
function base58( photo_id ) {
		if( typeof photo_id !== 'number' ) {
			photo_id = parseInt( photo_id );
		}
		var enc   = '';
		var alpha = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
		var div   = photo_id;
		var mod;
		
		while( photo_id >= 58 ) {
			div = photo_id / 58;
			mod = photo_id - ( 58 * Math.floor( div ) );
			enc = '' + alpha.substr( mod, 1 ) + enc;
			photo_id = Math.floor( div );
		}
		
		return div ? '' + alpha.substr( div, 1 ) + enc : enc;
}

function truncate( str, len, ellipsis ) {
	if( str.length <= len ) {
		return str;
	}
	
	return str.substring( 0, len ) + ( ellipsis ? '...' : '' );
}

function clog( msg ) {
	if( DEBUG ) {
		console.log( msg );
	}
}
