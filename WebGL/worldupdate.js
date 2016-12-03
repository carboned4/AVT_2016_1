function physics(delta){
	spaceship.update(delta);
	for(alieni in aliens){
		//console.log(aliens[alieni]);
		aliens[alieni].update(delta);
	}
	for(explosioni in explosions){
		explosions[explosioni].update(delta);
	}
	for(shoti in spaceshipShots){
		spaceshipShots[shoti].update(delta);
	}
	for(shoti in alienShots){
		alienShots[shoti].update(delta);
	}
	planet.update(delta);
}

function restartGame(){
	lives = 5;
	score = 0;
	alienShots = [];
	spaceshipShots = [];
	aliens = [];
	explosions = [];
	spaceship.speed.set(0.0, 0.0, 0.0);
	spaceship.position.set(0.0,0.0,0.0);
	for (var i = 0; i < ALIENROWS; i++) {
		for (var j = 0; j < ALIENCOLUMNS; j++) {
			aliens.push(new Alien(ALIENCOLUMNS - j*ALIENCOLUMNGAP, 0.0, 10.0 - i*ALIENROWGAP, ALIENCOLUMNS - j*ALIENCOLUMNGAP, ALIENWIDTH, ALIENROWSHIFT)); // x y z left width rowgap
		}
	}
}

function cleanupProjectiles(){
	var shotz;
	for (shoti = 0; shoti < alienShots.length; ) {
		shotz = alienShots[shoti].position.Z;
		if (shotz < -10.0) {
			alienShots.splice(shoti,1);
		}
		else {
			++shoti;
		}
	}
	for (shoti = 0; shoti < spaceshipShots.length; ) {
		shotz = spaceshipShots[shoti].position.Z;
		if (shotz > FARTHESTALIEN+10.0) {
			spaceshipShots.splice(shoti,1);
		}
		else {
			++shoti;
		}
	}
	for (var explosioni = 0; explosioni < explosions.length;) {
		var lifel = explosions[explosioni].lifeLeft;
		if (lifel <= 0.0) {
			explosions.splice(explosioni,1);
		}
		else {
			++explosioni;
		}
	}
}

function collisions(){
	var shipcollided = false;
	for (var i = 0; i < alienShots.length; i++) {
		shipcollided = spaceship.checkCollisionShot(alienShots[i]);
		if (shipcollided) {
			//CREATE EXPLOSION
			explosions.push(new Explosion(
					spaceship.position.X, spaceship.position.Y, spaceship.position.Z,
					spaceship.speed.X/2, 0.0, -1.0,
					GRAVITYPOINTX, GRAVITYPOINTY, GRAVITYPOINTZ));
			alienShots.splice(i,1);
			score += DEATHPENALTY;
			break;
		}
	}

	if (shipcollided) lives--;

	
	for (var alieni = 0; alieni < aliens.length;) {
		var erasedAlien = false;
		if(aliens[alieni].position.Z <= 2.5){
			lives = 0;
			break;
		}
		for (j = 0; j < spaceshipShots.length; j++) {
			var aliencollided = aliens[alieni].checkCollisionShot(spaceshipShots[j]);
			if (aliencollided) {
				var deadalienpos = aliens[alieni].position;
				var deadalienspeed = aliens[alieni].speed;
				//CREATE EXPLOSION
				explosions.push(new Explosion(
						deadalienpos.X, deadalienpos.Y, deadalienpos.Z,
						deadalienspeed.X, deadalienspeed.Y, deadalienspeed.Z,
						GRAVITYPOINTX, GRAVITYPOINTY, GRAVITYPOINTZ));
				aliens.splice(alieni,1);
				spaceshipShots.splice(j,1);
				erasedAlien = true;
				score += ALIENSCORE;
				break;
			}
		}
		if (!erasedAlien) {
			
			++alieni;
		}
	}
}

function genAlienShots(){
	if (aliens.length == 0) return;
	if (timeElapsed-lastShot >= TIMEBETWEENSHOTS ) {
		var output = parseInt(Math.random()*aliens.length);
		alienShots.push(new AlienShot(aliens[output].position.X, aliens[output].position.Y, aliens[output].position.Z - 0.5));
		lastShot = timeElapsed;
		//printf("%d %d\n", objId, objIdAlienShot);
	}
}