const DEBUG = true;
  var doc   = document;

/** Only engage if this is a photo page */
if( doc.querySelector( 'meta[name="medium"][content="image"]' ) && window === window.top ) {
	safari.self.addEventListener( 'message', handle_message, true );
	
	var flickr_plus = {
		/** PROPERTIES */
		img_base_uri: doc.querySelector( 'link[rel="canonical"]' ).getAttribute( 'href' ).replace( /\/$/, '' )
		, img_sizes: [
				'Original'
				, 'Large'
				, 'Medium'
				, 'Small'
				, 'Thumbnail'
				, 'Square'
		]
		, fragment:     doc.createDocumentFragment()
		
		/** METHODS */
		, init: function() {
				var container = doc.createElement( 'div' );
				container.id  = 'safari-flickr-plus';
				
				container.appendChild( this.title() );
				clog( 'Appending links...' );
				container.appendChild( this.links() );
				
				this.fragment.appendChild( container );
			
				this.render();
		}
		, render: function() {
				// Append document fragment to the larger document 
				this.anchor().appendChild( this.fragment );
		}
		, title: function() {
				var title = doc.createElement( 'h4' );
				title.innerHTML = 'Flickr<strong>Plus</strong> Links';
				
				return title;
		}
		, links: function() {
				var fragment = doc.createDocumentFragment();
				var links    = doc.createElement( 'ul' );
				
				clog( '--> Writing the "image URL" link' );
				links.appendChild( this.item( this.image_url(), true ) );
				clog( '<-- Done' );
				clog( '--> Writing the "Short URL" link' );
				links.appendChild( this.item( this.short_url() ) );
				clog( '<-- Done' );
				clog( '--> Writing the "View all sizes" links' );
				links.appendChild( this.item( this.view_all_sizes() ) );
				clog( '<-- Done' );
				clog( '--> Writing the "View on black" link' );
				links.appendChild( this.item( this.view_on_black() ) );
				clog( '<-- Done' );
				
				fragment.appendChild( links );
				
				return fragment;
		}
		, item: function( content_frag, truncate ) {
				truncate = truncate || false;
				
				clog( '----> Building the list item for ' + content_frag.textContent );
				
				var fragment = doc.createDocumentFragment();
				var item     = doc.createElement( 'li' );
				
				if( this.is_new_layout() ) {
					var item_marker = doc.createElement( 'span' );
					
					addClass( item_marker, 'list-dot' );
					item.appendChild( item_marker );
				}
				else {
					addClass( item, 'Stats stats-featured' );
				}
				
				if( truncate ) {
					addClass( item, this.is_new_layout() ? 'truncate' : 'trunc' );
				}
				
				item.appendChild( content_frag );
				fragment.appendChild( item );
				
				clog( '<---- ' + fragment.textContent );
				
				return fragment;
		}
		/**
		 * Generates the label and link to the current image URL. Seems
		 * superfluous to me, but someone requested it.
		 */
		, image_url: function() {
				var fragment  = doc.createDocumentFragment();
				var label     = doc.createTextNode( 'Image URL: ' );
				var link      = doc.createElement( 'a' );
				var link_text = doc.createTextNode( this.img_base_uri );
				
				link.setAttribute( 'href', this.img_base_uri );
				link.setAttribute( 'rel', 'nofollow' );
				link.appendChild( link_text );
				
				fragment.appendChild( label );
				fragment.appendChild( link );
				
				return fragment;	
		}
		/**
		 * Generates the link to view the current photo on a black background.
		 */
		, view_on_black: function() {
				var fragment  = doc.createDocumentFragment();
				var link      = doc.createElement( 'a' );
				var link_text = doc.createTextNode( 'View on black' );
				
				link.setAttribute( 'href', 'http://fiveprime.org/blackmagic' );
				link.setAttribute( 'rel', 'nofollow' );
				link.appendChild( link_text );
				
				fragment.appendChild( link );
				
				return fragment;	
		}
		, view_all_sizes: function() {
				var fragment = doc.createDocumentFragment();
				var label    = doc.createTextNode( 'View: ' );
				var links    = this.img_sizes;
				
				fragment.appendChild( label );
				
				for( var i = 0, len = links.length; i < len; i++) {
					var size      = links[i];
					var abbrev    = size.toLowerCase().substr( 0, 2 );
					
					var link      = doc.createElement( 'a' );
					var link_text = doc.createTextNode( size );
					var delimiter = doc.createTextNode( i < len - 1 ? ', ' : '' );
					
					if( size.toLowerCase() != 'square' ) {
						link.setAttribute( 'href', this.img_base_uri + '/sizes/' + abbrev.charAt( 0 ) );
					}
					else {
						link.setAttribute( 'href', this.img_base_uri + '/sizes/' + abbrev );
					}
					
					link.appendChild( link_text );
					fragment.appendChild( link );
					fragment.appendChild( delimiter );
				}
				
				return fragment;
		}
		/** 
		 * Returns the current image's short URL.
		 */
		, short_url: function() {
				var short_url = 'http://flic.kr/p/' + this.short_photo_id();
				var fragment  = doc.createDocumentFragment();
				var label     = doc.createTextNode( 'Short URL: ' );
				var link      = doc.createElement( 'a' );
				var link_text = doc.createTextNode( short_url );
				
				link.setAttribute( 'href', short_url );
				link.setAttribute( 'rel', 'nofollow' );
				link.appendChild( link_text );
				
				fragment.appendChild( label );
				fragment.appendChild( link );
				
				return fragment;
		}
		/**
		 * Retrieves the anchor on which the FlickrPlus container will be appended.
		 */
		, anchor: function() {
				return this.is_new_layout() ? doc.querySelector( '#sidebar-contexts' ) : doc.querySelector( '.ContextsOther' )
		}
		/** 
		 * Determines whether the user is browsing Flickr's new 
		 * photo page layout.
		 */
		, is_new_layout: function() {
				return doc.querySelector( '#shortcuts' ) ? true : false;
		}
		/** 
		 * Extracts the photo's user identifier from the image URL.
		 */
		, user_id: function() {
				return this.img_base_uri.split( '/' ).slice( -2 )[0];
		}
		/** 
		 * Extracts the photo identifier from the image URL.
		 */
		, photo_id: function() {
				return this.img_base_uri.split( '/' ).slice( -2 )[1];
		}
		/** 
		 * Calculate the base58 value of the current photo identifier that
		 * is used in the photo's short URL.
		 */
		, short_photo_id: function() {
				var photo_id = parseInt( this.photo_id() );
				var enc      = '';
				var alpha    = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
				var div      = photo_id;
				var mod;

				while( photo_id >= 58 ) {
					div = photo_id / 58;
					mod = photo_id - ( 58 * Math.floor( div ) );
					enc = '' + alpha.substr( mod, 1 ) + enc;
					photo_id = Math.floor( div );
				}

				return div ? '' + alpha.substr( div, 1 ) + enc : enc;
		}
	}
	
	flickr_plus.init();
}

