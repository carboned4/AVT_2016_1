#include "PortalLiquid.h"


PortalLiquid::PortalLiquid(int _objId, int* addedToId, float _x, float _y, float _z) : StaticObject(_objId, _x, _y, _z) {
	memcpy(mesh[objectId].mat.ambient, amb, 4 * sizeof(float));
	memcpy(mesh[objectId].mat.diffuse, diff, 4 * sizeof(float));
	memcpy(mesh[objectId].mat.specular, spec, 4 * sizeof(float));
	memcpy(mesh[objectId].mat.emissive, emissive, 4 * sizeof(float));
	mesh[objectId].mat.shininess = shininess;
	mesh[objectId].mat.texCount = texcount;
	memcpy(mesh[objectId+1].mat.ambient, amb1, 4 * sizeof(float));
	memcpy(mesh[objectId+1].mat.diffuse, diff1, 4 * sizeof(float));
	memcpy(mesh[objectId+1].mat.specular, spec1, 4 * sizeof(float));
	memcpy(mesh[objectId+1].mat.emissive, emissive1, 4 * sizeof(float));
	mesh[objectId+1].mat.shininess = shininess1;
	mesh[objectId+1].mat.texCount = texcount1;
	createSphere(objectId, 2.0f, 20);
	createTorus(objectId+1, 1.9f, 2.1f, 40, 12);
	*addedToId = addToId;
}

PortalLiquid::~PortalLiquid() {

}

void PortalLiquid::drawTransparent(VSShaderLib _shader) {
	pushMatrix(MODEL);
	translate(MODEL, position.getX(), position.getY(), position.getZ());
	GLint loc;

	glUniform1i(texMode_uniformId, 1);

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
	rotate(MODEL, 45.0f, 0.0f, 1.0f, 0.0f);
	rotate(MODEL, 190.0f, -1.0f, 0.0f, 0.0f);
	scale(MODEL, 1.0f, 1.0f, 0.1f);
	computeDerivedMatrix(PROJ_VIEW_MODEL);
	glUniformMatrix4fv(vm_uniformId, 1, GL_FALSE, mCompMatrix[VIEW_MODEL]);
	glUniformMatrix4fv(pvm_uniformId, 1, GL_FALSE, mCompMatrix[PROJ_VIEW_MODEL]);
	computeNormalMatrix3x3();
	glUniformMatrix3fv(normal_uniformId, 1, GL_FALSE, mNormal3x3);
	// Render mesh
	glBindVertexArray(mesh[objectId].vao);
	glDrawElements(mesh[objectId].type, mesh[objectId].numIndexes, GL_UNSIGNED_INT, 0);
	glBindVertexArray(0);

	popMatrix(MODEL);
}

void PortalLiquid::draw(VSShaderLib _shader) {
	pushMatrix(MODEL);
	translate(MODEL, position.getX(), position.getY(), position.getZ());
	GLint loc;

	glUniform1i(texMode_uniformId, 0);

	//SPHERE
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
	glUniform1i(loc, mesh[objectId + 1].mat.texCount);
	// send matrices to OGL
	rotate(MODEL, -80.0f, -1.0f, 0.0f, 1.0f);
	//rotate(MODEL, -45.0f, 0.0f, 1.0f, 0.0f);
	//rotate(MODEL, 90.0f, 0.0f, 0.0f, 1.0f);
	//scale(MODEL, 0.1f, 1.0f, 1.0f);
	computeDerivedMatrix(PROJ_VIEW_MODEL);
	glUniformMatrix4fv(vm_uniformId, 1, GL_FALSE, mCompMatrix[VIEW_MODEL]);
	glUniformMatrix4fv(pvm_uniformId, 1, GL_FALSE, mCompMatrix[PROJ_VIEW_MODEL]);
	computeNormalMatrix3x3();
	glUniformMatrix3fv(normal_uniformId, 1, GL_FALSE, mNormal3x3);
	// Render mesh
	glBindVertexArray(mesh[objectId + 1].vao);
	glDrawElements(mesh[objectId + 1].type, mesh[objectId + 1].numIndexes, GL_UNSIGNED_INT, 0);
	glBindVertexArray(0);

	popMatrix(MODEL);
}

