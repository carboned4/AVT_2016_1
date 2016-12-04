var keyState = Array.apply(null,Array(256)).map(function(x,i){return false;});

var tracking = 0;
var lastMouseX = null;
var lastMouseY = null;

var alpha = 180.0;
var beta = 20.0;
var r = 4.5;

function processKeys(key){
	keyState[key.keyCode] = true;
	switch (key.keyCode) {
	//F
	case 78: if (lightsOnGlobal == 1.0) lightsOnGlobal = 0.0; else lightsOnGlobal = 1.0; break;
	//C
	case 67: if (lightsOnStars == 1.0) lightsOnStars = 0.0; else lightsOnStars = 1.0; break;
	//H
	case 72: if (lightsOnMiner == 1.0) lightsOnMiner = 0.0; else lightsOnMiner = 1.0; break;
	//F
	case 70: if (fog == 1) fog = 0; else fog = 1; break;
	}
	passKeys();
}

function processUpKeys(key)
{
	keyState[key.keyCode] = false;
	passKeys();
}

function passKeys() {
	if (keyState[49]) {
		currentCamera = 0;
	}
	if (keyState[50]) {
		currentCamera = 1;
	}
	if (keyState[51]) {
		currentCamera = 2;
	}
	if (keyState[66]) {
		if(game_running){
			spaceshipShots.push(new SpaceshipShot(spaceship.position.X, spaceship.position.Y, spaceship.position.Z + 1.5));
			playMissile();
		}
	}
	if (keyState[83]) {							//Toggle pausewindow on or off
		if (!wonGame && !lostGame) {
			game_running = !(game_running);
			pauseWindowShow = !(pauseWindowShow);
		}
	}

	if (keyState[82]) {
		if (wonGame || lostGame) {
			restartGame();
			game_running = true;
			wonGame = false;
			lostGame = false;
			pauseWindowShow = false;
		}
	}

		
	spaceship.updateKeys(keyState[37], keyState[39]);
}

function handleMouseDown(event) {
	mouseDown = true;
	lastMouseX = event.clientX;
	lastMouseY = event.clientY;
	if(event.which==1){
        tracking = 1;
    }
	else if(event.which==3){
        tracking = 2;
    }
}
function handleMouseUp(event) {
	if (tracking == 1) {
		alpha -= (event.clientX - lastMouseX);
		beta += (event.clientY - lastMouseY);
		if (beta > 60.0)
			beta = 60.0;
		else if (beta < -10.0)
			beta = -10.0;
	}
	else if (tracking == 2) {
		r += (event.clientY - lastMouseY) * 0.01;
		if (r < 0.5)
			r = 0.5;
	}
	tracking = 0;
}
function handleMouseMove(event) {
	//if (!mouseDown) return;
	var newX = event.clientX;
	var newY = event.clientY;
	var deltaX = -newX + lastMouseX;
	var deltaY = newY - lastMouseY;
	
	var alphaAux = alpha;
	var betaAux = beta;
	var rAux = r;
	if (tracking == 1) {
		alphaAux = alpha + deltaX;
		betaAux = beta + deltaY;
		if (betaAux > 60.0)
			betaAux = 60.0;
		else if (betaAux < -10.0)
			betaAux = -10.0;
		rAux = r;
	}
	// right mouse button: zoom
	else if (tracking == 2) {
		alphaAux = alpha;
		betaAux = beta;
		rAux = r + (deltaY * 0.01);
		if (rAux < 0.5)
			rAux = 0.5;
	}
	camX = rAux * Math.sin(alphaAux * 3.14 / 180.0) * Math.cos(betaAux * 3.14 / 180.0);
	camZ = rAux * Math.cos(alphaAux * 3.14 / 180.0) * Math.cos(betaAux * 3.14 / 180.0);
	camY = rAux *   						       Math.sin(betaAux * 3.14 / 180.0);
	
	
 }

 