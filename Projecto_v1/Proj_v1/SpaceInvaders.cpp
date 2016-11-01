
#include <iostream>
#include <vector>
#include <sstream>
#include <string>
#include <math.h>
//using namespace std
#include "GL/glew.h"
#include "GL/freeglut.h"

#include "AVTmathLib.h"
#include "vsShaderLib.h"
#include "TGA.h"
#include "VertexAttrDef.h"

#include "Alien.h"
#include "Spaceship.h"
#include "Alien_Shot.h"
#include "Spaceship_Shot.h"

#include "StarsBackground.h"

#include "Camera.h"
#include "TopOrthoCamera.h"
#include "FixedPerspCamera.h"
#include "FollowPerspCamera.h"


#define CAPTION "Exercise 2"
#define ALIENCOLUMNS 6
#define ALIENROWS 2
#define ALIENCOLUMNGAP 2.0f
#define ALIENROWGAP 1.5f
#define ALIENWIDTH 2.0f
#define ALIENROWSHIFT 0.25f
#define TIMEBETWEENSHOTS 6000

#define I_POINT 0
#define I_DIR 1
#define I_SPOT 2

#define ALIENSCORE 100
#define DEATHPENALTY -50

std::string shadername("phong");
// gouraud  blinnphong  pointlight

int WinX = 640, WinY = 480;
int WindowHandle = 0;
unsigned int FrameCount = 0;
int TargetFramerate = 60;
float ratio = (WinX*1.0f) / WinY;

int timeElapsed = 0;
int timePrevious = 0;
int timeDelta = 0;
int timePause = 0;
int lastTime = 0;
int timeAlpha = 0;

int lives = 5;
int score = 0;

#define VERTEX_COORD_ATTRIB 0
#define NORMAL_ATTRIB 1
#define TEXTURE_COORD_ATTRIB 2

struct MyMesh mesh[1000];
int objId = 0; //id of the object mesh - to be used as index of mesh: mesh[objID] means the current mesh
int objIdInc = 0;
int objIdAlien = -1;
int objIdShip = -1;
int objIdAlienShot = -1;
int objIdShipShot = -1;
int objIdStars = -1;
int objIdPause = -1;
int objIdDead = -1;
int objIdVictory = -1;

GLuint VertexShaderId, FragmentShaderId, ProgramId;
//GLint UniformId;
VSShaderLib shader;
GLint pvm_uniformId;
GLint vm_uniformId;
GLint normal_uniformId;

//luzes
GLint lPos_uniformIdPoint0, lPos_uniformIdPoint1, lPos_uniformIdPoint2,
lPos_uniformIdPoint3, lPos_uniformIdPoint4, lPos_uniformIdPoint5;
GLint lPos_uniformIdGlobal;
GLint lPos_uniformIdSpot;
GLint lPos_uniformIdSpotDirection;
GLint uniform_pointOn, uniform_dirOn, uniform_spotOn;
GLint uniform_lightState;
float lightsOnStars = 1.0f;
float lightsOnGlobal = 1.0f;
float lightsOnMiner = 1.0f;
float lightPosGlobal[4] = { 5.0f, -10.0f, -5.0f, 0.0f };
float lightPosPoint0[4] = { 5.0f, 10.0f, 15.0f, 1.0f };
float lightPosPoint1[4] = { -5.0f, 10.0f, 15.0f, 1.0f };
float lightPosPoint2[4] = { 5.0f, 5.0f, 5.0f, 1.0f };
float lightPosPoint3[4] = { -5.0f, 5.0f, 5.0f, 1.0f };
float lightPosPoint4[4] = { 0.0f, -10.0f, 5.0f, 1.0f };
float lightPosPoint5[4] = { 0.0f, 10.0f, 5.0f, 1.0f };
float lightPosSpot[4] = { 0.0f, 0.0f, 0.0f, 1.0f };
float lightDirSpot[4] = { 0.0f, 0.0f, 1.0f, 0.0f };

//texturas
GLint tex_loc0, tex_loc1, tex_loc2, tex_loc3, tex_loc4;
// star BG1, star BG2, font1, none, none;
GLint tex_loc5, tex_loc6, tex_loc7, tex_loc8, tex_loc9;
//nothing yet
GLint texMode_uniformId;
GLuint TextureArray[5];

extern float mMatrix[COUNT_MATRICES][16];
extern float mCompMatrix[COUNT_COMPUTED_MATRICES][16];
extern float mNormal3x3[9];

bool projectionIsPerspective = true;


// TEXT THINGS
int _fontSize;
GLuint text_vaoID;
GLuint text_texCoordBuffer;
GLuint text_vertexBuffer;
GLint doingText_uniformId;
GLint doingTextV_uniformId;


// Camera Position+
Camera *currentCamera;
FixedPerspCamera *fixedCam;
TopOrthoCamera *orthoCam;
FollowPerspCamera *followCam;
float camX, camY, camZ;

// Mouse/beyboard Tracking Variables
int startX, startY, tracking = 0;
bool keyState[256];
bool keyLeft = false;
bool keyRight = false;

