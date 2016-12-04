var audioStriderDie;
var audioStriderPains = [0,0,0,0];
var backgroundmusic;
var missileSound;
var striderShotSound;
var wastedSound;
var backgroundvolume = 0.15;

function loadSounds(){
	audioStriderDie = new Audio('sounds/striderdie.mp3');
	audioStriderPains[0] = new Audio('sounds/striderpain2.mp3');
	audioStriderPains[1] = new Audio('sounds/striderpain5.mp3');
	audioStriderPains[2] = new Audio('sounds/striderpain7.mp3');
	audioStriderPains[3] = new Audio('sounds/striderpain8.mp3');
	audioStriderPains[0].volume = 0.25;
	audioStriderPains[1].volume = 0.25;
	audioStriderPains[2].volume = 0.25;
	audioStriderPains[3].volume = 0.25;
	backgroundmusic = new Audio('sounds/hl2.mp3');
	backgroundmusic.volume = backgroundvolume;
	backgroundmusic.loop = true;
	backgroundmusic.play();
	missileSound = new Audio('sounds/missile.mp3');
	striderShotSound = new Audio('sounds/stridershot.mp3');
	wastedSound = new Audio('sounds/gta5wasted.mp3');
	
}

function playStriderDie(){
	var newaudioStriderDie = audioStriderDie.cloneNode();
	newaudioStriderDie.volume = 0.5;
	newaudioStriderDie.play();
}

function playWasted(){
	var newwastedSound = wastedSound.cloneNode();
	newwastedSound.volume = 0.75;
	newwastedSound.play();
}

function playStriderPain(){
	var paintoplay = audioStriderPains[Math.floor(Math.random()*4)];
	paintoplay.play();
}

function playMissile(){
	var newmissilesound = missileSound.cloneNode();
	newmissilesound.volume = 0.15;
	newmissilesound.play();
}

function playStriderShot(){
	var newstriderShotSound = striderShotSound.cloneNode();
	newstriderShotSound.volume = 0.1;
	newstriderShotSound.play();
}