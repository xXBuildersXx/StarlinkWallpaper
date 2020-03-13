var introAnimation,
	constellationAnimation;

function initSpaceX(){
	checkDeviceSettings();
	initStarlinkButtons();
	initStarlink();

	if (deviceSettings.isMobile) {
		initStarlinkMobile();
	} else {
		initStarlinkDesktop();
	}

	$(window).on("resize", siteResize);
	$(window).triggerHandler("resize");
	$(window).on('beforeunload', function(){
		$(window).scrollTop(0);
	});
}


var controller;

function initStarlink() {

	controller = new ScrollMagic.Controller({
		globalSceneOptions: { triggerHook: "onLeave" }
	});
	/*
	var conesSectionTimeline = new TimelineMax({ force3D: true });
		conesSectionTimeline.fromTo( "#cones-text1", 0.5, { autoAlpha: 1 }, { autoAlpha: 0, ease: Linear.easeNone }, 0);
		conesSectionTimeline.fromTo( "#cones-text2", 0.5, { autoAlpha: 0 }, { autoAlpha: 1, ease: Linear.easeNone }, 0);
		conesSectionTimeline.fromTo( "#cones video", 1, { webkitFilter: "blur(0px)" }, { webkitFilter: "blur(5px)" }, 0);
	var conesSection = new ScrollMagic.Scene({
			triggerElement: "#cones",
			offset: 100
		})
		.setTween(conesSectionTimeline)
		//.on("enter leave")
		.addTo(controller);
	 */
	/*
	var debrisSectionTimeline = new TimelineMax({ force3D: true });
		debrisSectionTimeline.fromTo( "#debris-text1", 0.5, { autoAlpha: 1 }, { autoAlpha: 0, ease: Linear.easeNone }, 0);
		debrisSectionTimeline.fromTo( "#debris-text2", 0.5, { autoAlpha: 0 }, { autoAlpha: 1, ease: Linear.easeNone }, 0);
		debrisSectionTimeline.fromTo( "#debris .interactive-background", 1, { autoAlpha: 0 }, { autoAlpha: 1, ease: Linear.easeNone }, 0);
	var debrisSection = new ScrollMagic.Scene({
			triggerElement: "#debris",
			//offset: -150
			//triggerElement: '#debris',
			//triggerHook: 0,
			//duration: "100%"
		})
		//.setPin("#debris")
		.setTween(debrisSectionTimeline)
		.on("enter leave")
		.addTo(controller);
	*/
	// GENERIC ANIMATION STUFF
	$(window).scroll(function () {
		//ANIMATE UP & OWN
		$(".animate").each( function() {
			var elementOffset = $(this).viewportOffset().top;
			var elementNegativeOffset = -($(this).height() + 20);
			if ( elementOffset < elementNegativeOffset ) {
				TweenMax.set($(this), { y: -100, autoAlpha: 0 });
			} else if ( elementOffset > $(window).height() ){
				TweenMax.set($(this), { y: 100, autoAlpha: 0 });
			} else {
				TweenMax.to( $(this), 2, { y: 0, autoAlpha: 1, ease: Expo.easeOut });
			}
		});
		//ANIMATE LEFT & RIGHT
		$(".animate-left").each( function() {
			var elementOffset = $(this).viewportOffset().top;
			var elementNegativeOffset = -($(this).height() + 20);
			if ( elementOffset < elementNegativeOffset ) {
				TweenMax.set($(this), { x: 100, y: -100, autoAlpha: 0 });
			} else if ( elementOffset > $(window).height() ){
				TweenMax.set($(this), { x: 100, y: 100, autoAlpha: 0 });
			} else {
				TweenMax.set($(this), { y: 0 });
				TweenMax.to( $(this), 3, { x: 0, autoAlpha: 1, ease: Expo.easeOut });
			}
		});
		$(".animate-right").each( function() {
			var elementOffset = $(this).viewportOffset().top;
			var elementNegativeOffset = -($(this).height() + 20);
			if ( elementOffset < elementNegativeOffset ) {
				TweenMax.set($(this), { x: -100, y: -100, autoAlpha: 0 });
			} else if ( elementOffset > $(window).height() ){
				TweenMax.set($(this), { x: -100, y: 100, autoAlpha: 0 });
			} else {
				TweenMax.set($(this), { y: 0 });
				TweenMax.to( $(this), 3, { x: 0, autoAlpha: 1, ease: Expo.easeOut });
			}
		});
		/*
		$("#cones .section-inner").each( function() {
			var elementOffset = $(this).viewportOffset().top;
			var elementNegativeOffset = -($(this).height() + 20);
			if ( elementOffset < elementNegativeOffset ) {
			} else if ( elementOffset > $(window).height() ){
			} else {
				constellationAnimation.play();
			}
		});
		*/
	});
	/*
	var titleText = new SplitText("#cones .section-inner h1", {type:"chars"}),
		numTitleChars = titleText.chars.length;
	
	constellationAnimation =  new TimelineMax({ paused: true, force3D: true, onComplete: function () {
	}});
	constellationAnimation.staggerFrom(titleText.chars, 2, { cycle:{ y:[ 25, -25]}, autoAlpha: 0, ease: Linear.easeNon }, 0.03, 2);
	//constellationAnimation.play();
	*/
}


