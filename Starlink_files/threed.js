 	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

	var deviceSettingsWebGl = {
		isWebGL: false,
		isAndroid: null,
		isEarlyIE: null,
		isIE: null,
		isIEMobile: null,
		isiPod: null,
		isiPhone: null,
		isiPad: null,
		isiOS: null,
		isMobile: null,
		isTablet: null,
		isWinSafari: null,
		isMacSafari: null
		};

	function setupDeviceSettings() {
		var ua = navigator.userAgent.toLowerCase();
		deviceSettingsWebGl.isAndroid = ua.indexOf("android") > -1;
		//deviceSettingsWebGl.isEarlyIE = (jQuery.browser.msie == true && Number(jQuery.browser.version) <= 8) ? true : false;
		//deviceSettingsWebGl.isIE = jQuery.browser.msie == true;
		deviceSettingsWebGl.isiPod = navigator.userAgent.match(/iPod/i) !== null;
		deviceSettingsWebGl.isiPhone = navigator.userAgent.match(/iPhone/i) !== null;
		deviceSettingsWebGl.isiPad = navigator.userAgent.match(/iPad/i) !== null;
		deviceSettingsWebGl.isiOS = (navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ? true : false);
		deviceSettingsWebGl.isIEMobile = navigator.userAgent.match(/iemobile/i) !== null;
		//determine if this is a mobile browser:
		var p = navigator.platform.toLowerCase();
		if (deviceSettingsWebGl.isIEMobile || deviceSettingsWebGl.isAndroid || deviceSettingsWebGl.isiPad || p === 'ipad' || p === 'iphone' || p === 'ipod' || p === 'android' || p === 'palm' || p === 'windows phone' || p === 'blackberry' || p === 'linux armv7l') {
			deviceSettingsWebGl.isMobile = true;
			$('body').addClass('isMobile');
		} else {
			$('body').addClass('isDesktop');
		}

		if ( Detector.webgl ) {
			deviceSettingsWebGl.isWebGL = true;
		}
		//if (deviceSettingsWebGl.isAndroid || deviceSettingsWebGl.isIEMobile) deviceSettingsWebGl.isWebGL = false;
		if (deviceSettingsWebGl.isAndroid || deviceSettingsWebGl.isIEMobile) deviceSettingsWebGl.isWebGL = false;
	}

	var container, camera, scene, renderer, i, x, y, b;

	var mouse = new THREE.Vector2(), mouseX = 0, mouseY = 0,
		mouseXOnMouseDown = 0, mouseYOnMouseDown = 0,
		clientMouseX = 0, clientMouseY = 0, initMouseX,
		openingCameraZ = 100,
		targetCameraZ = 45,
		windowHalfX = window.innerWidth / 2, windowHalfY = window.innerHeight / 2,
		toRAD = Math.PI/180, radianLoop = 6.28319,
		//openingRotationX = 0.45,
		//targetRotationX = 0.45,
		openingRotationX = 0 * toRAD,
		targetRotationX = 0 * toRAD,
		targetRotationXOnMouseDown = 0.45,
		openingRotationY = 65 * toRAD,
		targetRotationY = 65 * toRAD,
		targetRotationYOnMouseDown = 90 * toRAD,
		lastTouchX, lastTouchY,
		cameraTarget = "auto",
		isMouseDown = false, isMouseMoved = false, isGlobeRotated = false, isGlobeEventsEnabled = false;

	var globeRaycaster = new THREE.Raycaster(), intersects,  intersection = null, isParticleHit = false, isMediaHit = false;
		globeRaycaster.params.Points.threshold = 0.1;

	var colorPrimary_Base = "#24d2fd"; //#00CCFF
	var colorSecondary_Base = "#FF1313"; //#FF0000
	var colorPrimary = colorPrimary_Base;
	var colorSecondary = colorSecondary_Base;
	var colorDarken = "#000000";
	var colorBrighten = "#FFFFFF";

	var colorBase 	= new THREE.Color(colorPrimary),
		colorBase50 = new THREE.Color(shadeBlend(0.50, colorPrimary, colorDarken)),
		colorBase75 = new THREE.Color(shadeBlend(0.75, colorPrimary, colorDarken)),
		colorBase85 = new THREE.Color(shadeBlend(0.85, colorPrimary, colorDarken)),
		colorHighlight 	= new THREE.Color(colorSecondary);

		var colorWhite  = new THREE.Color("#FFFFFF");
		var colorBlue  = new THREE.Color("#24d2fd");

	// CREATE THE WEBGL CONTAINER ////////////////////////////////////////
	function initWebgl() {
		setupDeviceSettings();

		container = document.getElementById("interactive");

		var width  = window.innerWidth, height = window.innerHeight;

		scene = new THREE.Scene();
		scene.fog = new THREE.Fog( 0x000000, 0, 400 );

		camera = new THREE.PerspectiveCamera(35, width / height, 1, 2000);
		camera.position.x = 0;
		camera.position.y = 0;
		camera.position.z = openingCameraZ;
		camera.rotation.x = 0;
		camera.rotation.y = 0;
		camera.rotation.z = 0;

		var functionArr =  [
			{ fn: createGroup, 			vars: [stepComplete] },
			{ fn: createLights, 		vars: [stepComplete] },
			{ fn: createUniverse, 		vars: [stepComplete] },
			{ fn: createGlobe, 			vars: [stepComplete] },
			{ fn: createRings, 			vars: [stepComplete] },
			{ fn: createPreloader, 		vars: null }
	    ];

		arrayExecuter.execute(functionArr);

		renderer = new THREE.WebGLRenderer({
			antialias : true,
			alpha: false
		});
		renderer.setSize(width, height);
		renderer.setClearColor (0x000000, 1);

		container.appendChild( renderer.domElement );

		animate();
	}



	// PRELOADER ////////////////////////////////////////
	var preloaderAnimationIn,
		siteIntroAnimation,
		preloaderAnimationInComplete = false,
		preloaderAnimationOut,
		preloaderArray = [],
		preloaderComplete = false,
		preloaderLoaded = 0,
		preloaderTotal = 0,
		preloaderSplitText,
		preloaderSplitTextWordTotal,
		isIntroDone = false,
		introAnimation;

	function createPreloader(callbackFn) {
		TweenMax.set( "#about", { autoAlpha: 0, display: 'block' });
		TweenMax.set( "#preloaderCircle .circleGrey", { drawSVG: "0% 0%", autoAlpha: 0 });
		TweenMax.set( "#preloaderCircle .circleBlue", { drawSVG: "0% 0%" });
		TweenMax.set( "#preloaderCircle", { rotation: 90 });

		preloaderAnimationIn =  new TimelineMax({ paused: true, onComplete: function () {
			preloaderAnimationInComplete = true;
			startPreloader();
		}} );
		preloaderAnimationIn.fromTo( "#preloaderInner", 1, { autoAlpha: 0 }, { autoAlpha: 1, ease: Linear.easeNone }, 0);
		preloaderAnimationIn.fromTo( "#preloaderCircle .circleGrey", 2, { autoAlpha: 0 }, { autoAlpha: 1, ease: Linear.easeNone }, 0);
		preloaderAnimationIn.fromTo( "#preloaderCircle .circleGrey", 3, { drawSVG: "0% 0%" }, { drawSVG: "0% 102%", ease: Expo.easeInOut }, 0);
		preloaderAnimationIn.timeScale(1);
		preloaderAnimationIn.play(0);

		if (callbackFn) {
			callbackFn();
		}
	}

	function startPreloader() {
		if (deviceSettingsWebGl.isMobile) {
			preloaderArray.push("images/threed/earth_mobile.jpg");
			preloaderArray.push("images/threed/earthbump4k_mobile.jpg");
			preloaderArray.push("images/threed/universe_mobile.jpg");
		} else {
			preloaderArray.push("images/threed/earth.jpg");
			preloaderArray.push("images/threed/earthbump4k.jpg");
			preloaderArray.push("images/threed/universe.jpg");
		}
		preloaderTotal = preloaderArray.length;
		for (var i = 0; i < preloaderArray.length; i++) {
			var image = new Image();
			image.src = preloaderArray[i];
			image.onload = function(){
			   checkPreloader();
			};
		}
	}


	function checkPreloader() {
		preloaderLoaded++;
		var tempPercentage = (preloaderLoaded/preloaderTotal);
		if (preloaderLoaded === preloaderTotal) {
			preloaderComplete = true;
			if(preloaderAnimationInComplete) {
			}
		}

		if (preloaderComplete) {
			TweenMax.to( "#preloaderCircle .circleBlue", 2, { drawSVG: "0% " + tempPercentage * 100 + "%", ease: Expo.easeOut, onComplete: function () {
				finishPreloader();
				initExperience();
			}});
		} else {
			TweenMax.to( "#preloaderCircle .circleBlue", 0.25, { autoAlpha: 1 });
			TweenMax.to( "#preloaderCircle .circleBlue", 2, { drawSVG: "0% " + tempPercentage * 100 + "%", immediateRender: false, ease: Expo.easeOut });
		}
		
	}
	
	function finishPreloader() {
		preloaderAnimationOut =  new TimelineMax({ paused: true, onComplete: function () {
			playIntro();
		}} );
		preloaderAnimationOut.to( "#preloaderCircle .circleBlue", 2, { drawSVG: "100% 100%", ease: Expo.easeInOut, immediateRender: false }, 0);
		preloaderAnimationOut.timeScale(1);
		preloaderAnimationOut.play(0);
	}

    var arrayExecuter = new ArrayExecuter();
	var stepComplete = arrayExecuter.stepComplete_instant.bind(arrayExecuter);

	function initExperience() {
		document.getElementById("interactive").addEventListener( 'mousedown', onDocumentMouseDown, false );
		document.getElementById("interactive").addEventListener( 'mousemove', onDocumentMouseMove, false );
		document.getElementById("interactive").addEventListener( 'mouseup', onDocumentMouseUp, false );
		document.getElementById("interactive").addEventListener( 'mouseleave', onDocumentMouseLeave, false );

		document.getElementById("interactive").addEventListener( 'touchstart', onDocumentTouchStart, false );
		document.getElementById("interactive").addEventListener( 'touchmove', onDocumentTouchMove, false );
		document.getElementById("interactive").addEventListener( 'touchend', onDocumentTouchEnd, false );
		
		// NO MOUSE SCROLLING THIS TIME
    	//document.getElementById("interactive").addEventListener('mousewheel', onMouseWheel, false);

		document.addEventListener('gesturestart', function (e) {
			e.preventDefault();
		});

		window.addEventListener( 'resize', onWindowResize, false );
		onWindowResize();

		initButtons();

	function playIntro() {
		isGlobeRotated = true;
		isGlobeEventsEnabled = true;

		introAnimation =  new TimelineMax({ paused: true, force3D: true,
			onComplete:function(){
				isIntroDone = true;
			}
		});
		introAnimation.fromTo( "#preloader", 2, { autoAlpha: 1 }, { autoAlpha: 0, ease: Linear.easeNone }, 0 );
		introAnimation.fromTo( "starlink-logo", 2, { autoAlpha: 0 }, { autoAlpha: 1, ease: Linear.easeNone }, 0 );
		introAnimation.staggerFromTo( ".letter", 2, { autoAlpha: 0 }, { autoAlpha: 1, ease: Linear.easeNone}, 0.25, 2 );

		introAnimation.staggerFromTo( ".logo_x", 3, { autoAlpha: 0 }, { autoAlpha: 1, ease: Linear.easeNone}, 0.25, 1 );
		introAnimation.fromTo( "#mask_x1 circle", 3, { attr:{ cx: 75, cy: 300, r: 200 } }, { attr:{ cx: 275, cy: 85, r: 200 }, ease: Expo.easeInOut }, 1 );
		introAnimation.fromTo( "#mask_x2 circle", 3, { attr:{ cx: 340, cy: 185, r: 80 } }, { attr:{ cx: 230, cy: 90, r: 80 }, ease: Expo.easeInOut }, 1 );
		//introAnimation.fromTo( "#mask_x2 rect", 3, { attr:{ y: 120 } }, { attr:{ y: 40 }, ease: Expo.easeInOut }, 0.1 );
		
		TweenMax.fromTo( "#scrollme", 1, { autoAlpha: 0 }, { autoAlpha: 1, yoyo: true, repeat: -1, ease: Linear.easeNone } );

		introAnimation.timeScale(1);
		introAnimation.play();
	}

	function showGlobe() {
		TweenMax.fromTo( universeBgMaterial, 4, { opacity: 0 }, { opacity: 1, delay: 1, ease: Linear.easeNone } );
	}


	// CONTAINER OBJECTS ////////////////////////////////////////
	var rotationObject,
		earthObject;
	function createGroup(callbackFn) {
		rotationObject  = new THREE.Group();
		rotationObject.name = 'rotationObject';
		rotationObject.rotation.x = openingRotationX;
		rotationObject.rotation.y = openingRotationY;
		scene.add(rotationObject);

		earthObject = new THREE.Group();
		earthObject.name = 'earthObject';
		earthObject.rotation.y = -90 * toRAD;
		rotationObject.add(earthObject);

		if (callbackFn) {
			callbackFn();
		}
	}


	// LIGHTS  ////////////////////////////////////////
	var directionalLight,
		lightsCreated = false;
	function createLights(callbackFn) {
		var directionalLight = new THREE.DirectionalLight( 0xCCCCCC, 1 );
		directionalLight.position.set(0, 0.5, 1).normalize();
		directionalLight.position.set(0, 3, 5);
		scene.add( directionalLight );

		var lightLeft = new THREE.PointLight( 0xCCCCCC, 5, 1000 );
		lightLeft.position.set( -20, 5, -10 );
		scene.add( lightLeft );

		var lightRight = new THREE.PointLight( 0xCCCCCC, 2, 1000 );
		lightRight.position.set( 10, 10, 0 );
		scene.add( lightRight );


		var lightMars = new THREE.PointLight( 0xCCCCCC, 1, 1000 );
		lightMars.position.set( 0, -20, -10 );
		//scene.add( lightMars );

		// LIGHT HELPER
		var lightBurstHelper = new THREE.PointLightHelper( lightRight, 1 );
		//scene.add( lightBurstHelper );

		lightsCreated = true;

		if (callbackFn) {
			callbackFn();
		}
	}

	// UNIVERSE BACKGROUND ////////////////////////////////////////
	var universeBgObject,
		universeBgTexture,
		universeBgMaterial,
		universeBgGeometry,
		universeBgMesh,
		universeCreated = false;
	function createUniverse(callbackFn) {
		if (deviceSettingsWebGl.isMobile) {
			universeBgTexture = new THREE.TextureLoader().load("images/threed/universe_mobile.jpg");
		} else {
			universeBgTexture = new THREE.TextureLoader().load("images/threed/universe_mobile.jpg");
		}

		universeBgTexture.anisotropy = 16;
		universeBgGeometry  = new THREE.SphereGeometry(64, 32, 32)
		universeBgMaterial = new THREE.MeshBasicMaterial({
			map: universeBgTexture,
			//fog: true,
			side: THREE.BackSide,
		});
		universeBgMesh = new THREE.Mesh( universeBgGeometry, universeBgMaterial );
		universeBgMesh.name = 'universeBgMesh';
		earthObject.add(universeBgMesh);

		universeCreated = true;

		if (callbackFn) {
			callbackFn();
		}
	}

	// EARTH ////////////////////////////////////////
	var globeRadius = 10,
		globeMaxZoom = 20,
		globeMinZoom = 100,
		globeExtraDistance = 0.005,
		globeBufferGeometry,
		globeTexture,
		globeTextureBumpmap,
		globeTextureDisplacementmap,
		globeTextureNormalmap,
		globeTextureSpecular,
		globeMaterial,
		globeCreated = false;
	function createGlobe(callbackFn) {

		globeBufferGeometry = new THREE.SphereBufferGeometry(globeRadius, 64, 64);
		if (deviceSettingsWebGl.isMobile) {
			globeTexture = new THREE.TextureLoader().load("images/threed/earth_mobile.jpg");
			globeTextureBumpmap = new THREE.TextureLoader().load("images/threed/earthbump4k_mobile.jpg");
		} else {
			globeTexture = new THREE.TextureLoader().load("images/threed/earth.jpg");
			globeTextureBumpmap = new THREE.TextureLoader().load("images/threed/earthbump4k.jpg");
		}

		globeTexture.anisotropy = 16;

		globeMaterial = new THREE.MeshPhongMaterial({
			map: globeTexture,
			shininess: 0,
			bumpMap: globeTextureBumpmap,
			bumpScale: 0.1,
			fog: true
		});
		globeMesh = new THREE.Mesh(globeBufferGeometry, globeMaterial);
		earthObject.add(globeMesh);

		globeCreated = true;

		if (callbackFn) {
			callbackFn();
		}
	}

	function renderGlobe() {
		if (isGlobeEventsEnabled) {
			// ZOOM LEVEL
			if (targetCameraZ < globeMaxZoom) targetCameraZ = globeMaxZoom;
			if (targetCameraZ > globeMinZoom) targetCameraZ = globeMinZoom;
			camera.position.z = camera.position.z += ( targetCameraZ - camera.position.z ) * 0.01;
		}
	}

	// RING PULSE ////////////////////////////////////////
	var ringTotal = 24,
		ringPointArray = [],
		ringPointRadius = globeRadius + (globeRadius * 0.0865),
		ringPointTotal = 30,
		ringPointAngle = 2 * Math.PI / ringPointTotal,
		ringPointSize = 0.1,
		ringPointGeometry,
		ringPointMaterial,
		ringPointMesh,

		ringLineTotal = 100,
		ringLineTotalHalf = ringLineTotal/2,
		ringLineAngle = 2 * Math.PI / ringLineTotal,
		ringLineRadius = globeRadius + (globeRadius * 0.0865),
		ringLineVerticesArray = [],
		ringLineBufferGeometry,
		ringLinetShaderUniforms,
		ringLineShaderMaterial,
		ringLineMesh,

		ringsCreated = false;

	function createRings(callbackFn) {
		// POINT MATERIAL
		ringPointMaterial = new THREE.PointsMaterial( {
			size: ringPointSize,
			color: colorWhite,
			transparent: true,
			side: THREE.DoubleSide,
			blending: THREE.AdditiveBlending,
			//sizeAttenuation: false,
			fog: true
			//,depthWrite: false
			//, depthTest: false
		});

		// CREATE THE POINT GEOMETRY
		ringPointGeometry = new THREE.Geometry();
		for ( i = 0; i < ringPointTotal; i ++ ) {
			var vertex = new THREE.Vector3();
			vertex.x = ringPointRadius * Math.cos(ringPointAngle * i);
			vertex.y = 0;
			vertex.z = ringPointRadius * Math.sin(ringPointAngle * i);
			ringPointGeometry.vertices.push( vertex );
		}
		ringPointMesh = new THREE.Points( ringPointGeometry, ringPointMaterial );
		//ringPointMesh.rotation.x = -53 * toRAD;
		ringPointMesh.rotation.x = -60 * toRAD;

		// RING STUFF
		for ( i = 0; i < ringLineTotal; i ++ ) {
			var vertex = new THREE.Vector3();
			vertex.x = ringLineRadius * Math.cos(ringLineAngle * i);
			vertex.y = 0;
			vertex.z = ringLineRadius * Math.sin(ringLineAngle * i);
			vertex.normalize();
			vertex.multiplyScalar( ringLineRadius );
			ringLineVerticesArray.push(vertex);
		}

		ringLineBufferGeometry = new THREE.BufferGeometry();
		ringLineShaderUniforms = {
			color:     { value: colorBlue },
			fogColor:    { type: "c", value: scene.fog.color },
			fogNear:     { type: "f", value: scene.fog.near },
			fogFar:      { type: "f", value: scene.fog.far }
		};
		ringLineShaderMaterial = new THREE.ShaderMaterial( {
			uniforms:       ringLineShaderUniforms,
			vertexShader:   document.getElementById( 'line_vertexshader' ).textContent,
			fragmentShader: document.getElementById( 'line_fragmentshader' ).textContent,
			blending:       THREE.AdditiveBlending,
			//depthTest:      false,
			transparent:    true,
        	fog: true
		});

		var positions = new Float32Array(ringLineVerticesArray.length * 3);
		var alphas = new Float32Array( ringLineVerticesArray.length );

		//var maxOpacity = 0.5;
		for (var i = 0; i < ringLineVerticesArray.length; i++) {
			positions[i * 3] = ringLineVerticesArray[i].x;
			positions[i * 3 + 1] = ringLineVerticesArray[i].y;
			positions[i * 3 + 2] = ringLineVerticesArray[i].z;
			var tempOpacity = 0.1;
			alphas[ i ] = tempOpacity;
		}

		ringLineBufferGeometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
		ringLineBufferGeometry.addAttribute( 'alpha', new THREE.BufferAttribute( alphas, 1 ) );
		ringLineMesh = new THREE.LineLoop( ringLineBufferGeometry, ringLineShaderMaterial );
		//ringLineMesh.rotation.x = -53 * toRAD;
		ringLineMesh.rotation.x = -60 * toRAD;

		// CREATE & GROUP ALL OF THE THINGS
		var rotationFactor = 360 / ringTotal;
		for ( i = 0; i < ringTotal; i ++ ) {
			var orbitalPlaneObject  = new THREE.Group();
			orbitalPlaneObject.rotation.y = (i * rotationFactor) * toRAD;

			// POINT RINGS
			var newRingPoint = ringPointMesh.clone();
			newRingPoint.rotation.y = i * 0.05;
			orbitalPlaneObject.add( newRingPoint );

			// NORMAL RINGS
			var newRingLine = ringLineMesh.clone();
			orbitalPlaneObject.add( newRingLine );

			rotationObject.add( orbitalPlaneObject );
			ringPointArray.push(newRingPoint);
		}

		ringsCreated = true;

		if (callbackFn) {
			callbackFn();
		}
	}

	function renderRings() {
		for ( i = 0; i < ringTotal; i ++ ) {
			ringPointArray[i].rotation.y += 0.00125;
		}
	}

	function checkDistance(a, b) {
		return Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y) + (b.z - a.z) * (b.z - a.z) );
	}

    function latLongToVector3(lat, lon, radius, height) {
        var phi = (lat)*Math.PI/180;
        var theta = (lon-180)*Math.PI/180;
        var x = -(radius+height) * Math.cos(phi) * Math.cos(theta);
        var y = (radius+height) * Math.sin(phi);
        var z = (radius+height) * Math.cos(phi) * Math.sin(theta);
        return new THREE.Vector3(x,y,z);
    }

	function animate() {
		requestAnimationFrame( animate );

		render();
	}

	var cameraDirection = "left";
	var rotationSpeed = { value: 0.001 };
	var dragSpeed = 0.1;
	var dragZone = 25;
	var dragSpeedSlowZone = (globeMaxZoom + dragZone);

	function render() {
		renderer.render( scene, camera );

		// DON'T DO ANYTHING IF SECTION NOT FULLY IN
		if (isGlobeEventsEnabled) {
			// ZOOM LEVEL
			if (targetCameraZ < globeMaxZoom) targetCameraZ = globeMaxZoom;
			if (targetCameraZ > globeMinZoom) targetCameraZ = globeMinZoom;
			camera.position.z = camera.position.z += ( targetCameraZ - camera.position.z ) * 0.005;
		}

		if ( isGlobeRotated ) {
			// ROTATION UP/DOWN
			if (targetRotationX > 75 * toRAD) targetRotationX = 75 * toRAD;
			if (targetRotationX < -75 * toRAD) targetRotationX = -75 * toRAD;
			rotationObject.rotation.x = rotationObject.rotation.x += ( targetRotationX - rotationObject.rotation.x ) * dragSpeed;
			rotationObject.rotation.y = rotationObject.rotation.y += ( targetRotationY - rotationObject.rotation.y ) * dragSpeed;
		}
		if (cameraTarget == "auto" && isGlobeRotated) {
			if (isMouseDown || isParticleHit || isMediaHit) {
				// TODO
			} else {
				switch (cameraDirection) {
					case "left":
						targetRotationY += rotationSpeed.value;
						break;
					case "right":
						targetRotationY -= rotationSpeed.value;
						break;
				}
			}
		}

		if (globeCreated) renderGlobe();
		if (ringsCreated) renderRings();

	}


	// BUTTONS LOGIC
	function initButtons() {
		if (!deviceSettingsWebGl.isMobile) {
			$(document).keydown(function (e) {
				var keyCode = e.keyCode || e.which, key = {
						left: 37, right: 39
						//, up: 38, down: 40
					};
				var tempRotation = (20 * toRAD);
				switch (keyCode) {
					case key.left:
						targetRotationY = targetRotationY - tempRotation;
						 cameraDirection = "right";
						break;
					case key.right:
						targetRotationY = targetRotationY + tempRotation;
						cameraDirection = "left";
						break;
						/*
					case key.up:
						targetCameraZ = targetCameraZ - 10;
						break;
					case key.down:
						targetCameraZ = targetCameraZ + 10;
						break;
						*/
				}
			});
		}
	}


	function getDifference(a, b) {
		return Math.abs(a - b);
	}

	// COLOR FUNCTIONS
	function checkIsBlack(dataPixel){
		if(dataPixel[0]==dataPixel[1] && dataPixel[1]==dataPixel[2] && dataPixel[2]===0 ){
			return true
		} else {
			return false;
		}
	}

	function shadeBlend(p,c0,c1) {
		var n=p<0?p*-1:p,u=Math.round,w=parseInt;
		if(c0.length>7){
			var f=c0.split(","),t=(c1?c1:p<0?"rgb(0,0,0)":"rgb(255,255,255)").split(","),R=w(f[0].slice(4)),G=w(f[1]),B=w(f[2]);
			return "rgb("+(u((w(t[0].slice(4))-R)*n)+R)+","+(u((w(t[1])-G)*n)+G)+","+(u((w(t[2])-B)*n)+B)+")"
		}else{
			var f=w(c0.slice(1),16),t=w((c1?c1:p<0?"#000000":"#FFFFFF").slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF;
			return "#"+(0x1000000+(u(((t>>16)-R1)*n)+R1)*0x10000+(u(((t>>8&0x00FF)-G1)*n)+G1)*0x100+(u(((t&0x0000FF)-B1)*n)+B1)).toString(16).slice(1)
		}
	}

	function hexToRgb(hex) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	}

	// GENERATE RANDOM NUMBER
	function generateRandomNumber(min, max) {
		var random = Math.floor(Math.random() * (max - min + 1)) + min;
		return random;
	}

	// RESIZE CODE
	function onWindowResize() {
		var width = window.innerWidth;
		var height = window.innerHeight;
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		renderer.setSize( width, height );
	}

	// MOUSE WHEEL AND MOVEMENT
	function onMouseWheel(event) {
		event.preventDefault();
		targetCameraZ -= event.wheelDeltaY * 0.01;
	}

	function onDocumentMouseDown( event ) {
		if ( isGlobeEventsEnabled === false ) return;
		event.preventDefault();
		isMouseDown = true;

		mouseXOnMouseDown = event.clientX - windowHalfX;
		mouseYOnMouseDown = event.clientY - windowHalfY;

		targetRotationXOnMouseDown = targetRotationX;
		targetRotationYOnMouseDown = targetRotationY;

		//checkClick();

		initMouseX = event.clientX;
	}
	var targetTiltX = 0;
	var targetTiltY = 0;

	function onDocumentMouseMove( event ) {
		if ( isGlobeEventsEnabled === false ) return;
		isMouseMoved = true;
		clientMouseX = event.clientX;
		clientMouseY = event.clientY;

		if (isParticleHit) {

			if (clientMouseX > (window.innerWidth - 250)) {
				TweenMax.set( "#tooltip", { left: 'auto', right: (window.innerWidth - clientMouseX) + 35, top: clientMouseY });
			} else {
				TweenMax.set( "#tooltip", { right: 'auto', left: clientMouseX + 35, top: clientMouseY });
			}
		}

		if (isMediaHit) {

			if (clientMouseX > (window.innerWidth - 250)) {
				TweenMax.set( "#tooltip", { left: 'auto', right: (window.innerWidth - clientMouseX) + 35, top: clientMouseY });
			} else {
				TweenMax.set( "#tooltip", { right: 'auto', left: clientMouseX + 35, top: clientMouseY });
			}
		}

		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		if (isMouseDown) {
			isGlobeRotated = true;
			mouseX = event.clientX - windowHalfX;
			mouseY = event.clientY - windowHalfY;
			targetRotationX = targetRotationXOnMouseDown + ( mouseY - mouseYOnMouseDown ) * 0.0025;
			targetRotationY = targetRotationYOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.0025;
		}

		var centerX = window.innerWidth * 0.5;
		var centerY = window.innerHeight * 0.5;
		targetTiltY = (event.clientX - centerX) / centerX * 0.005;
		targetTiltX = (event.clientY - centerY) / centerY * 0.01;
	}

	function onDocumentMouseUp( event ) {
		if ( isGlobeEventsEnabled === false ) return;
		event.preventDefault();
		isMouseDown = false;
		if (Math.abs(initMouseX - event.clientX) < 25) return;
		setCameraDirection(initMouseX, event.clientX);
	}

	function onDocumentMouseLeave( event ) {
		if ( isGlobeEventsEnabled === false ) return;
		event.preventDefault();
		if (isMouseDown) {
			isMouseDown = false;
			if (Math.abs(initMouseX - event.clientX) < 25) return;
			setCameraDirection(initMouseX, event.clientX);
		}
	}

	function setCameraDirection(startX, endX) {
		if (startX > endX ) {
			cameraDirection = "right";
		} else {
			cameraDirection = "left";
		}
	}


	// TOUCH
	var _touchZoomDistanceStart,
		_touchZoomDistanceEnd;
	function onDocumentTouchStart( event ) {
		if ( isGlobeEventsEnabled === false ) return;
		if ( event.touches.length == 1 ) {
			//event.preventDefault();
			isMouseDown = true;

			mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
			mouseYOnMouseDown = event.touches[ 0 ].pageY - windowHalfY;

			targetRotationXOnMouseDown = targetRotationX;
			targetRotationYOnMouseDown = targetRotationY;
		}

		if ( event.touches.length > 1 ) {
			var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
			var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
			_touchZoomDistanceEnd = _touchZoomDistanceStart = Math.sqrt( dx * dx + dy * dy );
		}
	}

	function onDocumentTouchMove( event ) {
		if ( isGlobeEventsEnabled === false ) return;
		if ( event.touches.length == 1 ) {
			//event.preventDefault();
			if (isMouseDown) {
				isGlobeRotated = true;
				mouseX = mouseX = event.touches[ 0 ].pageX - windowHalfX;
				mouseY = mouseY = event.touches[ 0 ].pageY - windowHalfY;
				//targetRotationX = targetRotationXOnMouseDown + ( mouseY - mouseYOnMouseDown ) * 0.01;
				targetRotationY = targetRotationYOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.01;

				if (deviceSettingsWebGl.isMobile) {
				} else {
					targetRotationX = targetRotationXOnMouseDown + ( mouseY - mouseYOnMouseDown ) * 0.01;
				}
			}
			//lastTouchX = event.clientX = event.touches[0].clientX;
			//lastTouchY = event.clientY = event.touches[0].clientY;
		}

		if ( event.touches.length > 1 ) {
           var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
           var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
           _touchZoomDistanceEnd = Math.sqrt( dx * dx + dy * dy );

			var factor = _touchZoomDistanceStart / _touchZoomDistanceEnd;
			if (_touchZoomDistanceEnd > _touchZoomDistanceStart) {
				targetCameraZ -= factor;
			} else {
				targetCameraZ += factor;
			}
			_touchZoomDistanceStart = _touchZoomDistanceEnd;
		}
	}

	function onDocumentTouchEnd( event ) {
		_touchZoomDistanceStart = _touchZoomDistanceEnd = 0;
		onDocumentMouseUp(event);
	}

$(document).ready(initWebgl);

/*
     FILE ARCHIVED ON 04:39:57 May 24, 2019 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 16:23:18 Mar 13, 2020.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  PetaboxLoader3.datanode: 865.239 (4)
  LoadShardBlock: 830.473 (3)
  PetaboxLoader3.resolve: 75.36
  exclusion.robots: 0.201
  esindex: 0.009
  exclusion.robots.policy: 0.188
  load_resource: 177.819
  captures_list: 847.872
  CDXLines.iter: 12.184 (3)
  RedisCDXSource: 1.953
*/