var gl;
var shaderProgram;
var vertexShader;
var fragmentShader;

var I_POINT=0;
var I_DIR = 1;
var I_SPOT= 2;
var ALIENCOLUMNS =6; //6
var ALIENROWS =2; //2
var ALIENCOLUMNGAP =2.0;
var ALIENROWGAP =1.5;
var ALIENWIDTH =2.0;
var ALIENROWSHIFT= 0.25;
var FARTHESTALIEN =10.0;

var GRAVITYPOINTX = -13;
var GRAVITYPOINTY = 2;
var GRAVITYPOINTZ = FARTHESTALIEN + 6;

var ASTEROIDNUMBER = 250;
var ASTEROID_XMIN = -20.0;
var ASTEROID_XMAX = 20.0;
var ASTEROID_YMIN = -5.0;
var ASTEROID_YMAX = 20.0;
var ASTEROID_ZMIN = -10.0;
var ASTEROID_ZMAX = 30.0;

var TIMEBETWEENSHOTS = 6000;
var lastShot = 0;

var ALIENSCORE = 100;
var DEATHPENALTY = -50;

var lightsOnStars = 1;
var lightsOnGlobal = 1;
var lightsOnMiner = 1;
var lightPosGlobal = [ 5.0, -10.0, -5.0, 0.0 ];
var lightPosPoint0 = [ 5.0, 10.0, 15.0, 1.0 ];
var lightPosPoint1 = [ -5.0, 10.0, 15.0, 1.0 ];
var lightPosPoint2 = [ 5.0, 10.0, 5.0, 1.0 ];
var lightPosPoint3 = [ -5.0, 10.0, 5.0, 1.0 ];
var lightPosPoint4 = [ 0.0, -10.0, 5.0, 1.0 ];
var lightPosPoint5 = [ 0.0, 10.0, 5.0, 1.0 ];
var lightPosSpot = [ 0.0, 0.0, 0.0, 1.0 ];
var lightDirSpot = [ 0.0, 10.0, 5.0, 0.0 ];
var lightPosGlobalmir = [ 5.0, 0.0, -5.0, 0.0 ];
var lightPosPoint0mir = [ 5.0, -20.0, 15.0, 1.0 ];
var lightPosPoint1mir = [ -5.0, -20.0, 15.0, 1.0 ];
var lightPosPoint2mir = [ 5.0, -20.0, 5.0, 1.0 ];
var lightPosPoint3mir = [ -5.0, -20.0, 5.0, 1.0 ];
var lightPosPoint4mir = [ 0.0, 0.0, 5.0, 1.0 ];
var lightPosPoint5mir = [ 0.0, -20.0, 5.0, 1.0 ];
var lightPosSpotmir = [ 0.0, -10.0, 0.0, 1.0 ];


var timeDelta = 0;
var timeElapsed = 0;
var timePrevious = 0;

var lives = 5;
var score = 0;
var game_running = true;
var lostGame = false;
var wonGame = false;
var pauseWindowShow = false;

var spaceship = [];
var aliens = [];
var alienShots = [];
var spaceshipShots = [];
var asteroids = [];
var explosions = [];

var fog=0;
var adjustedLD, ndc, sunWinCoords, l_pos;

