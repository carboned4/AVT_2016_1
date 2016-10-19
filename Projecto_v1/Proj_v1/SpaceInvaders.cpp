
#include <iostream>
#include <sstream>
#include <string>
#include <math.h>

#include "GL/glew.h"
#include "GL/freeglut.h"

#include "AVTmathLib.h"
#include "vsShaderLib.h"
//#include "basic_geometry.h"

#include "Alien.h"
#include "Spaceship.h"
#include "Alien_Shot.h"
#include "Spaceship_Shot.h"

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
#define ALIENROWSHIFT 0.5f

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

#define VERTEX_COORD_ATTRIB 0
#define NORMAL_ATTRIB 1
#define TEXTURE_COORD_ATTRIB 2

struct MyMesh mesh[100];
int objId = 0; //id of the object mesh - to be used as index of mesh: mesh[objID] means the current mesh
int objIdInc = 0;

//GLuint VaoId, VboId[2];
GLuint VertexShaderId, FragmentShaderId, ProgramId;
//GLint UniformId;
VSShaderLib shader;
GLint pvm_uniformId;
GLint vm_uniformId;
GLint normal_uniformId;
GLint lPos_uniformId;

extern float mMatrix[COUNT_MATRICES][16];
extern float mCompMatrix[COUNT_COMPUTED_MATRICES][16];
extern float mNormal3x3[9];

bool projectionIsPerspective = true;

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
float lightPos[4] = { 4.0f, 6.0f, 2.0f, 1.0f };

Alien *Aliens[ALIENCOLUMNS * ALIENROWS];
Spaceship *spaceship;
Spaceship_Shot *shot;

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

	glLinkProgram(shader.getProgramIndex());

	pvm_uniformId = glGetUniformLocation(shader.getProgramIndex(), "m_pvm");
	vm_uniformId = glGetUniformLocation(shader.getProgramIndex(), "m_viewModel");
	normal_uniformId = glGetUniformLocation(shader.getProgramIndex(), "m_normal");
	lPos_uniformId = glGetUniformLocation(shader.getProgramIndex(), "l_pos");

	printf("InfoLog for Hello World Shader\n%s\n\n", shader.getAllInfoLogs().c_str());

	return(shader.isProgramValid());
}

/////////////////////////////////////////////////////////////////////// VAOs & VBOs



void renderScene()
{
	//GLint loc;

	//estes já são feitos no display()
	//FrameCount++;
	//glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

	loadIdentity(VIEW);
	loadIdentity(MODEL);
	loadIdentity(PROJECTION);

	/*lookAt(camPos[0] + camX, camPos[1] + camY, camPos[2] + camZ, camPos[0], camPos[1], camPos[2], 0, 1, 0);
	if (projectionIsPerspective)
		perspective(70.0f, ratio, 0.1f, 1000.0f);
	else ortho(-3.0f* ratio, 3.0f* ratio, -3.0f, 3.0f, 0.1f, 1000.0f);
	*/
	currentCamera->doProjection();
	currentCamera->doView();
	glUseProgram(shader.getProgramIndex());
	
	//send the light position in eye coordinates

	//glUniform4fv(lPos_uniformId, 1, lightPos); //efeito capacete do mineiro, ou seja lighPos foi definido em eye coord 

	float res[4];
	multMatrixPoint(VIEW, lightPos, res);   //lightPos definido em World Coord so is converted to eye space
	glUniform4fv(lPos_uniformId, 1, res);

	objId = 0;
	for (int i = 0; i < 2; ++i) {
		for (int j = 0; j < 2; ++j) {
			pushMatrix(MODEL);
				/*
				// send the material
				loc = glGetUniformLocation(shader.getProgramIndex(), "mat.ambient");
				glUniform4fv(loc, 1, mesh[objId].mat.ambient);
				loc = glGetUniformLocation(shader.getProgramIndex(), "mat.diffuse");
				glUniform4fv(loc, 1, mesh[objId].mat.diffuse);
				loc = glGetUniformLocation(shader.getProgramIndex(), "mat.specular");
				glUniform4fv(loc, 1, mesh[objId].mat.specular);
				loc = glGetUniformLocation(shader.getProgramIndex(), "mat.shininess");
				glUniform1f(loc, mesh[objId].mat.shininess);
				translate(MODEL, objPos[0], objPos[1], objPos[2]);
				translate(MODEL, i*2.0f, 0.0f, j*2.0f);
				
				// send matrices to OGL
				computeDerivedMatrix(PROJ_VIEW_MODEL);
				glUniformMatrix4fv(vm_uniformId, 1, GL_FALSE, mCompMatrix[VIEW_MODEL]);
				glUniformMatrix4fv(pvm_uniformId, 1, GL_FALSE, mCompMatrix[PROJ_VIEW_MODEL]);
				computeNormalMatrix3x3();
				glUniformMatrix3fv(normal_uniformId, 1, GL_FALSE, mNormal3x3);

				// Render mesh
				glBindVertexArray(mesh[objId].vao);
				glDrawElements(mesh[objId].type, mesh[objId].numIndexes, GL_UNSIGNED_INT, 0);
				glBindVertexArray(0);
				*/
			popMatrix(MODEL);
			objId++;
		}
	}

	spaceship->draw(shader);
	shot->draw(shader);

	for (int i = 0; i < ALIENCOLUMNS*ALIENROWS; i++) {
		Aliens[i]->draw(shader);
	}
	

	//este já é feito no display
	//glutSwapBuffers();

	
	checkOpenGLError("ERROR: Could not draw scene.");
}

