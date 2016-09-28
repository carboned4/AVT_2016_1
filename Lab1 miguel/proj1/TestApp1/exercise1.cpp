///////////////////////////////////////////////////////////////////////
//
// 
// (c) 2014 by João Madeiras Pereira
//
///////////////////////////////////////////////////////////////////////

#include <iostream>
#include <sstream>
#include <string>

#include <GL/glew.h>
#include <GL/freeglut.h>

#include "vsMathLib.h"
#include "vsShaderLib.h"
#include "cube.h"

#define CAPTION "Exercise 1"

int WinX = 640, WinY = 480;
int WindowHandle = 0;
unsigned int FrameCount = 0;

#define VERTEX_COORD_ATTRIB 0
#define NORMAL_ATTRIB 1
#define TEXTURE_COORD_ATTRIB 2

GLuint VaoId, VboId[2];
GLuint VertexShaderId, FragmentShaderId, ProgramId;
GLint UniformId;
VSShaderLib shader;
GLint pvm_uniformId;
GLint vm_uniformId;
GLint normal_uniformId;
GLint lPos_uniformId;


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

const GLchar* VertexShader =
{
	"#version 330 core\n"

	"in vec4 in_Position;\n"				
	"uniform mat4 Matrix;\n"
	"out vec4 color;\n"

	"void main(void)\n"
	"{\n"
	"	color = in_Position;\n"
	"	gl_Position = Matrix * in_Position;\n"

	"}\n"
};

const GLchar* FragmentShader =
{
	"#version 330 core\n"

	"in vec4 color;\n"
	"out vec4 out_Color;\n"

	"void main(void)\n"
	"{\n"
	"	out_Color = color;\n"
	"}\n"
};

void createShaderProgram()
{
	VertexShaderId = glCreateShader(GL_VERTEX_SHADER);
	glShaderSource(VertexShaderId, 1, &VertexShader, 0);
	glCompileShader(VertexShaderId);

	FragmentShaderId = glCreateShader(GL_FRAGMENT_SHADER);
	glShaderSource(FragmentShaderId, 1, &FragmentShader, 0);
	glCompileShader(FragmentShaderId);

	ProgramId = glCreateProgram();
	glAttachShader(ProgramId, VertexShaderId);
	glAttachShader(ProgramId, FragmentShaderId);

	glBindAttribLocation(ProgramId, VERTEX_COORD_ATTRIB, "in_Position");
	
	glLinkProgram(ProgramId);
	UniformId = glGetUniformLocation(ProgramId, "Matrix");

	checkOpenGLError("ERROR: Could not create shaders.");
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
	shader.loadShader(VSShaderLib::VERTEX_SHADER, "shaders/lab.vert");
	shader.loadShader(VSShaderLib::FRAGMENT_SHADER, "shaders/lab.frag");
	// set semantics for the shader variables
	glBindFragDataLocation(shader.getProgramIndex(), 0, "colorOut");
	glBindAttribLocation(shader.getProgramIndex(), VERTEX_COORD_ATTRIB, "position");
	glBindAttribLocation(shader.getProgramIndex(), NORMAL_ATTRIB, "normal");
	glBindAttribLocation(shader.getProgramIndex(), TEXTURE_COORD_ATTRIB, "texCoord");

	glLinkProgram(shader.getProgramIndex());

	//pvm_uniformId = glGetUniformLocation(shader.getProgramIndex(), "m_pvm");
	pvm_uniformId = glGetUniformLocation(shader.getProgramIndex(), "Matrix");
	vm_uniformId = glGetUniformLocation(shader.getProgramIndex(), "m_viewModel");
	//vm_uniformId = glGetUniformLocation(shader.getProgramIndex(), "Matrix");
	normal_uniformId = glGetUniformLocation(shader.getProgramIndex(), "m_normal");
	lPos_uniformId = glGetUniformLocation(shader.getProgramIndex(), "l_pos");

	printf("InfoLog for Hello World Shader\n%s\n\n", shader.getAllInfoLogs().c_str());

	return(shader.isProgramValid());
}

/////////////////////////////////////////////////////////////////////// VAOs & VBOs


