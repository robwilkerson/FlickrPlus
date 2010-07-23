const DEBUG = true;

/** Only engage if this is a photo page */
if( document.querySelector( 'meta[name="medium"][content="image"]' ) ) {
	safari.self.addEventListener( 'message', handle_message, true );
	
	var new_layout     = document.querySelector( '#shortcuts' ) ? true : false;
	var base_view_uri  = document.querySelector( 'link[rel="canonical"]' ).getAttribute( 'href' ).replace( /\/$/, '' );
	var uri_components = base_view_uri.split( '/' ).slice( -2 );
	var user_id        = uri_components[0];
	var photo_id       = uri_components[1];
	
	var exif = {
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
		, control:        document.querySelector( '#exif-control' )
		, fragment:       null

		, fetch: function() {
			clog( 'Fetching exif information for photo id ' + photo_id );
			safari.self.tab.dispatchMessage( 'exif', { 'photo_id': photo_id, exif: this } );
		}
		
		, populate: function( data ) {
			return null;
		}
		
		, display_control: function() {
			clog( 'Display Exif control' );
		}
	}	
}

function handle_message( msg_event ) {
	clog( 'Handling message: ' + msg_event.name );
	
	switch( msg_event.name ) {
		case 'exif':
			clog( '--> ' + msg_event.message );
			clog( msg_event.message );
			
			exif.populate( msg_event.message );
			break;
	}
}

/** 
 * SUPPORT FUNCTIONS
 */

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