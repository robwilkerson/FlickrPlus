const DEBUG = false;
  var doc   = document;

/** Only engage if this is a photo page and the topmost window */
if( doc.querySelector( 'meta[name="medium"][content="image"]' ) && window === window.top ) {
	safari.self.addEventListener( 'message', handle_message, true );
	
	var img_base_uri   = doc.querySelector( 'link[rel="canonical"]' ).getAttribute( 'href' ).replace( /\/$/, '' );
	var user_id        = img_base_uri.split( '/' ).slice( -2 )[0];
	var photo_id       = img_base_uri.split( '/' ).slice( -2 )[1];
	
	var card = {
		photo:     doc.querySelector( '#photo' )
		, anchor:  doc.querySelector( '.photo-div' )
		, trigger: doc.createDocumentFragment()
		, width:   doc.querySelector( '.photo-div img' ).offsetWidth
		, height:  doc.querySelector( '.photo-div img' ).offsetHeight
		
		/**
		 * Initialize the card by updating the existing DOM
		 */
		, init: function() {
				clog( '--> Cardifying the existing DOM' );
				clog( '----> The card is ' + this.width + 'x' + this.height );
				
				this.trigger = this.trigger();
				
				clog( '----> Adding classes to the anchor and image' );
				addClass( this.photo, 'exif' );
				addClass( this.anchor, 'exif card' );
				addClass( this.anchor.firstElementChild, 'exif face front' );
				
				/**
				 * Insert the trigger inside of the drag proxy because it's
				 * already sized correctly and we don't have to do anything
				 * crazy to put the icon in the right spot.
				 */
				clog( '----> Inserting the trigger into the DOM' );
				doc.querySelector( '#photo-drag-proxy' ).appendChild( this.trigger );
				
				clog( '----> Applying the click event listener' );
				this.trigger.addEventListener( 'click', this.flip );
				
				clog( '<-- Complete (cardification)' );
		}
		/**
		 * Writes out the DOM element(s) that make up the back side of the card.
		 */
		, write_back: function( fragment ) {
				clog( '--> Writing the back side of the card' );
				
				var content = fragment.firstChild;
				
				clog( fragment.firstChild );
				
				clog( '----> Applying CSS classes' );
				addClass( content, 'exif face back' )
				
				clog( '----> Setting dimensions' );
				content.style.width  = this.width + 'px';
				content.style.height = this.height + 'px';
				
				clog( '----> Writing to the DOM' );
				content.title = 'Click anywhere in this panel to return to the image';
				this.anchor.appendChild( fragment );
				
				clog( '----> Adding an event listener to flip back' );
				content.addEventListener( 'click', this.flip );
				
				clog( '<-- Complete' );
		}
		/**
		 * Do what's necessary to flip the card.
		 */
		, flip: function( event ) {
				clog( '--> Flipping card' );
				
				/**
				 * Because it's an event handler, "this" refers to the event's
				 * source element (the trigger image). We can't reference
				 * this.anchor here.
				 */
				var anchor  = doc.querySelector( '.photo-div' );
				var trigger = doc.querySelector( '#exif-trigger' );
				var proxy   = doc.querySelector( '#photo-drag-proxy' );
				
				if( hasClass( anchor, 'flipped' ) ) {
					removeClass( anchor, 'flipped' );
					removeClass( trigger, 'flipped' );
					removeClass( proxy, 'flipped' );
				}
				else {
					addClass( proxy, 'flipped' );
					addClass( trigger, 'flipped' );
					addClass( anchor, 'flipped' );
				}
				
				event.stopPropagation();
				
				clog( '<-- Flipped' );
		}
		/**
		 * Builds the trigger DOM
		 */
		, trigger: function() {
				clog( '----> Building the trigger DOM fragment' );
				var trigger  = doc.createElement( 'img' );
				
				trigger.setAttribute( 'id', 'exif-trigger' );
				trigger.setAttribute( 'src', safari.extension.baseURI + 'img/exif-trigger.png' ); // http://l.yimg.com/g/images/icon_info_15x15.png
				trigger.setAttribute( 'title', 'View Exif info' );
				
				clog( '<---- Complete' );
				return trigger;
		}
	}

	var exif = {
		/** Key properties */
		DateTimeOriginal: { label: 'Taken on'    , value: null }
		, FileModifyDate: { label: 'Posted on'   , value: null }
		, Model:          { label: 'Camera'      , value: null }
		, ExposureTime:   { label: 'Exposure'    , value: null }
		, FNumber:        { label: 'Aperture'    , value: null }
		, FocalLength:    { label: 'Focal Length', value: null }
		, ISO:            { label: 'ISO Speed'   , value: null }
		, Flash:          { label: 'Flash'       , value: null }
		, FileSize:       { label: 'File Size'   , value: null }
		, FileType:       { label: 'File Type'   , value: null }
		, MIMEType:       { label: 'MIME Type'   , value: null }
		, ImageWidth:     { label: 'Image Width' , value: null }
		, ImageHeight:    { label: 'Image Height', value: null }
		
		/* Property names in display sequence */
		, sequence: [
			'DateTimeOriginal'
			, 'FileModifyDate'
			, 'Model'
			, 'ExposureTime'
			, 'FNumber'
			, 'FocalLength'
			, 'ISO'
			, 'Flash'
			, 'FileSize'
			, 'FileType'
			, 'MIMEType'
			, 'ImageWidth'
			, 'ImageHeight'
		]
		
		, init: function( data ) {
				clog( 'Initializing the exif object' );
				
				this.hydrate( data );
				card.write_back( this.ui() );
				
				
				clog( 'Complete' );
				card.init();
		}
		/**
		 * Hydrates the key object properties from the message data.
		 */
		, hydrate: function( data ) {
				clog( '--> Hydrating the exif object' );
				
				for( var prop in data ) {
					var value = data[prop];
					
					if( prop in this ) {
						this[prop].value = value;
					}
				}
				
				clog( '<-- Complete' );
		}
		/**
		 * Builds the DOM fragment that will display the exif info.
		 */
		, ui: function() {
				clog( '--> Building the exif DOM fragment' );
				
				var fragment  = doc.createDocumentFragment();
				var container = doc.createElement( 'div' );
				var info      = doc.createElement( 'table' );
				var title     = doc.createElement( 'caption' );
			
				/** Build the Exif table */
				title.appendChild( doc.createTextNode( 'Exif Information' ) );
				info.appendChild( title );
				for( var i = 0, len = this.sequence.length; i < len; i++ ) {
					var prop = this[this.sequence[i]];
			
					row   = doc.createElement( 'tr' );
					label = doc.createElement( 'td' );
					value = doc.createElement( 'td' );
			
					addClass( label, 'label' );
					addClass( value, 'value' );
					label.innerText = prop.label + ':';
					value.innerText = prop.value;
			
					row.appendChild( label );
					row.appendChild( value );
					info.appendChild( row );
				}
			
				container.appendChild( info );
			
				info.setAttribute( 'cellspacing', 0 );
				info.setAttribute( 'cellpadding', 0 );
				container.setAttribute( 'id', 'exif-wrapper' );
				fragment.appendChild( container );
				
				clog( '<-- Complete (build)' );
				
				return fragment;
		}
	}

	/** Retrieve the exif data */
	clog( 'Requesting exif data' );
	safari.self.tab.dispatchMessage( 'exif', photo_id );
	clog( '--> Request sent' );
}

/** 
 * SUPPORT FUNCTIONS
 */

function handle_message( msg_event ) {
	clog( '--> Message received' );
	
	switch( msg_event.name ) {
		case 'exif':
			clog( '----> ' + msg_event.name );
			if( msg_event.message ) {
				/** Only continue if exif data is returned */
				exif.init( msg_event.message );
			}
			else {
				clog( '------> No data returned. Exif data unavailable.' );
			}
			clog( '<---- Message handled.' );
			
			break;
	}
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