void switchFramerate() {
	if (TargetFramerate == 30) TargetFramerate = 60;
	else if (TargetFramerate == 60) TargetFramerate = 120;
	else if (TargetFramerate == 120) TargetFramerate = 30;
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
	
	spaceship->updateKeys(keyLeft, keyRight);
}

void physics() {
	spaceship->update(timeDelta);

	for (int i = 0; i < ALIENCOLUMNS*ALIENROWS; i++) {
		Aliens[i]->update(timeDelta);
	}
}

void collisions() {

}

void update() {
	int now = glutGet(GLUT_ELAPSED_TIME);
	timeDelta = now - timePrevious;
	timePrevious = now;
	passKeys();
	physics();
	followCam->updatePosition(spaceship->position.getX(), spaceship->position.getY(), spaceship->position.getZ());
	followCam->setCamXYZ(camX, camY, camZ);
	collisions();
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
		if (betaAux > 85.0f)
			betaAux = 85.0f;
		else if (betaAux < -85.0f)
			betaAux = -85.0f;
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
	r += direction * 0.1f;
	if (r < 0.1f)
		r = 0.1f;
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

	case 'c':
		printf("Camera Spherical Coordinates (%f, %f, %f)\n", alpha, beta, r);
		break;
	case 'm': glEnable(GL_MULTISAMPLE); break;
	case 'n': glDisable(GL_MULTISAMPLE); break;
	case 'f': switchFramerate(); break;
	
	case 'w': keyState[key] = true; camPos[2]--; break;
	case 'a': keyState[key] = true; camPos[0]--; break;
	case 's': keyState[key] = true; camPos[2]++; break;
	case 'd': keyState[key] = true; camPos[0]++; break;
	case 'q': keyState[key] = true; camPos[1]--; break;
	case 'e': keyState[key] = true; camPos[1]++; break;
	
	case 'y': keyState[key] = true; objPos[2]--; break;
	case 'g': keyState[key] = true; objPos[0]--; break;
	case 'h': keyState[key] = true; objPos[2]++; break;
	case 'j': keyState[key] = true; objPos[0]++; break;
	case 't': keyState[key] = true; objPos[1]--; break;
	case 'u': keyState[key] = true; objPos[1]++; break;

	case 'p': projectionIsPerspective = !projectionIsPerspective; break;
	}
}

void processUpKeys(unsigned char key, int xx, int yy)
{
	keyState[key] = false;
}

void processSpecialKeys(int key, int xx, int yy) {
	if (key == GLUT_KEY_LEFT) keyLeft = true;
	if (key == GLUT_KEY_RIGHT) keyRight = true;
}

