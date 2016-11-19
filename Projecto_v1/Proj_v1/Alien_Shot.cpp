#include "Alien_Shot.h"


Alien_Shot::Alien_Shot(int _objId, int* addedToId, float _x, float _y, float _z) : DynamicObject(_objId, _x, _y, _z){
	speed = Vec3(-speedModulus, 0.0f, 0.0f);
	colBox = Box(ALIENSHOT_DIMENSION_XMIN, ALIENSHOT_DIMENSION_XMAX, ALIENSHOT_DIMENSION_ZMIN, ALIENSHOT_DIMENSION_ZMAX);
	memcpy(mesh[objectId].mat.ambient, amb, 4 * sizeof(float));
	memcpy(mesh[objectId].mat.diffuse, diff, 4 * sizeof(float));
	memcpy(mesh[objectId].mat.specular, spec, 4 * sizeof(float));
	memcpy(mesh[objectId].mat.emissive, emissive, 4 * sizeof(float));
	mesh[objectId].mat.shininess = shininess;
	mesh[objectId].mat.texCount = texcount;
	createSphere(objectId, 0.1f, 12);

	*addedToId = addToId;
}

Alien_Shot::~Alien_Shot() {

}

void Alien_Shot::update(int delta) {
	speed.set(0.0f, 0.0f, 1.0f);
	position = position - speed*(delta / 1000.0f);
	elapsedLife += (delta / 1000.0f);
}

void Alien_Shot::draw(VSShaderLib _shader) {
	pushMatrix(MODEL);
	translate(MODEL, position.getX(), position.getY(), position.getZ());
	GLint loc;
	
	glUniform1i(texMode_uniformId, 4);

	float scx = 0.5*(sin(3*elapsedLife)+1.5);
	float scy = 0.5*(sin(5*elapsedLife+1) + 1.5);
	float scz = 0.5*(sin(8*elapsedLife + 1) + 1.5);

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
	pushMatrix(MODEL);
	scale(MODEL, scx, scy, scz);
	computeDerivedMatrix(PROJ_VIEW_MODEL);
	glUniformMatrix4fv(vm_uniformId, 1, GL_FALSE, mCompMatrix[VIEW_MODEL]);
	glUniformMatrix4fv(pvm_uniformId, 1, GL_FALSE, mCompMatrix[PROJ_VIEW_MODEL]);
	computeNormalMatrix3x3();
	glUniformMatrix3fv(normal_uniformId, 1, GL_FALSE, mNormal3x3);
	popMatrix(MODEL);
	// Render mesh
	glBindVertexArray(mesh[objectId].vao);
	glDrawElements(mesh[objectId].type, mesh[objectId].numIndexes, GL_UNSIGNED_INT, 0);
	glBindVertexArray(0);

	popMatrix(MODEL);
}

