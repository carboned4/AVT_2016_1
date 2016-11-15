#include "StarsBackground.h"


StarsBackground::StarsBackground(int _objId, int* addedToId, float _x, float _y, float _z) : StaticObject(_objId, _x, _y, _z) {
	memcpy(mesh[objectId].mat.ambient, amb, 4 * sizeof(float));
	memcpy(mesh[objectId].mat.diffuse, diff, 4 * sizeof(float));
	memcpy(mesh[objectId].mat.specular, spec, 4 * sizeof(float));
	memcpy(mesh[objectId].mat.emissive, emissive, 4 * sizeof(float));
	mesh[objectId].mat.shininess = shininess;
	mesh[objectId].mat.texCount = texcount;
	
	//createQuad(objectId, 75.0f, 75.0f);

	*addedToId = addToId;

	std::vector <glm::vec4> objv;
	std::vector <glm::vec4> objuv;
	std::vector <glm::vec4> objn;

	loadOBJ("sky_test2.obj", objv, objuv, objn);
	//loadOBJ("cube.obj", objv, objuv, objn); 
	handleOBJ(objectId, objv, objuv, objn);
}

StarsBackground::~StarsBackground() {

}

void StarsBackground::draw(VSShaderLib _shader) {
	pushMatrix(MODEL);
	translate(MODEL, position.getX()- 20.0f, position.getY()-20.0f, position.getZ()+ 20.0f);
	GLint loc;
	//29.653 0 - 23.064
	glUniform1i(texMode_uniformId, 2);
	
	//SPHERE
	// send the material
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.ambient");
	glUniform4fv(loc, 1, mesh[objectId].mat.ambient);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.diffuse");
	glUniform4fv(loc, 1, mesh[objectId].mat.diffuse);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.specular");
	glUniform4fv(loc, 1, mesh[objectId].mat.specular);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.shininess");
	glUniform1f(loc, mesh[objectId].mat.shininess);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.texCount");
	glUniform1i(loc, mesh[objectId].mat.texCount);
	// send matrices to OGL
	//scale(MODEL, 1 / 5000.0f, 1 / 5000.0f, 1 / 5000.0f);
	pushMatrix(MODEL);
	scale(MODEL, 1.0f, 20.0f, 1.0f);
	computeDerivedMatrix(PROJ_VIEW_MODEL);
	glUniformMatrix4fv(vm_uniformId, 1, GL_FALSE, mCompMatrix[VIEW_MODEL]);
	glUniformMatrix4fv(pvm_uniformId, 1, GL_FALSE, mCompMatrix[PROJ_VIEW_MODEL]);
	computeNormalMatrix3x3();
	glUniformMatrix3fv(normal_uniformId, 1, GL_FALSE, mNormal3x3);
	popMatrix(MODEL);
	// Render mesh
	glBindVertexArray(mesh[objectId].vao);
	glDrawArrays(mesh[objectId].type, 0, mesh[objectId].numIndexes);
	glBindVertexArray(0);
	/*
	//SPHERE
	// send the material
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.ambient");
	glUniform4fv(loc, 1, mesh[objectId].mat.ambient);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.diffuse");
	glUniform4fv(loc, 1, mesh[objectId].mat.diffuse);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.specular");
	glUniform4fv(loc, 1, mesh[objectId].mat.specular);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.shininess");
	glUniform1f(loc, mesh[objectId].mat.shininess);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.texCount");
	glUniform1i(loc, mesh[objectId].mat.texCount);
	// send matrices to OGL
	//scale(MODEL, 1 / 5000.0f, 1 / 5000.0f, 1 / 5000.0f);
	pushMatrix(MODEL);
	scale(MODEL, 1.0f, -4.0f, 1.0f);
	computeDerivedMatrix(PROJ_VIEW_MODEL);
	glUniformMatrix4fv(vm_uniformId, 1, GL_FALSE, mCompMatrix[VIEW_MODEL]);
	glUniformMatrix4fv(pvm_uniformId, 1, GL_FALSE, mCompMatrix[PROJ_VIEW_MODEL]);
	computeNormalMatrix3x3();
	glUniformMatrix3fv(normal_uniformId, 1, GL_FALSE, mNormal3x3);
	// Render mesh
	popMatrix(MODEL);
	glBindVertexArray(mesh[objectId].vao);
	glDrawArrays(mesh[objectId].type, 0, mesh[objectId].numIndexes);
	glBindVertexArray(0);
	*/


	popMatrix(MODEL);
}

