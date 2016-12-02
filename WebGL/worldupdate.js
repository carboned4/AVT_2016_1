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
}

function cleanupProjectiles(){

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