#include "Spaceship_Shot.h"


Spaceship_Shot::Spaceship_Shot(int _objId, int* addedToId, float _x, float _y, float _z) : DynamicObject(_objId, _x, _y, _z){
	speed = Vec3(0.0f, 0.0f, speedModulus);
	colBox = Box(SHIPSHOT_DIMENSION_XMIN, SHIPSHOT_DIMENSION_XMAX, SHIPSHOT_DIMENSION_ZMIN, SHIPSHOT_DIMENSION_ZMAX);
	memcpy(mesh[objectId].mat.ambient, amb, 4 * sizeof(float));
	memcpy(mesh[objectId].mat.diffuse, diff, 4 * sizeof(float));
	memcpy(mesh[objectId].mat.specular, spec, 4 * sizeof(float));
	memcpy(mesh[objectId].mat.emissive, emissive, 4 * sizeof(float));
	mesh[objectId].mat.shininess = shininess;
	mesh[objectId].mat.texCount = texcount;

	memcpy(mesh[objectId +1].mat.ambient, amb, 4 * sizeof(float));
	memcpy(mesh[objectId + 1].mat.diffuse, diff, 4 * sizeof(float));
	memcpy(mesh[objectId + 1].mat.specular, spec, 4 * sizeof(float));
	memcpy(mesh[objectId + 1].mat.emissive, emissive, 4 * sizeof(float));
	mesh[objectId + 1].mat.shininess = shininess;
	mesh[objectId + 1].mat.texCount = texcount;
	//createSphere(objectId, 0.1f, 12);
	createCylinder(objectId,0.4f, 0.1f, 12);
	createCone(objectId+1, 0.3f, 0.2f, 12);

	*addedToId = addToId;
}

Spaceship_Shot::~Spaceship_Shot() {

}

void Spaceship_Shot::update(int delta) {
	//speed.set(0.0f, 0.0f, speedModulus);
	position = position + speed*(delta / 1000.0f);
}

void Spaceship_Shot::draw(VSShaderLib _shader) {
	pushMatrix(MODEL);
	translate(MODEL, position.getX(), position.getY(), position.getZ());
	rotate(MODEL, 90.0f, 1.0f, 0.0f, 0.0f);
	GLint loc;
	
	glUniform1i(texMode_uniformId, 4);


	//CILINDRO
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
	//scale(MODEL, 0.5f, 0.5f, 0.5f);	
	translate(MODEL, 0.0f , -0.15f, 0.0f);
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

	//CONE
	// send the material
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.ambient");
	glUniform4fv(loc, 1, mesh[objectId+1].mat.ambient);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.diffuse");
	glUniform4fv(loc, 1, mesh[objectId + 1].mat.diffuse);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.specular");
	glUniform4fv(loc, 1, mesh[objectId + 1].mat.specular);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.shininess");
	glUniform1f(loc, mesh[objectId + 1].mat.shininess);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.texCount");
	glUniform1i(loc, mesh[objectId].mat.texCount);
	// send matrices to OGL
	pushMatrix(MODEL);
	translate(MODEL, 0.0f, +0.05f, 0.0f);
	//scale(MODEL, 0.5f, 0.5f, 0.5f);
	computeDerivedMatrix(PROJ_VIEW_MODEL);
	glUniformMatrix4fv(vm_uniformId, 1, GL_FALSE, mCompMatrix[VIEW_MODEL]);
	glUniformMatrix4fv(pvm_uniformId, 1, GL_FALSE, mCompMatrix[PROJ_VIEW_MODEL]);
	computeNormalMatrix3x3();
	glUniformMatrix3fv(normal_uniformId, 1, GL_FALSE, mNormal3x3);
	popMatrix(MODEL);
	// Render mesh
	glBindVertexArray(mesh[objectId + 1].vao);
	glDrawElements(mesh[objectId + 1].type, mesh[objectId + 1].numIndexes, GL_UNSIGNED_INT, 0);
	glBindVertexArray(0);


	popMatrix(MODEL);
}