// MOBILE STUFF
function initStarlinkMobile() {

}

// DESKTOP STUFF
function initStarlinkDesktop() {

	if (deviceSettings.isMobile) {
		// NOTHING
	} else {
		TweenMax.set( ".hover", { yPercent: 100, display: 'block' } );
		TweenMax.set( ".text", { z: 1 } );
		$('.btn').hover(function(e) {
			TweenMax.to( $(this).find(".text"), 0.5, { color: "#000000", ease: Expo.easeOut });
			TweenMax.to( $(this).find(".hover"), 0.5, { yPercent: 0, autoAlpha: 1, ease: Expo.easeOut });
		}, function(e) {
			TweenMax.to( $(this).find(".text"), 0.5, { color: "#FFFFFF", ease: Expo.easeOut });
			TweenMax.to( $(this).find(".hover"), 0.5, { yPercent: 100, autoAlpha: 0, ease: Expo.easeOut });
		});
	}
}




// BUTTONS LOGIC
//var currentSection = $( ".section" ).first().attr("id");
var currentSection = "globe";
function initStarlinkButtons() {
	$(document).keydown(function (e) {
		var keyCode = e.keyCode || e.which, key = {
				up: 38, down: 40
			//, left: 37, right: 39
			};

		switch (keyCode) {
			/*
			case key.left:
				break;
			case key.right:
				break;
				*/
			case key.up:
				//moveUp();
        		var prevSection = $('#'+currentSection).prev('.section').attr("id");
				if (prevSection === undefined) prevSection = currentSection;
				currentSection = prevSection;
				moveToSection(currentSection);
				//checkSection();

				break;
			case key.down:
				//moveDown();
        		var nextSection = $('#'+currentSection).next('.section').attr("id");
				if (nextSection === undefined) nextSection = currentSection;
				currentSection = nextSection;
				moveToSection(currentSection);
				//checkSection();
				break;
		}
	});

	/* 
	$(document).on('keypress', function(e) {
		e.preventDefault();
	});
	$(document).keyup(function (e) {
		e.preventDefault();
		var keyCode = e.keyCode || e.which, key = {
				up: 38, down: 40
			};

		switch (keyCode) {
			case key.up:
				break;
			case key.down:
				e.preventDefault();
				break;
		}
	});
 */
   //document.getElementById("wrapper").addEventListener('mousewheel', onMouseWheel, false);
}


// MOUSE WHEEL AND MOVEMENT
var isScrolling = false;
function onMouseWheel(event) {
	event.preventDefault();
	
	if (isScrolling) return;
	if(deviceSettings.isMac) {
		if (event.deltaY > 0) scrollDown();
		if (event.deltaY < 0) scrollUp();
	} else {
		if (event.deltaY > 0) scrollUp();
		if (event.deltaY < 0) scrollDown();
	}
}