// Camera Spherical Coordinates
float alpha = 180.0f, beta = 10.0f;
float r = 2.6f;
float camPos[3];
float objPos[3];

// Frame counting and FPS computation
long myTime, timebase = 0, frame = 0;
char s[32];

//Game

bool game_running = true;
bool pauseWindowShow = false;

std::vector <Alien*> Aliens;
Spaceship *spaceship;
Alien_Shot *alienshot;
Spaceship_Shot * spaceshipShot;
std::vector <Spaceship_Shot*> spaceshipShotVector;
std::vector <Alien_Shot*> alienShotVector;
StarsBackground *background1;
std::vector <Spaceship*> LivesRepresentation;


/////////////////////////////////////////////////////////////////////// ERRORS

bool isOpenGLError() {
	bool isError = false;
	GLenum errCode;
	const GLubyte *errString;
	while ((errCode = glGetError()) != GL_NO_ERROR) {
		isError = true;
		errString = gluErrorString(errCode);
		std::cerr << "OpenGL ERROR [" << errString << "]." << std::endl;
	}
	return isError;
}

void checkOpenGLError(std::string error)
{
	if(isOpenGLError()) {
		std::cerr << error << std::endl;
		exit(EXIT_FAILURE);
	}
}

/////////////////////////////////////////////////////////////////////// SHADERs


void initTextureMappedFont() {
	float text_vertices[] = {
		0.0f, 0.0f,
		_fontSize, 0.0f,
		_fontSize, _fontSize,
		0.0f, _fontSize
	};

	glGenVertexArrays(1, &text_vaoID);
	glBindVertexArray(text_vaoID);
	glGenBuffers(1, &text_vertexBuffer);
	glBindBuffer(GL_ARRAY_BUFFER, text_vertexBuffer);
	glBufferData(GL_ARRAY_BUFFER, sizeof(GLfloat) * 8, &text_vertices[0], GL_STATIC_DRAW);
	glEnableVertexAttribArray(VERTEX_ATTRIB1);
	glVertexAttribPointer(VERTEX_ATTRIB1, 2, GL_FLOAT, GL_FALSE, 0, 0);

	//Just initialize with something for now, the tex coords are updated
	//for each character printed
	float text_texCoords[] = {
		0.0f, 0.0f,
		0.0f, 0.0f,
		0.0f, 0.0f,
		0.0f, 0.0f
	};

	glGenBuffers(1, &text_texCoordBuffer);
	glBindBuffer(GL_ARRAY_BUFFER, text_texCoordBuffer);
	glBufferData(GL_ARRAY_BUFFER, sizeof(GLfloat) * 8, &text_texCoords[0], GL_DYNAMIC_DRAW);
	glEnableVertexAttribArray(VERTEX_ATTRIB2);
	glVertexAttribPointer(VERTEX_ATTRIB2, 2, GL_FLOAT, GL_FALSE, 0, 0);

	//set the orthographic projection matrix
	//ortho(0.0f, float(WinX), 0.0f, float(WinY), -1.0f, 1.0f);
}

void DrawString(float x, float y, const std::string& str) {

	float text_texCoords[8];

	pushMatrix(MODEL);
	translate(MODEL, x, y, 0);
	glBindVertexArray(text_vaoID);
	// glTranslatef(x, y, 0.0); //Position our text
	for (std::string::size_type i = 0; i < str.size(); ++i)
	{
		const float aux = 1.0f / 16.0f;

		int ch = int(str[i]);
		float xPos = float(ch % 16) * aux;
		float yPos = float(ch / 16) * aux;

		text_texCoords[0] = xPos;
		text_texCoords[1] = 1.0f - yPos - aux;

		text_texCoords[2] = xPos + aux;
		text_texCoords[3] = 1.0f - yPos - aux;

		text_texCoords[4] = xPos + aux;
		text_texCoords[5] = 1.0f - yPos - 0.001f;

		text_texCoords[6] = xPos;
		text_texCoords[7] = 1.0f - yPos - 0.001f;

		glBindBuffer(GL_ARRAY_BUFFER, text_texCoordBuffer);
		glBufferSubData(GL_ARRAY_BUFFER, 0, sizeof(float) * 8, &text_texCoords[0]);

		computeDerivedMatrix(PROJ_VIEW_MODEL);
		glUniformMatrix4fv(pvm_uniformId, 1, GL_FALSE, mCompMatrix[PROJ_VIEW_MODEL]);

		glDrawArrays(GL_TRIANGLE_FAN, 0, 4);

		translate(MODEL, _fontSize * 0.8f, 0.0f, 0.0f);
	}
	glBindVertexArray(0);
	popMatrix(MODEL);

	glEnable(GL_DEPTH_TEST);
}


void destroyShaderProgram()
{
	glUseProgram(0);
	glDetachShader(ProgramId, VertexShaderId);
	glDetachShader(ProgramId, FragmentShaderId);

	glDeleteShader(FragmentShaderId);
	glDeleteShader(VertexShaderId);
	glDeleteProgram(ProgramId);

	checkOpenGLError("ERROR: Could not destroy shaders.");
}