function renderScene(){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	mat4.identity(modelMatrix);
	mat4.identity(viewMatrix);
	mat4.identity(projectionMatrix);
	cameras[currentCamera].doProjection();
	cameras[currentCamera].doView();
	
	gl.useProgram(shaderProgram);
	
	gl.uniform1i(shaderProgram.uniform_foggy, fog);

	
	
	//LIGHTS
	var resstate = [0,0,0];
	resstate[I_DIR] = lightsOnGlobal;
	resstate[I_POINT] = lightsOnStars;
	resstate[I_SPOT] = lightsOnMiner;
	gl.uniform1i(shaderProgram.uniform_lightDirOn, lightsOnGlobal);
	gl.uniform1i(shaderProgram.uniform_lightSpotOn, lightsOnMiner);
	gl.uniform1i(shaderProgram.uniform_lightPointOn, lightsOnStars);
	
	lightPosSpot[0] = spaceship.position.X;
	lightPosSpot[1] = spaceship.position.Y;
	lightPosSpot[2] = spaceship.position.Z;
	lightPosSpotmir[0] = spaceship.position.X;
	lightPosSpotmir[1] = -10.0-spaceship.position.Y;
	lightPosSpotmir[2] = spaceship.position.Z;
	lightPosSpot[3] = 1.0;
	lightDirSpot[0] = spaceship.speedAngleEffectVec.X;
	lightDirSpot[1] = spaceship.speedAngleEffectVec.Y;
	lightDirSpot[2] = spaceship.speedAngleEffectVec.Z;
	lightDirSpot[3] = 0.0;
	
	var res = [];
	mat4.multiplyVec4(viewMatrix, lightPosPoint0, res);   //lightPos WCS -> Camera space
	gl.uniform4fv(shaderProgram.lPos_uniformIdPoint0, res);
	mat4.multiplyVec4(viewMatrix, lightPosPoint1, res);   //lightPos WCS -> Camera space
	gl.uniform4fv(shaderProgram.lPos_uniformIdPoint1, res);
	mat4.multiplyVec4(viewMatrix, lightPosPoint2, res);   //lightPos WCS -> Camera space
	gl.uniform4fv(shaderProgram.lPos_uniformIdPoint2, res);
	mat4.multiplyVec4(viewMatrix, lightPosPoint3, res);   //lightPos WCS -> Camera space
	gl.uniform4fv(shaderProgram.lPos_uniformIdPoint3, res);
	mat4.multiplyVec4(viewMatrix, lightPosPoint4, res);   //lightPos WCS -> Camera space
	gl.uniform4fv(shaderProgram.lPos_uniformIdPoint4, res);
	mat4.multiplyVec4(viewMatrix, lightPosPoint5, res);   //lightPos WCS -> Camera space
	gl.uniform4fv(shaderProgram.lPos_uniformIdPoint5, res);
	mat4.multiplyVec4(viewMatrix, lightPosGlobal, res);   //lightDirection WCS -> Camera space
	gl.uniform4fv(shaderProgram.lPos_uniformIdGlobal, res);
	mat4.multiplyVec4(viewMatrix, lightPosSpot, res);   //lightSpotPos definido em World Coord so it is converted to eye space
	gl.uniform4fv(shaderProgram.lPos_uniformIdSpot, res);
	mat4.multiplyVec4(viewMatrix, lightDirSpot, res);   //lightSpotDir definido em World Coord so it is converted to eye space
	gl.uniform4fv(shaderProgram.lPos_uniformIdSpotDirection, res);
	
	gl.uniform1i(shaderProgram.uniform_shadowOn,0);
	
	
	gl.activeTexture(gl.TEXTURE4);
	gl.bindTexture(gl.TEXTURE_2D, earthTex);
	gl.uniform1i(shaderProgram.tex_loc4, 4);
	gl.uniform1i(shaderProgram.materialTexCount, 4);
	
	for(alieni in aliens){
		aliens[alieni].draw();
	}
	for(shoti in spaceshipShots){
		spaceshipShots[shoti].draw();
	}
	for(shoti in alienShots){
		alienShots[shoti].draw();
	}
	spaceship.draw(true);
	
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SOURCE_ALPHA);
	gl.depthMask(gl.FALSE);
	for(asteroidi in asteroids){
		asteroids[asteroidi].draw();
	}
	for(explosioni in explosions){
		explosions[explosioni].draw();
	}
	gl.depthMask(gl.TRUE);
	
	//COISAS UTEIS PARA O LENS FLARE
	/*
	calculateDerivedMatrices();
	l_pos = [0,0,6,1];
	adjustedLD = [0,0,0,0];
	mat4.multiplyVec4(pvmMatrix,l_pos,adjustedLD);
	//console.log("ALD\n" + adjustedLD);
	//console.log("pvm\n" + pvmMatrix);
	//console.log("pos\n" + l_pos);
	ndc = adjustedLD;
	ndc[0] = adjustedLD[0] / adjustedLD[3];
	ndc[1] = adjustedLD[1] / adjustedLD[3];
	ndc[2] = adjustedLD[2] / adjustedLD[3];
	sunWinCoords = [0,0,0];
	sunWinCoords[0] = gl.viewportWidth / 2.0*ndc[0] + 0 + gl.viewportWidth/2.0;
	sunWinCoords[1] = gl.viewportHeight / 2.0*ndc[1] + 0 + gl.viewportHeight/2.0;
	//using n=0.f, f=1000.f (also used in ortho and perspective)
	sunWinCoords[2] = 0.5*(1000.0-0.1)*ndc[2] + (1000.0 + 0.1)*0.5;
	console.log("a\n"+adjustedLD);
	l_pos = [0,0,5,1];
	adjustedLD = [0,0,0,0];
	mat4.multiplyVec4(pvmMatrix,l_pos,adjustedLD);
	//console.log("ALD\n" + adjustedLD);
	//console.log("pvm\n" + pvmMatrix);
	//console.log("pos\n" + l_pos);
	ndc = adjustedLD;
	ndc[0] = adjustedLD[0] / adjustedLD[3];
	ndc[1] = adjustedLD[1] / adjustedLD[3];
	ndc[2] = adjustedLD[2] / adjustedLD[3];
	sunWinCoords = [0,0,0];
	sunWinCoords[0] = gl.viewportWidth / 2.0*ndc[0] + 0 + gl.viewportWidth/2.0;
	sunWinCoords[1] = gl.rviewportHeight / 2.0*ndc[1] + 0 + gl.viewportHeight/2.0;
	//using n=0.f, f=1000.f (also used in ortho and perspective)
	sunWinCoords[2] = 0.5*(1000.0-0.1)*ndc[2] + (1000.0 + 0.1)*0.5;
	console.log("b\n"+adjustedLD);
	*/
	
	//TEXT
	gl.blendFunc(gl.ONE,gl.ZERO);
	gl.disable(gl.BLEND);
	gl.disable(gl.DEPTH_TEST);
	pushModelMatrix();
	mat4.identity(modelMatrix);
	mat4.identity(viewMatrix);
	mat4.identity(projectionMatrix);
	mat4.ortho(0, gl.viewportWidth, 0, gl.viewportHeight, 0, 1, projectionMatrix);
	gl.uniform1i(shaderProgram.materialTexCount, 5);
	gl.activeTexture(gl.TEXTURE2);
	gl.bindTexture(gl.TEXTURE_2D, fontTex);
	gl.uniform1i(shaderProgram.tex_loc2, 2);
	gl.uniform1i(shaderProgram.texMode_uniformId, 5);
	
	_fontSize = 16;
	initTextureMappedFont();
	DrawString(15,2,"LIVES: "+ lives);
	DrawString(gl.viewportWidth-175,2,"SCORE: "+ score);
	_fontSize = 50;
	initTextureMappedFont();
	if (pauseWindowShow) {
		DrawString(gl.viewportWidth/2-100, gl.viewportHeight/2, "PAUSE");	
	}
	if (wonGame) {
		DrawString(gl.viewportWidth / 2 - 150, gl.viewportHeight / 2, "YOU WON!");
	}
	if (lostGame) {
		DrawString(gl.viewportWidth / 2 - 200, gl.viewportHeight / 2, "GAME OVER");
	}
	_fontSize = 30;
	initTextureMappedFont();
	if (pauseWindowShow) {
		DrawString(gl.viewportWidth / 2 - 200, gl.viewportHeight / 2-30, "Press S to resume");
	}
	if (wonGame | lostGame) {
		DrawString(gl.viewportWidth / 2 - 225, gl.viewportHeight / 2-30, "Press R to restart");
	}
	
	//LIVES
	mat4.identity(modelMatrix);
	mat4.identity(viewMatrix);
	mat4.identity(projectionMatrix);
	mat4.ortho(0, gl.viewportWidth, 0, gl.viewportHeight, -10, 10, projectionMatrix);
	mat4.translate(modelMatrix,[150, 10, 0]);
	mat4.scale(modelMatrix,[10,10,10]);
	for (var ilives = 0; ilives < lives; ilives++) {
		pushModelMatrix();
		mat4.rotate(modelMatrix,rad(-90),[0,1,0]);
		spaceship.draw(false);
		popModelMatrix();
		mat4.translate(modelMatrix,[5,0,0]);
	}
	popModelMatrix();
}

