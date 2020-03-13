var deviceSettings = {
    isAndroid: null,
    isEarlyIE: null,
    isIE: null,
	isIEMobile: null,
    isiPod: null,
    isiPhone: null,
    isiPad: null,
    isiOS: null,
    isMac: null,
    isMobile: null
	};

function setupDeviceSettings() {
    var ua = navigator.userAgent.toLowerCase();
    deviceSettings.isAndroid = ua.indexOf("android") > -1;
    //deviceSettings.isEarlyIE = (jQuery.browser.msie == true && Number(jQuery.browser.version) <= 8) ? true : false;
    //deviceSettings.isIE = jQuery.browser.msie == true;
    deviceSettings.isMac = navigator.userAgent.match(/Mac/i) !== null;
    deviceSettings.isiPod = navigator.userAgent.match(/iPod/i) !== null;
    deviceSettings.isiPhone = navigator.userAgent.match(/iPhone/i) !== null;
    deviceSettings.isiPad = navigator.userAgent.match(/iPad/i) !== null;
    deviceSettings.isiOS = (navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ? true : false);
    deviceSettings.isIEMobile = navigator.userAgent.match(/iemobile/i) !== null;
    //determine if this is a mobile browser:
    var p = navigator.platform.toLowerCase();
    if (deviceSettings.isIEMobile || deviceSettings.isAndroid || deviceSettings.isiPad || p === 'ipad' || p === 'iphone' || p === 'ipod' || p === 'android' || p === 'palm' || p === 'windows phone' || p === 'blackberry' || p === 'linux armv7l') {
		deviceSettings.isMobile = true;
    } else {
	}
}

function checkDeviceSettings() {
  if (deviceSettings.isMobile) {
    $('body').addClass('isMobile');
    $('video').remove();
  } else {
    $('body').addClass('isDesktop');
  }
}

setupDeviceSettings();
/*
     FILE ARCHIVED ON 04:39:52 May 24, 2019 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 16:23:11 Mar 13, 2020.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  LoadShardBlock: 54.195 (3)
  load_resource: 91.898
  PetaboxLoader3.datanode: 54.545 (4)
  exclusion.robots.policy: 0.349
  CDXLines.iter: 11.295 (3)
  RedisCDXSource: 188.516
  exclusion.robots: 0.361
  PetaboxLoader3.resolve: 52.322
  esindex: 0.038
  captures_list: 260.393
*/