void processSpecialUpKeys(int key, int xx, int yy) {
	if (key == GLUT_KEY_LEFT) keyLeft = false;
	if (key == GLUT_KEY_RIGHT) keyRight = false;
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

	/*
	float amb[] = { 0.2f, 0.15f, 0.1f, 1.0f };
	float diff[] = { 0.8f, 0.6f, 0.4f, 1.0f };
	float spec[] = { 0.8f, 0.8f, 0.8f, 1.0f };
	float emissive[] = { 0.0f, 0.0f, 0.0f, 1.0f };
	float shininess = 100.0f;
	int texcount = 0;

	// create geometry and VAO of the pawn
	objId = 0;
	memcpy(mesh[objId].mat.ambient, amb, 4 * sizeof(float));
	memcpy(mesh[objId].mat.diffuse, diff, 4 * sizeof(float));
	memcpy(mesh[objId].mat.specular, spec, 4 * sizeof(float));
	memcpy(mesh[objId].mat.emissive, emissive, 4 * sizeof(float));
	mesh[objId].mat.shininess = shininess;
	mesh[objId].mat.texCount = texcount;
	createPawn();


	// create geometry and VAO of the sphere
	objId = 1;
	memcpy(mesh[objId].mat.ambient, amb, 4 * sizeof(float));
	memcpy(mesh[objId].mat.diffuse, diff, 4 * sizeof(float));
	memcpy(mesh[objId].mat.specular, spec, 4 * sizeof(float));
	memcpy(mesh[objId].mat.emissive, emissive, 4 * sizeof(float));
	mesh[objId].mat.shininess = shininess;
	mesh[objId].mat.texCount = texcount;
	createSphere(1.0f, 20);

	float amb1[] = { 0.3f, 0.0f, 0.0f, 1.0f };
	float diff1[] = { 0.8f, 0.1f, 0.1f, 1.0f };
	float spec1[] = { 0.9f, 0.9f, 0.9f, 1.0f };
	shininess = 500.0;

	// create geometry and VAO of the cylinder
	objId = 2;
	memcpy(mesh[objId].mat.ambient, amb1, 4 * sizeof(float));
	memcpy(mesh[objId].mat.diffuse, diff1, 4 * sizeof(float));
	memcpy(mesh[objId].mat.specular, spec1, 4 * sizeof(float));
	memcpy(mesh[objId].mat.emissive, emissive, 4 * sizeof(float));
	mesh[objId].mat.shininess = shininess;
	mesh[objId].mat.texCount = texcount;
	createCylinder(1.5f, 0.5f, 20);
	*/

	//TopOrthoCamera( _left,  _right,  _down,  _up,  _near,  _far,  _x,  _y,  _z);
	orthoCam = new TopOrthoCamera(-6.0f* ratio, 6.0f* ratio, -6.0f, 6.0f, 1000.0f, 0.1f, 0.0f, 10.0f, 5.0f);
	//FixedPerspCamera( _fov,  _ratio,  _near,  _far,  _x,  _y,  _z,  _tx,  _ty,  _tz);
	fixedCam = new FixedPerspCamera(90.0f, ratio, 0.1f, 1000.0f, 0.0f, 5.0f, -5.0f, 0.0f, 0.0f, 5.0f);
	//FollowPerspCamera( _fov,  _ratio,  _near,  _far,  _x,  _y,  _z);
	followCam = new FollowPerspCamera(70.0f, ratio, 0.1f, 1000.0f, 0.0f, 5.0f, -5.0f);

	currentCamera = orthoCam;
	
	objId = 0;
	objIdInc = 0;
	for (int i = 0; i < ALIENROWS; i++) {
		for (int j = 0; j < ALIENCOLUMNS; j++){
			Aliens[i*ALIENCOLUMNS + j] = new Alien(objId, &objIdInc, ALIENCOLUMNS - j*ALIENCOLUMNGAP, 0.0f, 10.0f - i*ALIENROWGAP, ALIENCOLUMNS - j*ALIENCOLUMNGAP, ALIENWIDTH, ALIENROWSHIFT); // x y z left width rowgap
			objId += objIdInc;
			
		}
	}
	shot = new Spaceship_Shot(objId, &objIdInc, 1.0f, 1.0f, 1.0f);
	objId += objIdInc;
	spaceship = new Spaceship(objId,&objIdInc,0.0f,0.0f,0.0f,-5.8f,5.8f);
	objId += objIdInc;
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