GLuint setupShaders() {
	// Shader for models
	shader.init();
	shader.loadShader(VSShaderLib::VERTEX_SHADER, "shaders/"+shadername+".vert");
	shader.loadShader(VSShaderLib::FRAGMENT_SHADER, "shaders/"+shadername+".frag");
	// set semantics for the shader variables
	glBindFragDataLocation(shader.getProgramIndex(), 0, "colorOut");
	glBindAttribLocation(shader.getProgramIndex(), VERTEX_COORD_ATTRIB, "position");
	glBindAttribLocation(shader.getProgramIndex(), NORMAL_ATTRIB, "normal");
	glBindAttribLocation(shader.getProgramIndex(), TEXTURE_COORD_ATTRIB, "texCoord");
	glBindAttribLocation(shader.getProgramIndex(), VERTEX_ATTRIB1, "vVertex");
	glBindAttribLocation(shader.getProgramIndex(), VERTEX_ATTRIB2, "vtexCoord");

	glLinkProgram(shader.getProgramIndex());

	pvm_uniformId = glGetUniformLocation(shader.getProgramIndex(), "m_pvm");
	vm_uniformId = glGetUniformLocation(shader.getProgramIndex(), "m_viewModel");
	normal_uniformId = glGetUniformLocation(shader.getProgramIndex(), "m_normal");
	lPos_uniformIdPoint0 = glGetUniformLocation(shader.getProgramIndex(), "l_pospoint0");
	lPos_uniformIdPoint0 = glGetUniformLocation(shader.getProgramIndex(), "l_pospoint1");
	lPos_uniformIdPoint0 = glGetUniformLocation(shader.getProgramIndex(), "l_pospoint2");
	lPos_uniformIdPoint0 = glGetUniformLocation(shader.getProgramIndex(), "l_pospoint3");
	lPos_uniformIdPoint0 = glGetUniformLocation(shader.getProgramIndex(), "l_pospoint4");
	lPos_uniformIdPoint0 = glGetUniformLocation(shader.getProgramIndex(), "l_pospoint5");
	lPos_uniformIdGlobal = glGetUniformLocation(shader.getProgramIndex(), "l_posdir");
	lPos_uniformIdSpot = glGetUniformLocation(shader.getProgramIndex(), "l_posspot");
	lPos_uniformIdSpotDirection = glGetUniformLocation(shader.getProgramIndex(), "l_spotdir");
	uniform_pointOn = glGetUniformLocation(shader.getProgramIndex(), "l_pointOn");
	uniform_dirOn = glGetUniformLocation(shader.getProgramIndex(), "dirOn");
	uniform_spotOn = glGetUniformLocation(shader.getProgramIndex(), "spotOn");
	uniform_lightState = glGetUniformLocation(shader.getProgramIndex(), "lightState");

	texMode_uniformId = glGetUniformLocation(shader.getProgramIndex(), "texMode");
	tex_loc0 = glGetUniformLocation(shader.getProgramIndex(), "texmap0");
	tex_loc1 = glGetUniformLocation(shader.getProgramIndex(), "texmap1");
	tex_loc2 = glGetUniformLocation(shader.getProgramIndex(), "texmap2");
	tex_loc3 = glGetUniformLocation(shader.getProgramIndex(), "texmap3");
	tex_loc4 = glGetUniformLocation(shader.getProgramIndex(), "texmap4");

	doingText_uniformId = glGetUniformLocation(shader.getProgramIndex(), "doingText");
	doingTextV_uniformId = glGetUniformLocation(shader.getProgramIndex(), "dointtextv2");

	printf("InfoLog for Hello World Shader\n%s\n\n", shader.getAllInfoLogs().c_str());

	return(shader.isProgramValid());
}

/////////////////////////////////////////////////////////////////////// VAOs & VBOs