function scrollUp() {
	var prevSection = $('#'+currentSection).prev('.section').attr("id");
	if (prevSection === undefined) prevSection = currentSection;
	currentSection = prevSection;
	moveToSection(currentSection);
}

function scrollDown() {
	var nextSection = $('#'+currentSection).next('.section').attr("id");
	if (nextSection === undefined) nextSection = currentSection;
	currentSection = nextSection;
	moveToSection(currentSection);
}

/*
function checkSection() {
	$(".section").each( function() {
		var top_of_element = $(this).offset().top;
		var bottom_of_element = $(this).offset().top + $(this).outerHeight();
		var top_of_screen = $(window).scrollTop();
		var bottom_of_screen = $(window).scrollTop() + window.innerHeight;
		if((top_of_element > top_of_screen) && (top_of_element < bottom_of_screen )){
			var visibleSection = $(this).attr("id");
			currentSection = visibleSection;
			console.log(visibleSection);
		} else {
			// The element is not visible, do something else
		}
	});
}
*/

// PAGE MOVEMENT
var moveOffset = $(document).height();
function moveUp() {
	moveOffset = window.pageYOffset - $(window).height();
	if (moveOffset < 0) {
		moveOffset = 0;
	}
	moveAround();
}
function moveDown() {
	moveOffset = window.pageYOffset + $(window).height();
	var moveMax = ($(document).height() - $(window).height());
	if (moveOffset > moveMax) {
		moveOffset = moveMax;
	}
	moveAround();
}
function moveTop() {
	moveOffset = 0;
	moveAround();
}
function moveBottom() {
	moveOffset = ($(document).height() - $(window).height());
	moveAround();
}
function moveAround() {
	TweenMax.to(window, 2, { scrollTo: moveOffset, ease: Expo.easeOut });
	return false;
}
function moveToSection(section) {
	isScrolling = true;
	TweenMax.to(window, 1, { scrollTo: "#"+section, ease: Expo.easeOut, onComplete: function () {
		isScrolling = false;
	}});
}


// SITE RESIZE
var windowWidth = 0,
	spacexScale = 1,
	doResize = true;
function siteResize() {
	// DONT DO CRAZY RESIZES ON MOBILE
	if (deviceSettings.isMobile) {
		if (window.innerWidth != windowWidth) {
			windowWidth = $(window).width();
			doResize = true;
		} else {
			doResize = false;
		}
	}

	if (doResize) {
		var w = window.innerWidth;
		var h = window.innerHeight;

		// SCALE FOR HEADER AREA IMAGERY
		var ratioWidth = 1920;
		var ratioHeight = 1080;

		if (h < ratioHeight) {
			spacexScale = Math.round(h/ratioHeight * 100) / 100;
		} else {
			spacexScale = 1;
		}

		TweenMax.set( ".resize", { height: h });
		TweenMax.set( ".resize_gallery", { height: h - 100 });
		$(window).scroll();
	};

}

(function($){
  var win = $(window);
  $.fn.viewportOffset = function() {
	var offset = $(this).offset();

	return {
	  left: offset.left - win.scrollLeft(),
	  top: offset.top - win.scrollTop()
	};
  };
})(jQuery);

$(document).ready(initSpaceX);

/*
     FILE ARCHIVED ON 04:39:53 May 24, 2019 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 16:23:20 Mar 13, 2020.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  load_resource: 82.081
  PetaboxLoader3.resolve: 42.845
  esindex: 0.013
  PetaboxLoader3.datanode: 67.878 (4)
  exclusion.robots: 0.303
  exclusion.robots.policy: 0.282
  LoadShardBlock: 54.736 (3)
  RedisCDXSource: 0.812
  CDXLines.iter: 17.374 (3)
  captures_list: 81.52
*/