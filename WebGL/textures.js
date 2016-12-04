

var texturesLeft = 18;
var gunshipTex;
var gunshipnormalTex;
var alienTex;
var fontTex;
var asteroidTex;
var checkercolorTex;
var cloudTex;
var metalTex;
var earthTex;
var headTex;
var head2Tex;
var explosionTex;
var flare2Tex;
var flare4Tex;
var flare5Tex;
var eyeTex;
var portalTex;
var starsTex;


function handleLoadedTexture(texture) {
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	// Set up texture so we can render any size image and so we are
// working with pixels.

	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameterf(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);
    gl.texParameterf(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.REPEAT);

	//gl.generateMipmap(gl.TEXTURE_2D);


	gl.bindTexture(gl.TEXTURE_2D, null);
	texturesLeft-=1;
}


function loadSpaceshipTexture(){
	gunshipTex = gl.createTexture();
	gunshipTex.image = new Image();
	gunshipTex.image.onload = function () {
		handleLoadedTexture(gunshipTex);
	}
	gunshipTex.image.src = "images/GunshipSheet.png";
}

function loadSpaceshipBumpTexture(){
	gunshipnormalTex = gl.createTexture();
	gunshipnormalTex.image = new Image();
	gunshipnormalTex.image.onload = function () {
		handleLoadedTexture(gunshipnormalTex);
	}
	gunshipnormalTex.image.src = "images/GunshipSheet_bump.png";
}

function loadAlienTexture(){
	alienTex = gl.createTexture();
	alienTex.image = new Image();
	alienTex.image.onload = function () {
		handleLoadedTexture(alienTex);
	}
	//alienTex.image.src = "images/alien_body_D.png";
	alienTex.image.src = "images/reptil.png";
}

function loadFontTexture(){
	fontTex = gl.createTexture();
	fontTex.image = new Image();
	fontTex.image.onload = function () {
		handleLoadedTexture(fontTex);
	}
	fontTex.image.src = "images/Anno_16x16.png";
}

function loadAsteroidTexture(){
	asteroidTex = gl.createTexture();
	asteroidTex.image = new Image();
	asteroidTex.image.onload = function () {
		handleLoadedTexture(asteroidTex);
	}
	asteroidTex.image.src = "images/asteroid.png";
}

function loadCheckerColorsTexture(){
	checkercolorTex = gl.createTexture();
	checkercolorTex.image = new Image();
	checkercolorTex.image.onload = function () {
		handleLoadedTexture(checkercolorTex);
	}
	checkercolorTex.image.src = "images/checker.png";
}

function loadCloudTexture(){
	cloudTex = gl.createTexture();
	cloudTex.image = new Image();
	cloudTex.image.onload = function () {
		handleLoadedTexture(cloudTex);
	}
	cloudTex.image.src = "images/cloud_nobg.png";
}

function loadHeadTexture(){
	headTex = gl.createTexture();
	headTex.image = new Image();
	headTex.image.onload = function () {
		handleLoadedTexture(headTex);
	}
	headTex.image.src = "images/head.png";
}

function loadHead2Texture(){
	head2Tex = gl.createTexture();
	head2Tex.image = new Image();
	head2Tex.image.onload = function () {
		handleLoadedTexture(head2Tex);
	}
	head2Tex.image.src = "images/head2.png";
}

function loadMetalTexture(){
	metalTex = gl.createTexture();
	metalTex.image = new Image();
	metalTex.image.onload = function () {
		handleLoadedTexture(metalTex);
	}
	metalTex.image.src = "images/corrmetal.png";
}

function loadEarthTexture(){
	earthTex = gl.createTexture();
	earthTex.image = new Image();
	earthTex.image.onload = function () {
		handleLoadedTexture(earthTex);
	}
	earthTex.image.src = "images/earth.png";
}

function loadExplosionTexture(){
	explosionTex = gl.createTexture();
	explosionTex.image = new Image();
	explosionTex.image.onload = function () {
		handleLoadedTexture(explosionTex);
	}
	explosionTex.image.src = "images/fireball.png";
}

function loadFlare2Texture(){
	flare2Tex = gl.createTexture();
	flare2Tex.image = new Image();
	flare2Tex.image.onload = function () {
		handleLoadedTexture(flare2Tex);
	}
	flare2Tex.image.src = "images/flare2.png";
}

function loadFlare4Texture(){
	flare4Tex = gl.createTexture();
	flare4Tex.image = new Image();
	flare4Tex.image.onload = function () {
		handleLoadedTexture(flare4Tex);
	}
	flare4Tex.image.src = "images/flare4.png";
}

function loadFlare5Texture(){
	flare5Tex = gl.createTexture();
	flare5Tex.image = new Image();
	flare5Tex.image.onload = function () {
		handleLoadedTexture(flare5Tex);
	}
	flare5Tex.image.src = "images/flare5.png";
}

function loadEyeTexture(){
	eyeTex = gl.createTexture();
	eyeTex.image = new Image();
	eyeTex.image.onload = function () {
		handleLoadedTexture(eyeTex);
	}
	eyeTex.image.src = "images/humaneyebigsq.png";
}

function loadPortalTexture(){
	portalTex = gl.createTexture();
	portalTex.image = new Image();
	portalTex.image.onload = function () {
		handleLoadedTexture(portalTex);
	}
	portalTex.image.src = "images/liquidmetal.png";
}

function loadStarsTexture(){
	starsTex = gl.createTexture();
	starsTex.image = new Image();
	starsTex.image.onload = function () {
		handleLoadedTexture(starsTex);
	}
	starsTex.image.src = "images/stars.png";
}