void renderScene()
{
	//estes já são feitos no display()
	//FrameCount++;
	//glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

	loadIdentity(VIEW);
	loadIdentity(MODEL);
	loadIdentity(PROJECTION);

	//CAMERAS
	currentCamera->doProjection();
	currentCamera->doView();
	glUseProgram(shader.getProgramIndex());


	//LIGHTS
	//glUniform4fv(lPos_uniformIdPoint0, 1, lightPos); //efeito capacete do mineiro, ou seja lighPos foi definido em eye coord 
	float resstate[3];
	resstate[I_DIR] = lightsOnGlobal;
	resstate[I_POINT] = lightsOnStars;
	resstate[I_SPOT] = lightsOnMiner;
	glUniform3fv(uniform_lightState, 1, resstate);
	
	float res[4];
	multMatrixPoint(VIEW, lightPosPoint0, res);   //lightPos WCS -> Camera space
	glUniform4fv(lPos_uniformIdPoint0, 1, res);
	multMatrixPoint(VIEW, lightPosPoint1, res);   //lightPos WCS -> Camera space
	glUniform4fv(lPos_uniformIdPoint1, 1, res);
	multMatrixPoint(VIEW, lightPosPoint2, res);   //lightPos WCS -> Camera space
	glUniform4fv(lPos_uniformIdPoint2, 1, res);
	multMatrixPoint(VIEW, lightPosPoint3, res);   //lightPos WCS -> Camera space
	glUniform4fv(lPos_uniformIdPoint3, 1, res);
	multMatrixPoint(VIEW, lightPosPoint4, res);   //lightPos WCS -> Camera space
	glUniform4fv(lPos_uniformIdPoint4, 1, res);
	multMatrixPoint(VIEW, lightPosPoint5, res);   //lightPos WCS -> Camera space
	glUniform4fv(lPos_uniformIdPoint5, 1, res);
	
	multMatrixPoint(VIEW, lightPosGlobal, res);   //lightDirection WCS -> Camera space
	glUniform4fv(lPos_uniformIdGlobal, 1, res);
	
	lightPosSpot[0] = spaceship->getPosition().getX();
	lightPosSpot[1] = spaceship->getPosition().getY();
	lightPosSpot[2] = spaceship->getPosition().getZ();
	lightPosSpot[3] = 1.0f;
	multMatrixPoint(VIEW, lightPosSpot, res);   //lightSpotPos definido em World Coord so it is converted to eye space
	glUniform4fv(lPos_uniformIdSpot, 1, res);
	lightDirSpot[0] = spaceship->getSpeedAngle().getX();
	lightDirSpot[1] = spaceship->getSpeedAngle().getY();
	lightDirSpot[2] = spaceship->getSpeedAngle().getZ();
	lightDirSpot[3] = 0.0f;
	multMatrixPoint(VIEW, lightDirSpot, res);   //lightSpotDir definido em World Coord so it is converted to eye space
	glUniform4fv(lPos_uniformIdSpotDirection, 1, res);

	//TEXTURES
	//Associar os Texture Units aos Objects Texture
	//stone.tga loaded in TU0; checker.tga loaded in TU1;  lightwood.tga loaded in TU2
	glActiveTexture(GL_TEXTURE0);
	glBindTexture(GL_TEXTURE_2D, TextureArray[0]);
	glActiveTexture(GL_TEXTURE1);
	glBindTexture(GL_TEXTURE_2D, TextureArray[1]);
	glActiveTexture(GL_TEXTURE2);
	glBindTexture(GL_TEXTURE_2D, TextureArray[2]);
	glActiveTexture(GL_TEXTURE3);
	glBindTexture(GL_TEXTURE_2D, TextureArray[3]);
	glActiveTexture(GL_TEXTURE4);
	glBindTexture(GL_TEXTURE_2D, TextureArray[4]);
	//Indicar aos tres samplers do GLSL quais os Texture Units a serem usados
	glUniform1i(tex_loc0, 0);
	glUniform1i(tex_loc1, 1);
	glUniform1i(tex_loc2, 2);
	glUniform1i(tex_loc2, 3);
	glUniform1i(tex_loc2, 4);

	
	//OBJECTS
	spaceship->draw(shader);
	for (int i = 0; i < Aliens.size(); i++) {
		Aliens[i]->draw(shader);
	}
	for (int i = 0; i < spaceshipShotVector.size(); i++) {
		spaceshipShotVector[i]->draw(shader);
	}
	for (int i = 0; i < alienShotVector.size(); i++) {
		alienShotVector[i]->draw(shader);
	}
	background1->draw(shader);


	// H U D
	glDisable(GL_DEPTH_TEST);
	pushMatrix(MODEL);
	loadIdentity(VIEW);
	loadIdentity(MODEL);
	loadIdentity(PROJECTION);
	ortho(0, WinX, 0, WinY, 0, 1);
	glUniform1i(texMode_uniformId, 5);

	_fontSize = 20;
	std::string s = "LIVES:" + std::to_string(lives);
	DrawString(15, 2, s);

	s = "SCORE:" + std::to_string(score);
	DrawString(WinX - 175, 2, s);

	if (pauseWindowShow == true) {
		_fontSize = 50;
		s = "PAUSE";
		DrawString(WinX-410, 230, s);
		
	}

	glDisable(GL_DEPTH_TEST);
	loadIdentity(VIEW);
	loadIdentity(MODEL);
	loadIdentity(PROJECTION);
	ortho(0, WinX, 0, WinY, -5, 5);

	translate(MODEL, 175, 10, 0.0);
	scale(MODEL, 10.0, 10.0, 10.0);
	for (int ilives = 0; ilives < lives; ilives++) {
		LivesRepresentation[ilives]->draw(shader);
	}

	popMatrix(MODEL);
	glEnable(GL_DEPTH_TEST);


	//este já é feito no display
	//glutSwapBuffers();
	checkOpenGLError("ERROR: Could not draw scene.");
}