function update(){
	
	if (game_running == true) {
		physics(timeDelta);

		genAlienShots();
		cameras[2].updatePosition(spaceship.position.X, spaceship.position.Y, spaceship.position.Z);
		cameras[2].setCamXYZ(camX, camY, camZ);
		cleanupProjectiles();
		collisions();
		if (lives <= 0) {
			lostGame = true;
			game_running = false;
		}
		if (aliens.length <= 0) {
			wonGame = true;
			game_running = false;
		}
	}
}


function getShader(gl, id) {
	var shaderScript = document.getElementById(id);
	if (!shaderScript)
	return null;
	var str = "";

	var k = shaderScript.firstChild;
	while (k) {
	if (k.nodeType == 3)
		str += k.textContent;
		k = k.nextSibling;
	}
	var shader;
	if (shaderScript.type == "x-shader/x-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}
	gl.shaderSource(shader, str);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		return null;
	}
	return shader;
}

function initShaders() {
	fragmentShader = getShader(gl, "shader-fs");
	vertexShader = getShader(gl, "shader-vs");
	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
		console.log(gl.getProgramInfoLog(shaderProgram));
		alert("Could not initialise shaders");
	}
	gl.useProgram(shaderProgram);
	shaderProgram.vertexposAttribute = gl.getAttribLocation(shaderProgram, "position");
	shaderProgram.normalAttribute = gl.getAttribLocation(shaderProgram, "normal");
	shaderProgram.texcoordAttribute = gl.getAttribLocation(shaderProgram, "texCoord");
	shaderProgram.fontposAttribute = gl.getAttribLocation(shaderProgram, "vVertex");
	shaderProgram.fonttexAttribute = gl.getAttribLocation(shaderProgram, "vtexCoord");
	shaderProgram.tangentAttribute = gl.getAttribLocation(shaderProgram, "tangent");
	
	gl.enableVertexAttribArray(shaderProgram.vertexposAttribute);
	gl.enableVertexAttribArray(shaderProgram.normalAttribute);
	gl.enableVertexAttribArray(shaderProgram.texcoordAttribute);
	
	//têm de ser enabled apenas quando usados, senão dá erro
	//gl.enableVertexAttribArray(shaderProgram.fontposAttribute);
	//gl.enableVertexAttribArray(shaderProgram.fonttexAttribute);
	//por exemplo assim
	//gl.enableVertexAttribArray(shaderProgram.tangentAttribute);
	//... bind tangents, drawElements ...
	//gl.disableVertexAttribArray(shaderProgram.tangentAttribute);
	
	shaderProgram.materialAmbientColorUniform = gl.getUniformLocation(shaderProgram, "matambient");
	shaderProgram.materialDiffuseColorUniform = gl.getUniformLocation(shaderProgram, "matdiffuse");
	shaderProgram.materialSpecularColorUniform = gl.getUniformLocation(shaderProgram, "matspecular");
	shaderProgram.materialShininessUniform = gl.getUniformLocation(shaderProgram, "matshininess");
	shaderProgram.materialTexCount = gl.getUniformLocation(shaderProgram, "mattexCount");
	
	
	shaderProgram.pvm_uniformId = gl.getUniformLocation(shaderProgram, "m_pvm");
	shaderProgram.vm_uniformId = gl.getUniformLocation(shaderProgram, "m_viewModel");
	shaderProgram.normal_uniformId = gl.getUniformLocation(shaderProgram, "m_normal");
	shaderProgram.lPos_uniformIdPoint0 = gl.getUniformLocation(shaderProgram, "l_pospoint0");
	shaderProgram.lPos_uniformIdPoint1 = gl.getUniformLocation(shaderProgram, "l_pospoint1");
	shaderProgram.lPos_uniformIdPoint2 = gl.getUniformLocation(shaderProgram, "l_pospoint2");
	shaderProgram.lPos_uniformIdPoint3 = gl.getUniformLocation(shaderProgram, "l_pospoint3");
	shaderProgram.lPos_uniformIdPoint4 = gl.getUniformLocation(shaderProgram, "l_pospoint4");
	shaderProgram.lPos_uniformIdPoint5 = gl.getUniformLocation(shaderProgram, "l_pospoint5");
	shaderProgram.lPos_uniformIdGlobal = gl.getUniformLocation(shaderProgram, "l_posdir");
	shaderProgram.lPos_uniformIdSpot = gl.getUniformLocation(shaderProgram, "l_posspot");
	shaderProgram.lPos_uniformIdSpotDirection = gl.getUniformLocation(shaderProgram, "l_spotdir");
	shaderProgram.uniform_pointOn = gl.getUniformLocation(shaderProgram, "l_pointOn");
	shaderProgram.uniform_dirOn = gl.getUniformLocation(shaderProgram, "dirOn");
	shaderProgram.uniform_spotOn = gl.getUniformLocation(shaderProgram, "spotOn");
	shaderProgram.uniform_lightPointOn = gl.getUniformLocation(shaderProgram, "lightPointOn");
	shaderProgram.uniform_lightDirOn = gl.getUniformLocation(shaderProgram, "lightDirOn");
	shaderProgram.uniform_lightSpotOn = gl.getUniformLocation(shaderProgram, "lightSpotOn");

	shaderProgram.texMode_uniformId = gl.getUniformLocation(shaderProgram, "texMode");
	shaderProgram.tex_loc0 = gl.getUniformLocation(shaderProgram, "texmap0");
	shaderProgram.tex_loc1 = gl.getUniformLocation(shaderProgram, "texmap1");
	shaderProgram.tex_loc2 = gl.getUniformLocation(shaderProgram, "texmap2");
	shaderProgram.tex_loc3 = gl.getUniformLocation(shaderProgram, "texmap3");
	shaderProgram.tex_loc4 = gl.getUniformLocation(shaderProgram, "texmap4");
	shaderProgram.tex_loc5 = gl.getUniformLocation(shaderProgram, "texmap5");
	shaderProgram.tex_loc6 = gl.getUniformLocation(shaderProgram, "texmap6");
	shaderProgram.tex_loc7 = gl.getUniformLocation(shaderProgram, "texmap7");
	shaderProgram.tex_loc8 = gl.getUniformLocation(shaderProgram, "texmap8");
	shaderProgram.tex_loc9 = gl.getUniformLocation(shaderProgram, "texmap9");
	shaderProgram.tex_loc10 = gl.getUniformLocation(shaderProgram, "texmap10");
	shaderProgram.tex_loc11 = gl.getUniformLocation(shaderProgram, "texmap11");
	shaderProgram.tex_loc12 = gl.getUniformLocation(shaderProgram, "texmap12");
	shaderProgram.tex_loc13 = gl.getUniformLocation(shaderProgram, "texmap13");
	shaderProgram.tex_loc14 = gl.getUniformLocation(shaderProgram, "texmap14");
	shaderProgram.tex_loc15 = gl.getUniformLocation(shaderProgram, "texmap15");

	shaderProgram.uniform_foggy = gl.getUniformLocation(shaderProgram, "fogMode");
	shaderProgram.uniform_shadowOn = gl.getUniformLocation(shaderProgram, "shadowOn");
}