void createBufferObjects()
{
	glGenVertexArrays(1, &VaoId);
	glBindVertexArray(VaoId);

	/*
	glGenBuffers(4, VboId);

//vertex coordinates buffer
	glBindBuffer(GL_ARRAY_BUFFER, VboId[0]);
	glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);
	glEnableVertexAttribArray(VERTEX_COORD_ATTRIB);
	glVertexAttribPointer(VERTEX_COORD_ATTRIB, 4, GL_FLOAT, 0, 0, 0);

//normals buffer
	glBindBuffer(GL_ARRAY_BUFFER, VboId[2]);
	glBufferData(GL_ARRAY_BUFFER, sizeof(normals), normals, GL_STATIC_DRAW);
	glEnableVertexAttribArray(NORMAL_ATTRIB);
	glVertexAttribPointer(NORMAL_ATTRIB, 3, GL_FLOAT, 0, 0, 0);

	//texture coordinates buffer
	glBindBuffer(GL_ARRAY_BUFFER, VboId[1]);
	glBufferData(GL_ARRAY_BUFFER, sizeof(texCoords), texCoords, GL_STATIC_DRAW);
	glEnableVertexAttribArray(TEXTURE_COORD_ATTRIB);
	glVertexAttribPointer(TEXTURE_COORD_ATTRIB, 2, GL_FLOAT, 0, 0, 0);

	//index buffer
	glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, VboId[3]);
	glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(faceIndex), faceIndex, GL_STATIC_DRAW);
	*/

	//o vbo passa a ter só 2 entradas em vez de 4: vertices + index dos vertices
	//entrada 1: vertices (vert, norm, coord)
	glGenBuffers(2, VboId);
	glBindBuffer(GL_ARRAY_BUFFER, VboId[0]);
	glBufferData(GL_ARRAY_BUFFER, sizeof(vertices)*3, NULL, GL_STATIC_DRAW);
		glBufferSubData(GL_ARRAY_BUFFER, 0, sizeof(vertices), vertices);
		glBufferSubData(GL_ARRAY_BUFFER, sizeof(vertices), sizeof(vertices), normals);
		glBufferSubData(GL_ARRAY_BUFFER, sizeof(vertices)*2, sizeof(vertices), texCoords);

		glEnableVertexAttribArray(VERTEX_COORD_ATTRIB);
		glVertexAttribPointer(VERTEX_COORD_ATTRIB, 4, GL_FLOAT, 0, 0, 0);
		glEnableVertexAttribArray(NORMAL_ATTRIB);
		glVertexAttribPointer(NORMAL_ATTRIB, 4, GL_FLOAT, 0, 0, (void *)(sizeof(vertices)));
		glEnableVertexAttribArray(TEXTURE_COORD_ATTRIB);
		glVertexAttribPointer(TEXTURE_COORD_ATTRIB, 4, GL_FLOAT, 0, 0, (void *)(sizeof(vertices)*2));
	//entrada 2: ordem dos vertices (index)
	glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, VboId[1]);
	glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(faceIndex), faceIndex, GL_STATIC_DRAW);

// unbind the VAO
	glBindVertexArray(0);
	glBindBuffer(GL_ARRAY_BUFFER, 0);
	glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, 0);
	glDisableVertexAttribArray(VERTEX_COORD_ATTRIB); //antes tinha VERTICES
	glDisableVertexAttribArray(NORMAL_ATTRIB); // antes tinha COLORS
	glDisableVertexAttribArray(TEXTURE_COORD_ATTRIB);

	checkOpenGLError("ERROR: Could not create VAOs and VBOs.");
}

void destroyBufferObjects()
{
	glDisableVertexAttribArray(VERTEX_COORD_ATTRIB);
	glDisableVertexAttribArray(NORMAL_ATTRIB);
	glDisableVertexAttribArray(TEXTURE_COORD_ATTRIB);


	glBindBuffer(GL_ARRAY_BUFFER, 0);
	glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, 0);
	glBindVertexArray(0);

	glDeleteBuffers(2, VboId);
	glDeleteVertexArrays(1, &VaoId);
	checkOpenGLError("ERROR: Could not destroy VAOs and VBOs.");
}

/////////////////////////////////////////////////////////////////////// SCENE

typedef GLfloat Matrix[16];

const Matrix I = {
	1.0f,  0.0f,  0.0f,  0.0f,
	0.0f,  1.0f,  0.0f,  0.0f,
	0.0f,  0.0f,  1.0f,  0.0f,
	0.0f,  0.0f,  0.0f,  1.0f
}; // Row Major (GLSL is Column Major)

const Matrix M = {
	1.0f,  0.0f,  0.0f, -1.0f,
	0.0f,  1.0f,  0.0f, -1.0f,
	0.0f,  0.0f,  1.0f,  0.0f,
	0.0f,  0.0f,  0.0f,  1.0f
}; // Row Major (GLSL is Column Major)

