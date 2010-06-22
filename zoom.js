var zoom_ico = safari.extension.baseURI + 'img/zoom_in.png';

/*
to capture and re-colorbox when sizes and types are changed on the left sidebar we need to bind a live 
event. i'd rather watch for div content changes but i'm not sure how to do that at this time.
*/

/** 
triggerColorBox = function() {
	$('#ImgContent a > img').parent().colorbox({
		href:function() {
			href = $(this).attr('href');
			parsedUrl = href.split('?')[1].split('&')[0].split('=')[1];
			return parsedUrl;
		},
		title:function() {
			href = $(this).attr('href');
			parsedUrl = href.split('?')[1].split('&')[0].split('=')[1];
			var name = parsedUrl.split('/').pop().split('.');
			name.pop();
			name = '<a href="'+parsedUrl+'">'+name.join()+'</a>'
			return name;
		},
		rel:'gImages',
		current:"{current}/{total}",
		maxWidth:'100%',
		maxHeight:'100%',
		minWidth:'200',
		minHeight:'200'
	})
} */

$(document).ready( function() {
	$('body').append( '<div id="zoom_box"><img src="' + zoom_ico + '" width="24" height="24" /></div>' ).hide();
	
	$('#img.zoom').live( 'click', function() {
		console.log( 'clicked to zoom' );
	});
	
	$('a img')
		.live( 'mouseover', function( event ) {
			var offset = $(this).offset();
			
			$('zoom_box').css({ 'z-index': 100, 'position': absolute, 'left': offset.left + 5, 'top': offset.top() + offset.height() - 29 });
			
			$(this).before( '<img src="' + '" class="zoom" width="24" height="24" />' );
		})
		.live( 'mouseout', function( event ) {
			$('img.zoom').remove();
		});
});