void switchFramerate() {
	if (TargetFramerate == 30) TargetFramerate = 60;
	else if (TargetFramerate == 60) TargetFramerate = 120;
	else if (TargetFramerate == 120) TargetFramerate = 30;
}

void restartGame() {
	
	lives = 5;
	score = 0;
	alienShotVector.clear();
	spaceshipShotVector.clear();
	Aliens.clear();
	for (int i = 0; i < ALIENROWS; i++) {
		for (int j = 0; j < ALIENCOLUMNS; j++) {
			if (objIdAlien == -1) {
				objIdAlien = objId;
				Aliens.push_back(new Alien(objIdAlien, &objIdInc, ALIENCOLUMNS - j*ALIENCOLUMNGAP, 0.0f, 10.0f - i*ALIENROWGAP, ALIENCOLUMNS - j*ALIENCOLUMNGAP, ALIENWIDTH, ALIENROWSHIFT)); // x y z left width rowgap
				objId += objIdInc;
			}
			else Aliens.push_back(new Alien(objIdAlien, &objIdInc, ALIENCOLUMNS - j*ALIENCOLUMNGAP, 0.0f, 10.0f - i*ALIENROWGAP, ALIENCOLUMNS - j*ALIENCOLUMNGAP, ALIENWIDTH, ALIENROWSHIFT)); // x y z left width rowgap
		}
	}
}


void passKeys() {
	if (keyState['1']) {
		currentCamera = orthoCam;
	}
	if (keyState['2']) {
		currentCamera = fixedCam;
	}
	if (keyState['3']) {
		currentCamera = followCam;
	}
	if (keyState['b']) {
		if (objIdShipShot == -1) {
			objIdShipShot = objId;
			spaceshipShotVector.push_back(new Spaceship_Shot(objIdShipShot, &objIdInc, spaceship->position.getX(), spaceship->position.getY(), spaceship->position.getZ() + 0.1f));
			objId += objIdInc;
		}
		else spaceshipShotVector.push_back(new Spaceship_Shot(objIdShipShot, &objIdInc, spaceship->position.getX(), spaceship->position.getY(), spaceship->position.getZ() + 0.1f));
		//printf("%d %d\n", objId, objIdShipShot);
	}
	if (keyState['s']) {
											//Toggle pausewindow on or off
		game_running = !(game_running);
		pauseWindowShow = !(pauseWindowShow);
	}

	if (keyState['r']) {
		//Toggle pausewindow on or off
		game_running = true;
		pauseWindowShow = false;
	}

		
	spaceship->updateKeys(keyLeft, keyRight);
}

void physics() {
	spaceship->update(timeDelta);

	for (int i = 0; i < Aliens.size(); i++) {
		Aliens[i]->update(timeDelta);
	}

	for (int i = 0; i < spaceshipShotVector.size(); i++) {
		spaceshipShotVector[i]->update(timeDelta);
	}

	for (int i = 0; i < alienShotVector.size(); i++) {
		alienShotVector[i]->update(timeDelta);
	}

}

void alienShots() {
	timeAlpha = timeElapsed - lastTime;
	if (Aliens.size() == 0) return;
	if (timeAlpha >= TIMEBETWEENSHOTS ) {
		int output = 0 + (rand() % (int)(Aliens.size()));
		if (objIdAlienShot == -1) {
			objIdAlienShot = objId;
			alienShotVector.push_back(new Alien_Shot(objIdAlienShot, &objIdInc, Aliens[output]->position.getX(), Aliens[output]->position.getY(), Aliens[output]->position.getZ() - 0.1f));
			objId += objIdInc;
		}
		else alienShotVector.push_back(new Alien_Shot(objIdAlienShot, &objIdInc, Aliens[output]->position.getX(), Aliens[output]->position.getY(), Aliens[output]->position.getZ() - 0.1f));
		lastTime = timeElapsed;
		//printf("%d %d\n", objId, objIdAlienShot);
	}
}
void collisions() {
	bool shipcollided = false;
	for (int i = 0; i < alienShotVector.size(); i++) {
		shipcollided = spaceship->checkCollisionShot(alienShotVector[i]->getPosition(), alienShotVector[i]->getCollisionBox());
		if (shipcollided) {
			alienShotVector.erase(alienShotVector.begin() + i);
			score += DEATHPENALTY;
			break;
		}
	}

	if (shipcollided) lives--;

	bool aliencollided;
	//printf("size shot %d %d\n", spaceshipShotVector.size(), Aliens.size());
	//printf("lol\n");
	std::vector<Alien*>::iterator iterAliens;
	int i = 0;
	for (iterAliens = Aliens.begin(); iterAliens != Aliens.end();) {
		bool erasedAlien = false;
		//printf("index shot %d %f\n", i, (*iterAliens)->getPosition().getX());
		for (int j = 0; j < spaceshipShotVector.size(); j++) {
			aliencollided = (*iterAliens)->checkCollisionShot(spaceshipShotVector[j]->getPosition(), spaceshipShotVector[j]->getCollisionBox());
			if (aliencollided) {
				(*iterAliens)->setDestroyed(true);
				iterAliens = Aliens.erase(iterAliens);
				spaceshipShotVector.erase(spaceshipShotVector.begin() + j);
				erasedAlien = true;
				score += ALIENSCORE;
				break;
			}
		}
		if (!erasedAlien) {
			
			++iterAliens;
		}
		//++iterAliens;
		i++;
	}
	//printf("iteraliens cycle done %d\n", Aliens.size());
	
}