/**
 * SUPPORTING FUNCTIONS
 */

/**
 * Handle asynchronous messages sent from global.html
 */
function handle_message( msg_event ) {
	clog( 'Handling message: ' + msg_event.name );
	
	/** PLACEHOLDER. NO MESSAGING IS REQUIRED.
	switch( msg_event.name ) {
		case 'short_photo_id':
			clog( '--> ' + msg_event.message );
			flickr_plus.short_photo_id( msg_event.message )
			break;
	}
	*/ 
}

/** 
 * A few convenience functions for dealing with CSS
 */
function hasClass( ele, class_name ) {
	return ele.className.match( new RegExp( '(\\s|^)' + class_name + '(\\s|$)' ) );
}
function addClass( ele, class_name ) {
	if( !this.hasClass( ele, class_name ) ) {
		ele.className += ' ' + class_name;
	}
}
function removeClass( ele, class_name ) {
	if( hasClass( ele, class_name ) ) {
		var re = new RegExp( '(\\s|^)' + class_name + '(\\s|$)' );
		ele.className = ele.className.replace( re, ' ' );
	}
}

function clog( msg ) {
	if( DEBUG ) {
		/** 
		 * If the message is just an object, then adding the log prefix prevents
		 * us from being able to expand the object.
		 */ 
		console.log( typeof msg != 'object' ? 'FlickrPlus: ' + msg : msg );
	}
}