void renderScene()
{
	VSMathLib::getInstance()->loadIdentity(VSMathLib::getInstance()->VIEW);
	VSMathLib::getInstance()->loadIdentity(VSMathLib::getInstance()->MODEL);

	VSMathLib::getInstance()->lookAt(0.0, 0.0, 2.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0);

	glBindVertexArray(VaoId);
	glUseProgram(shader.getProgramIndex());
	VSMathLib::getInstance()->translate(0.0f, 0.0f, -1.0f);
	VSMathLib::getInstance()->rotate(45.0f, 1.0f, 0.0f, 0.0f);
	VSMathLib::getInstance()->pushMatrix(VSMathLib::getInstance()->MODEL);
	
	
	VSMathLib::getInstance()->computeDerivedMatrix(VSMathLib::getInstance()->PROJ_VIEW_MODEL);
	glUniformMatrix4fv(vm_uniformId, 1, GL_FALSE, VSMathLib::getInstance()->mCompMatrix[VSMathLib::getInstance()->VIEW_MODEL]);
	glUniformMatrix4fv(pvm_uniformId, 1, GL_FALSE, VSMathLib::getInstance()->mCompMatrix[VSMathLib::getInstance()->PROJ_VIEW_MODEL]);
	VSMathLib::getInstance()->computeNormalMatrix3x3();
	
	for (int i = 0; i < 16; i++) {
		printf("%1.1f ", VSMathLib::getInstance()->get(VSMathLib::getInstance()->PROJECTION)[i]);
	}
	printf("\n\n");

	glUniformMatrix3fv(normal_uniformId, 1, GL_FALSE, VSMathLib::getInstance()->mNormal3x3);
	VSMathLib::getInstance()->get(VSMathLib::getInstance()->MODEL);
	//glUniformMatrix4fv(UniformId, 1, GL_TRUE, I);
	glDrawElements(GL_TRIANGLES, faceCount * 3, GL_UNSIGNED_INT, (GLvoid*)0);

	glUniformMatrix4fv(UniformId, 1, GL_TRUE, M);
	glDrawElements(GL_TRIANGLES, faceCount * 3, GL_UNSIGNED_INT, (GLvoid*)0);
	
	glUseProgram(0);
	glBindVertexArray(0);
	VSMathLib::getInstance()->popMatrix(VSMathLib::getInstance()->MODEL);

	checkOpenGLError("ERROR: Could not draw scene.");
}

/////////////////////////////////////////////////////////////////////// CALLBACKS

void cleanup()
{
	destroyShaderProgram();
	destroyBufferObjects();
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
	glutPostRedisplay();
	glutTimerFunc(1000 / 60, refresh, 0);

}

void reshape(int w, int h)
{
	WinX = w;
	WinY = h;
	float ratio;
	glViewport(0, 0, WinX, WinY);
	ratio = (WinX * 1.0f) / WinY;
	printf("a");
	VSMathLib::getInstance()->loadIdentity(VSMathLib::getInstance()->PROJECTION);
	VSMathLib::getInstance()->perspective(42.0f, ratio, 0.1f, 1000.0f);
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
}

void setupOpenGL() {
	std::cerr << "CONTEXT: OpenGL v" << glGetString(GL_VERSION) << std::endl;
	glClearColor(0.1f, 0.1f, 0.1f, 1.0f);
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
	
	glutInitContextVersion(3, 3);
	glutInitContextFlags(GLUT_FORWARD_COMPATIBLE);
	glutInitContextProfile(GLUT_CORE_PROFILE);

	glutSetOption(GLUT_ACTION_ON_WINDOW_CLOSE,GLUT_ACTION_GLUTMAINLOOP_RETURNS);
	glutReshapeFunc(reshape);
	glutInitWindowSize(WinX, WinY);
	glutInitDisplayMode(GLUT_DEPTH | GLUT_DOUBLE | GLUT_RGBA);
	WindowHandle = glutCreateWindow(CAPTION);
	if(WindowHandle < 1) {
		std::cerr << "ERROR: Could not create a new rendering window." << std::endl;
		exit(EXIT_FAILURE);
	}
}

void init(int argc, char* argv[])
{
	setupGLUT(argc, argv);
	setupGLEW();
	setupShaders();
	setupOpenGL();
	createShaderProgram();
	createBufferObjects();
	setupCallbacks();
}

int main(int argc, char* argv[])
{
	init(argc, argv);
	glutMainLoop();	
	exit(EXIT_SUCCESS);
}

///////////////////////////////////////////////////////////////////////