void cleanupShots() {
	std::vector<Alien_Shot*>::iterator iterShots;
	std::vector<Spaceship_Shot*>::iterator iterShotsb;
	float shotz;
	for (iterShots = alienShotVector.begin(); iterShots != alienShotVector.end(); ) {
		shotz = (*iterShots)->getPosition().getZ();
			if (shotz < -1.0f) {
				iterShots = alienShotVector.erase(iterShots);
			}
			else {
				++iterShots;
			}
	}
	for (iterShotsb = spaceshipShotVector.begin(); iterShotsb != spaceshipShotVector.end(); ) {
		shotz = (*iterShotsb)->getPosition().getZ();
		if (shotz > 15.0f) {
			iterShotsb = spaceshipShotVector.erase(iterShotsb);
		}
		else {
			++iterShotsb;
		}
	}
}

void update() {
	timeElapsed = glutGet(GLUT_ELAPSED_TIME);
	timeDelta = timeElapsed - timePrevious;
	timePrevious = timeElapsed;

	if (pauseWindowShow != true) {
		//passKeys();
		physics();

		//printf("entering alienshots\n");
		alienShots();
		//printf("left alienshots\n");
		followCam->updatePosition(spaceship->position.getX(), spaceship->position.getY(), spaceship->position.getZ());
		followCam->setCamXYZ(camX, camY, camZ);
		cleanupShots();
		collisions();
		if (lives <= 0) restartGame();
	}
	/*if (!game_running) {
		//increase_speed = false;
		timeDelta = 0;
	}*/
}

///////////////// USER INTERACTION
/* //ESTAS TRES NAO FUNCIONAM BEM NAO SEI PORQUE
void processMouseButtons(int button, int state, int xx, int yy) {
	followCam->processMouseButtons(button, state, xx, yy);
	glutPostRedisplay();
}

void processMouseMotion(int xx, int yy) {
	followCam->processMouseMotion(xx, yy);
	glutPostRedisplay();
	glutPostRedisplay();
}

void mouseWheel(int wheel, int direction, int x, int y) {
	followCam->mouseWheel(wheel, direction, x, y);
	glutPostRedisplay();
}
*/
void processMouseButtons(int button, int state, int xx, int yy)
{
	// start tracking the mouse
	if (state == GLUT_DOWN) {
		startX = xx;
		startY = yy;
		if (button == GLUT_LEFT_BUTTON)
			tracking = 1;
		else if (button == GLUT_RIGHT_BUTTON)
			tracking = 2;
	}
	//stop tracking the mouse
	else if (state == GLUT_UP) {
		if (tracking == 1) {
			alpha -= (xx - startX);
			beta += (yy - startY);
			if (beta > 80.0f)
				beta = 80.0f;
			else if (beta < -80.0f)
				beta = -80.0f;
		}
		else if (tracking == 2) {
			r += (yy - startY) * 0.01f;
			if (r < 0.1f)
				r = 0.1f;
		}
		tracking = 0;
	}
}

void processMouseMotion(int xx, int yy)
{
	int deltaX, deltaY;
	float alphaAux, betaAux;
	float rAux;
	deltaX = -xx + startX;
	deltaY = yy - startY;
	// left mouse button: move camera
	if (tracking == 1) {
		alphaAux = alpha + deltaX;
		betaAux = beta + deltaY;
		if (betaAux > 80.0f)
			betaAux = 80.0f;
		else if (betaAux < -80.0f)
			betaAux = -80.0f;
		rAux = r;
	}
	// right mouse button: zoom
	else if (tracking == 2) {
		alphaAux = alpha;
		betaAux = beta;
		rAux = r + (deltaY * 0.01f);
		if (rAux < 0.1f)
			rAux = 0.1f;
	}
	camX = rAux * sin(alphaAux * 3.14f / 180.0f) * cos(betaAux * 3.14f / 180.0f);
	camZ = rAux * cos(alphaAux * 3.14f / 180.0f) * cos(betaAux * 3.14f / 180.0f);
	camY = rAux *   						       sin(betaAux * 3.14f / 180.0f);
	//  uncomment this if not using an idle func
		glutPostRedisplay();
}


void mouseWheel(int wheel, int direction, int x, int y) {
	r -= direction * 0.2f;
	if (r < 0.5f)
		r = 0.5f;
	camX = r * sin(alpha * 3.14f / 180.0f) * cos(beta * 3.14f / 180.0f);
	camZ = r * cos(alpha * 3.14f / 180.0f) * cos(beta * 3.14f / 180.0f);
	camY = r *   						     sin(beta * 3.14f / 180.0f);
	//  uncomment this if not using an idle func
		glutPostRedisplay();
}

