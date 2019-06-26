/*--------------------------------------------------------------
## Typer plugin
--------------------------------------------------------------*/
//create the typing-effect for that element. Add the class 'type-me' to the element and add a new attribute 'data-text="Text here [verwijder]delete this[verwijder]and type this after that"'

var elementsToHide = document.getElementsByClassName('hide');
for( var i = 0, j = elementsToHide.length; i < j; i++) {
	elementsToHide[i].style.visibility = 'hidden';
}

$(document).ready(function() {
	$('.type-me').each(function() {
		$(this).type();
	});
});

$.fn.type = function() {
	var $typer = this,
		$typerSpan = this.find('.typed-text'),
		str = $typerSpan.html(),
	    str = ( typeof Hyphenator != 'undefined') ? Hyphenator.hyphenate( str, 'nl') : str,
	    typeSpeed = $typer.attr('data-type-speed') || 1,
	    hasDeletePart = str.match(/\[del\]/),
	    hasPunctuationChar = str.slice(-1).match(/[.,\/#!$%\^&\*;:{}=\-_`~()]/);

	if( hasPunctuationChar ) {
		var punctuationChar = str.slice(-1);
		str = str.slice(0, str.length - 1);
	}

	$typerSpan.html('').css('display','inline');

	var strParts = hasDeletePart ? str.split(/\[del\]/) : [str, "", ""],
	    isTag,
	    text;

	// declare it all beforehand to reduce CPU-load
	var strBeforeDeleteLen = strParts[0].length,
	    strToDeleteLen = strParts[1].length,
	    strAfterDeleteLen = strParts[2].length;
	var i = 0,
	    speed,
	    addSpeed = 120 * typeSpeed, // speed to add
	    deleteSpeed = 80 * typeSpeed; 

	$(window).scroll(typeNow);

	function typeNow() {
		if( isInViewport($typer) ){
			$typer.addClass('currentlyTyping');
			type();
			$(window).off("scroll", typeNow);
		}
	}
	typeNow();

	function type() {

		// if we can just add characters because the string-to-be-deleted is not yet fully typed
		if( i < strBeforeDeleteLen + strToDeleteLen || !hasDeletePart ) {

			text = (strParts[0] + strParts[1]).slice(0, ++i);
			speed = addSpeed;


			// Simulate a thinking-process if it's about to commence its destructive work.
			if( i == strBeforeDeleteLen + strToDeleteLen ) {
				speed = 500 * typeSpeed;
			}

		} else {
			// if things need to be deleted because the string-to-be-deleted is fully typed but not yet fully removed
			if( i < strBeforeDeleteLen + (strToDeleteLen * 2) ) {
				
				// remove the last character until strToDelete is fully deleted
				text = (strParts[0] + strParts[1]).slice(0, -(++i - (strBeforeDeleteLen + strToDeleteLen))  );
				speed = deleteSpeed;


			} 
			// no? Ok, just add the new, better string then
			else {
				// subtract the deleted strToDelete
				text = (strParts[0] + strParts[2]).slice(0, ++i - strToDeleteLen * 2 );
				speed = addSpeed;
			}

		}

	    $typerSpan.html(text);

	    var char = text.slice(-1);
	    if( char === '<' ) isTag = true;
	    if( char === '>' ) isTag = false;

	    if (isTag) return type();

	    if (text === strParts[0] + strParts[2]) {
	    	var removeClassTime = 1000; //simply a second for the cursor to rest before he's being sent into the abyss
	    	if( hasPunctuationChar ) {
		    	setTimeout( function() {
		    		$typerSpan.html( $typerSpan.html() + '<span class="punctuationChar">' + punctuationChar + '</span>' );
		    	}, 1000 * typeSpeed );
		    	removeClassTime += 1000 * typeSpeed;
		    }
		    setTimeout(function() {
		    	$typer.removeClass('currentlyTyping');
		    }, removeClassTime);
	    	return false;
	    }
	    else {
	    	// get random number between the set speed and half of that to create a more natural way of typing
	    	setTimeout(  type, ~~(Math.random() * speed) + (speed - (speed / 2))  );
	    }
	}

  // make this a fully functional jQuery function by returning the elementobject
	return this; 
};




//see if the element is in the viewport, use either jQuery object or don't. I don't care.
function isInViewport( el ) {
	if(el instanceof jQuery)
		el = el[0]

	var elOffset = el.getBoundingClientRect().top;

	return elOffset < $(window).height() && elOffset + el.offsetHeight > 0;

}