function setupGLDetails(){
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	gl.depthMask(gl.TRUE);
	gl.depthRange(0.0, 1.0);
	gl.clearDepth(1.0);
	gl.enable(gl.CULL_FACE);
	gl.cullFace(gl.BACK);
	gl.frontFace(gl.CCW);
}

function setupThings(){
	ratio = gl.viewportWidth/gl.viewportHeight;
	cameras[0] = new TopOrthoCamera(-6.0* ratio, 6.0* ratio, -6.0, 6.0, 0.1, 1000.0, 0.0, 11.0, 5.0);
	cameras[1] = new FixedPerspCamera(70.0, ratio, 0.1, 1000.0, 0.0, 5.0, -5.0, 0.0, 0.0, 5.0);
	cameras[2] = new FollowPerspCamera(70.0, ratio, 0.1, 1000.0, 0.0, 5.0, -5.0);
	
	
	loadSpaceshipTexture();
	loadSpaceshipBumpTexture();
	loadAlienTexture();
	loadFontTexture();
	loadAsteroidTexture();
	loadCheckerColorsTexture();
	loadCloudTexture();
	loadMetalTexture();
	loadEarthTexture();
	loadExplosionTexture();
	loadFlare2Texture();
	loadFlare4Texture();
	loadFlare5Texture();
	loadEyeTexture();
	loadPortalTexture();
	loadStarsTexture();
	
	loadSpaceship();
	loadAlien();
	loadSpaceshipShot();
	loadAlienShot();
	loadExplosion();
	loadAsteroid();
	
	for(var i = 0; i< ALIENROWS; i++){
		for(var j=0; j<ALIENCOLUMNS; j++){
			aliens.push(new Alien(ALIENCOLUMNS - j*ALIENCOLUMNGAP, 0.0, FARTHESTALIEN - i*ALIENROWGAP, ALIENCOLUMNS - j*ALIENCOLUMNGAP, ALIENWIDTH, ALIENROWSHIFT))
		}
	}
	spaceship = new Spaceship(-5.8, 5.8);
	
	for (iasteroid = 0; iasteroid < ASTEROIDNUMBER; iasteroid++) {
		var iax = ASTEROID_XMIN + Math.random()*(ASTEROID_XMAX-ASTEROID_XMIN);
		var iay = ASTEROID_YMIN + Math.random()*(ASTEROID_YMAX - ASTEROID_YMIN);
		var iaz = ASTEROID_ZMIN + Math.random()*(ASTEROID_ZMAX - ASTEROID_ZMIN);
		asteroids.push(new Asteroid(iax, iay, iaz));
	}
	
}


function cycle(){
	timeElapsed = new Date().getTime();
	timeDelta = timeElapsed - timePrevious;
	timePrevious = timeElapsed;
	requestAnimFrame(cycle);
	if(texturesLeft >0) return;
    update();
	renderScene();
}

function webGLStart() {
	var canvas = document.createElement('canvas');
	canvas.id = "myCanvas";
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	document.body.appendChild(canvas);
	
	document.onkeydown = processKeys;
	document.onkeyup = processUpKeys;
	canvas.onmousedown = handleMouseDown;
	document.onmouseup = handleMouseUp; // capturar fora do canvas
	document.onmousemove = handleMouseMove;

	
	try {
		gl = canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry :-(");
	}
	
	initShaders();
	//initBuffers();
	setupThings();
	setupGLDetails();
	cycle();
}