void processKeys(unsigned char key, int xx, int yy)
{
	keyState[key] = true;

	switch (key) {

	case 27:
		glutLeaveMainLoop();
		break;
	case 'f': switchFramerate(); break;
	case 'n': if (lightsOnGlobal == 1.0f) lightsOnGlobal = 0.0f; else lightsOnGlobal = 1.0f; break;
	case 'c': if (lightsOnStars == 1.0f) lightsOnStars = 0.0f; else lightsOnStars = 1.0f; break;
	case 'h': if (lightsOnMiner == 1.0f) lightsOnMiner = 0.0f; else lightsOnMiner = 1.0f; break;
	case 'p': projectionIsPerspective = !projectionIsPerspective; break;
	}
	passKeys();
}

void processUpKeys(unsigned char key, int xx, int yy)
{
	keyState[key] = false;
	passKeys();
}

void processSpecialKeys(int key, int xx, int yy) {
	if (key == GLUT_KEY_LEFT) keyLeft = true;
	if (key == GLUT_KEY_RIGHT) keyRight = true;
	passKeys();
}

void processSpecialUpKeys(int key, int xx, int yy) {
	if (key == GLUT_KEY_LEFT) keyLeft = false;
	if (key == GLUT_KEY_RIGHT) keyRight = false;
	passKeys();
}

/////////////////////////////////////////////////////////////////////// CALLBACKS

void cleanup()
{
	//destroyShaderProgram();
	//destroyBufferObjects();
}

void display()
{
	++FrameCount;
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
	renderScene();
	glutSwapBuffers();
}

void idle()
{
	//glutPostRedisplay();
}

void refresh(int value)
{
	update();
	glutPostRedisplay();
	glutTimerFunc(1000 / TargetFramerate, refresh, 0);

}

void reshape(int w, int h)
{
	WinX = w;
	WinY = h;
	glViewport(0, 0, WinX, WinY);
	ratio = (WinX * 1.0f) / WinY;
	//printf("a");
	orthoCam->setRatio(ratio);
	fixedCam->setRatio(ratio);
	followCam->setRatio(ratio);

}

void timer(int value)
{
	std::ostringstream oss;
	oss << CAPTION << ": " << FrameCount << " FPS @ (" << WinX << "x" << WinY << ")";
	std::string s = oss.str();
	glutSetWindow(WindowHandle);
	glutSetWindowTitle(s.c_str());
    FrameCount = 0;
    glutTimerFunc(1000, timer, 0);
}


/////////////////////////////////////////////////////////////////////// SETUP

void setupCallbacks() 
{
	glutCloseFunc(cleanup);
	glutDisplayFunc(display);
	glutIdleFunc(idle);
	glutReshapeFunc(reshape);
	glutTimerFunc(0, refresh, 0);
	glutTimerFunc(0,timer,0);
	
	glutKeyboardFunc(processKeys);
	glutKeyboardUpFunc(processUpKeys);
	glutSpecialFunc(processSpecialKeys);
	glutSpecialUpFunc(processSpecialUpKeys);

	glutMouseFunc(processMouseButtons);
	glutMotionFunc(processMouseMotion);
	glutMouseWheelFunc(mouseWheel);
}

void setupOpenGL() {
	std::cerr << "CONTEXT: OpenGL v" << glGetString(GL_VERSION) << std::endl;
	glEnable(GL_MULTISAMPLE);
	glClearColor(0.0f, 0.0f, 0.0f, 1.0f);
	glEnable(GL_DEPTH_TEST);
	glDepthFunc(GL_LEQUAL);
	glDepthMask(GL_TRUE);
	glDepthRange(0.0, 1.0);
	glClearDepth(1.0);
	glEnable(GL_CULL_FACE);
	glCullFace(GL_BACK);
	glFrontFace(GL_CCW);
}

void setupGLEW() {
	glewExperimental = GL_TRUE;
	GLenum result = glewInit() ; 
	if (result != GLEW_OK) { 
		std::cerr << "ERROR glewInit: " << glewGetString(result) << std::endl;
		exit(EXIT_FAILURE);
	} 
	GLenum err_code = glGetError();
	printf ("Vendor: %s\n", glGetString (GL_VENDOR));
	printf ("Renderer: %s\n", glGetString (GL_RENDERER));
	printf ("Version: %s\n", glGetString (GL_VERSION));
	printf ("GLSL: %s\n", glGetString (GL_SHADING_LANGUAGE_VERSION));

}

void setupGLUT(int argc, char* argv[])
{
	glutInit(&argc, argv);
	
	glutInitContextVersion(3, 1);
	glutInitContextFlags(GLUT_FORWARD_COMPATIBLE);
	glutInitContextProfile(GLUT_CORE_PROFILE);

	glutSetOption(GLUT_ACTION_ON_WINDOW_CLOSE,GLUT_ACTION_GLUTMAINLOOP_RETURNS);
	
	glutInitWindowPosition(100, 100);
	glutInitWindowSize(WinX, WinY);
	glutInitDisplayMode(GLUT_DEPTH | GLUT_DOUBLE | GLUT_RGBA);
	WindowHandle = glutCreateWindow(CAPTION);
	if(WindowHandle < 1) {
		std::cerr << "ERROR: Could not create a new rendering window." << std::endl;
		exit(EXIT_FAILURE);
	}
}


