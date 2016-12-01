function physics(delta){
	spaceship.update(delta);
	for(alieni in aliens){
		//console.log(aliens[alieni]);
		aliens[alieni].update(delta);
	}
}