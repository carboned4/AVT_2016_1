#include "Alien.h"


Alien::Alien(int _objId, int* addedToId, float _x, float _y, float _z, float _left, float _width, float _rowheight) : DynamicObject(_objId, _x, _y, _z), left(_left), width(_width), rowHeight(_rowheight), prevRow(_z){
	speed = Vec3(-speedModulus, 0.0f, 0.0f);
	colBox = Box(ALIEN_DIMENSION_XMIN, ALIEN_DIMENSION_XMAX, ALIEN_DIMENSION_ZMIN, ALIEN_DIMENSION_ZMAX);


	memcpy(mesh[objectId].mat.ambient, amb, 4 * sizeof(float));
	memcpy(mesh[objectId].mat.diffuse, diff, 4 * sizeof(float));
	memcpy(mesh[objectId].mat.specular, spec, 4 * sizeof(float));
	memcpy(mesh[objectId].mat.emissive, emissive, 4 * sizeof(float));
	mesh[objectId].mat.shininess = shininess;
	mesh[objectId].mat.texCount = texcount;
	memcpy(mesh[objectId+1].mat.ambient, amb, 4 * sizeof(float));
	memcpy(mesh[objectId+1].mat.diffuse, diff, 4 * sizeof(float));
	memcpy(mesh[objectId+1].mat.specular, spec, 4 * sizeof(float));
	memcpy(mesh[objectId+1].mat.emissive, emissive, 4 * sizeof(float));
	mesh[objectId+1].mat.shininess = shininess;
	mesh[objectId+1].mat.texCount = texcount;
	memcpy(mesh[objectId+2].mat.ambient, amb, 4 * sizeof(float));
	memcpy(mesh[objectId+2].mat.diffuse, diff, 4 * sizeof(float));
	memcpy(mesh[objectId+2].mat.specular, spec, 4 * sizeof(float));
	memcpy(mesh[objectId+2].mat.emissive, emissive, 4 * sizeof(float));
	mesh[objectId+2].mat.shininess = shininess;
	mesh[objectId+2].mat.texCount = texcount;
	createSphere(objectId, 0.5f, 12);
	createCone(objectId+1, 1.5f, 0.5f, 12);
	createCone(objectId+2, 1.5f, 0.5f, 12);

	*addedToId = addToId;
}

Alien::~Alien() {

}

bool Alien::getDestroyed() {
	return isDestroyed;
}

void Alien::setDestroyed(bool deststate) {
	isDestroyed = deststate;
}

bool Alien::checkCollisionShot(Vec3 shotPos, Box shotBox) {

	if (Box::Collided(colBox, position, shotBox, shotPos)) {
		//printf("Alien colidiu com a bala\n");
		return true;
	}
	else {
		return false;
	}
}

void Alien::update(int delta) {
	if (!changeRow) {
		position = position + speed*(delta / 1000.0f);
		float xpos = position.getX();
		if (xpos > left) {
			position.set(left, position.getY(), position.getZ());
			changeRow = true;
			speed = Vec3(0.0f, 0.0f, -speedModulus);
		}
		if (xpos < left - width) {
			position.set(left-width, position.getY(), position.getZ());
			changeRow = true;
			speed = Vec3(0.0f, 0.0f, -speedModulus);
		}
	}
	else if (changeRow) {
		position = position + speed*(delta / 1000.0f);
		float zpos = position.getZ();
		if (zpos < prevRow-rowHeight) {
			position.set(position.getX(), position.getY(), prevRow - rowHeight);
			prevRow -= rowHeight;
			changeRow = false;
			if (position.getX() == left) {
				speed = Vec3(-speedModulus, 0.0f, 0.0f);
			}
			if (position.getX() == left - width) {
				speed = Vec3(+speedModulus, 0.0f, 0.0f);
			}
		}
	}
}

void Alien::draw(VSShaderLib _shader) {
	pushMatrix(MODEL);
	translate(MODEL, position.getX(), position.getY(), position.getZ());
	GLint loc;
	
	glUniform1i(texMode_uniformId, 0);

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
	scale(MODEL, 1.5f, 0.5f, 1.0f);	
	rotate(MODEL, 90.0f, 0.0f, 1.0f, 0.0f);
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
	
	// CONE1
	// send the material
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.ambient");
	glUniform4fv(loc, 1, mesh[objectId+1].mat.ambient);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.diffuse");
	glUniform4fv(loc, 1, mesh[objectId+1].mat.diffuse);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.specular");
	glUniform4fv(loc, 1, mesh[objectId+1].mat.specular);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.shininess");
	glUniform1f(loc, mesh[objectId+1].mat.shininess);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.texCount");
	glUniform1i(loc, mesh[objectId].mat.texCount);
	// send matrices to OGL
	pushMatrix(MODEL);
		translate(MODEL, 0.5f, 0.0f, 0.0f);
		rotate(MODEL, 135.0f, -1.0f, 0.0f, -1.0f);
		scale(MODEL, 0.5f, 0.5f, 0.5f);
	computeDerivedMatrix(PROJ_VIEW_MODEL);
	glUniformMatrix4fv(vm_uniformId, 1, GL_FALSE, mCompMatrix[VIEW_MODEL]);
	glUniformMatrix4fv(pvm_uniformId, 1, GL_FALSE, mCompMatrix[PROJ_VIEW_MODEL]);
	computeNormalMatrix3x3();
	glUniformMatrix3fv(normal_uniformId, 1, GL_FALSE, mNormal3x3);
	popMatrix(MODEL);
	// Render mesh
	glBindVertexArray(mesh[objectId+1].vao);
	glDrawElements(mesh[objectId+1].type, mesh[objectId+1].numIndexes, GL_UNSIGNED_INT, 0);
	glBindVertexArray(0);

	// CONE2
	// send the material
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.ambient");
	glUniform4fv(loc, 1, mesh[objectId+2].mat.ambient);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.diffuse");
	glUniform4fv(loc, 1, mesh[objectId+2].mat.diffuse);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.specular");
	glUniform4fv(loc, 1, mesh[objectId+2].mat.specular);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.shininess");
	glUniform1f(loc, mesh[objectId+2].mat.shininess);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.texCount");
	glUniform1i(loc, mesh[objectId].mat.texCount);
	// send matrices to OGL
	pushMatrix(MODEL);
		translate(MODEL, -0.5f, 0.0f, 0.0f);
		rotate(MODEL, -135.0f, 1.0f, 0.0f, -1.0f);
		scale(MODEL, 0.5f, 0.5f, 0.5f);	
	computeDerivedMatrix(PROJ_VIEW_MODEL);
	glUniformMatrix4fv(vm_uniformId, 1, GL_FALSE, mCompMatrix[VIEW_MODEL]);
	glUniformMatrix4fv(pvm_uniformId, 1, GL_FALSE, mCompMatrix[PROJ_VIEW_MODEL]);
	computeNormalMatrix3x3();
	glUniformMatrix3fv(normal_uniformId, 1, GL_FALSE, mNormal3x3);
	popMatrix(MODEL);

	// Render mesh
	glBindVertexArray(mesh[objectId+2].vao);
	glDrawElements(mesh[objectId+2].type, mesh[objectId+2].numIndexes, GL_UNSIGNED_INT, 0);
	glBindVertexArray(0);


	popMatrix(MODEL);
}