void setupThings() {
	for (int i = 0; i < 256; i++) {
		keyState[i] = false;
	}
	for (int i = 0; i < 3; i++) {
		camPos[i] = 0.0f;
		objPos[i] = 0.0f;
	}
	// set the camera position based on its spherical coordinates
	camX = r * sin(alpha * 3.14f / 180.0f) * cos(beta * 3.14f / 180.0f);
	camZ = r * cos(alpha * 3.14f / 180.0f) * cos(beta * 3.14f / 180.0f);
	camY = r *   						     sin(beta * 3.14f / 180.0f);

	_fontSize = 16;
	initTextureMappedFont();


	glGenTextures(5, TextureArray);
	TGA_Texture(TextureArray, "stars.tga", 0);
	TGA_Texture(TextureArray, "checker.tga", 1);
	TGA_Texture(TextureArray, "font1.tga", 2);
	TGA_Texture(TextureArray, "font1.tga", 3);
	TGA_Texture(TextureArray, "font1.tga", 4);

	//TopOrthoCamera( _left,  _right,  _down,  _up,  _near,  _far,  _x,  _y,  _z);
	orthoCam = new TopOrthoCamera(-6.0f* ratio, 6.0f* ratio, -6.0f, 6.0f, 0.1f, 1000.0f, 0.0f, 10.0f, 5.0f);
	//FixedPerspCamera( _fov,  _ratio,  _near,  _far,  _x,  _y,  _z,  _tx,  _ty,  _tz);
	fixedCam = new FixedPerspCamera(90.0f, ratio, 0.1f, 1000.0f, 0.0f, 5.0f, -5.0f, 0.0f, 0.0f, 5.0f);
	//FollowPerspCamera( _fov,  _ratio,  _near,  _far,  _x,  _y,  _z);
	followCam = new FollowPerspCamera(70.0f, ratio, 0.1f, 1000.0f, 0.0f, 5.0f, -5.0f);

	currentCamera = orthoCam;
	
	objId = 0;
	objIdInc = 0;
	
	for (int i = 0; i < ALIENROWS; i++) {
		for (int j = 0; j < ALIENCOLUMNS; j++){
			if (objIdAlien == -1) {
				objIdAlien = objId;
				Aliens.push_back(new Alien(objIdAlien, &objIdInc, ALIENCOLUMNS - j*ALIENCOLUMNGAP, 0.0f, 10.0f - i*ALIENROWGAP, ALIENCOLUMNS - j*ALIENCOLUMNGAP, ALIENWIDTH, ALIENROWSHIFT)); // x y z left width rowgap
				objId += objIdInc;
			}
			else Aliens.push_back(new Alien(objIdAlien, &objIdInc, ALIENCOLUMNS - j*ALIENCOLUMNGAP, 0.0f, 10.0f - i*ALIENROWGAP, ALIENCOLUMNS - j*ALIENCOLUMNGAP, ALIENWIDTH, ALIENROWSHIFT)); // x y z left width rowgap
		}
	}
	//objId += objIdInc;
	if (objIdShip == -1) {
		objIdShip = objId;
		spaceship = new Spaceship(objIdShip, &objIdInc, 0.0f, 0.0f, 0.0f, -5.8f, 5.8f);
		objId += objIdInc;
	}
	else spaceship = new Spaceship(objIdShip, &objIdInc, 0.0f, 0.0f, 0.0f, -5.8f, 5.8f);
	//printf("%d\n", objId);

	if (objIdStars == -1) {
		objIdStars = objId;
		background1 = new StarsBackground(objId, &objIdInc, 0.0f, 0.0f, 20.0f);
		objId += objIdInc;
	}
	else background1 = new StarsBackground(objId, &objIdInc, 0.0f, 0.0f, 20.0f);

	for (int ilives = 0; ilives < 5; ilives++) {
		if (objIdShip == -1) {
			objIdShip = objId;
			LivesRepresentation.push_back(new Spaceship(objIdShip, &objIdInc, 5.0f*ilives, 0.0, 0.0, 0.0f, 0.0f));
			objId += objIdInc;
		}
		LivesRepresentation.push_back(new Spaceship(objIdShip, &objIdInc, 5.0f*ilives, 0.0, 0.0, 0.0f, 0.0f));
	}
}

void init(int argc, char* argv[])
{
	setupGLUT(argc, argv);
	setupGLEW();
	setupShaders();
	setupThings();
	setupOpenGL();
	setupCallbacks();
}

int main(int argc, char* argv[])
{
	init(argc, argv);
	glutMainLoop();	
	exit(EXIT_SUCCESS);
}

///////////////////////////////////////////////////////////////////////