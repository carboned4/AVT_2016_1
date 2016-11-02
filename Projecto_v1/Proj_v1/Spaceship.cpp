#include "Spaceship.h"
#include <math.h>

using namespace std;

Spaceship::Spaceship(int _objId, int* addedToId, float _x, float _y, float _z,float _limitLeft,float _limitRight) : DynamicObject(_objId,_x,_y, _z) {
	
	colBox = Box(SPACESHIP_DIMENSION_XMIN, SPACESHIP_DIMENSION_XMAX, SPACESHIP_DIMENSION_ZMIN, SPACESHIP_DIMENSION_ZMAX);
	speed = Vec3(0.0f, 0.0f, 0.0f);
	accelerationModulus = Vec3(4.0f, 0, 0);
	maxSpeed = Vec3(4.0f, 0.0f, 0.0f);
	speedAngleEffectVec = Vec3(0.0f, 0.0f, 0.0f);
	limitLeft = _limitLeft;
	limitRight = _limitRight;

	memcpy(mesh[objectId].mat.ambient, amb, 4 * sizeof(float));
	memcpy(mesh[objectId].mat.diffuse, diff, 4 * sizeof(float));
	memcpy(mesh[objectId].mat.specular, spec, 4 * sizeof(float));
	memcpy(mesh[objectId].mat.emissive, emissive, 4 * sizeof(float));
	mesh[objectId].mat.shininess = shininess;
	mesh[objectId].mat.texCount = texcount;
	memcpy(mesh[objectId + 1].mat.ambient, amb, 4 * sizeof(float));
	memcpy(mesh[objectId + 1].mat.diffuse, diff, 4 * sizeof(float));
	memcpy(mesh[objectId + 1].mat.specular, spec, 4 * sizeof(float));
	memcpy(mesh[objectId + 1].mat.emissive, emissive, 4 * sizeof(float));
	mesh[objectId + 1].mat.shininess = shininess;
	mesh[objectId + 1].mat.texCount = texcount;
	memcpy(mesh[objectId + 2].mat.ambient, amb, 4 * sizeof(float));
	memcpy(mesh[objectId + 2].mat.diffuse, diff, 4 * sizeof(float));
	memcpy(mesh[objectId + 2].mat.specular, spec, 4 * sizeof(float));
	memcpy(mesh[objectId + 2].mat.emissive, emissive, 4 * sizeof(float));
	mesh[objectId + 2].mat.shininess = shininess;
	mesh[objectId + 2].mat.texCount = texcount;

	createCube(objectId);
	createCone(objectId + 1, 1.0f, 0.5f, 12);
	createCone(objectId + 2, 1.0f, 0.5f, 12);
	*addedToId = addToId;
}

Spaceship::~Spaceship() {
	
}

bool Spaceship::checkCollisionShot( Vec3 shotPos, Box shotBox) {

	 if (Box::Collided(colBox, position, shotBox, shotPos)) {
		 printf("Colidiu com a bala\n");
		 return true;
	 }
	 else{ 
		 return false;
		  }
}


void Spaceship::update(int delta) {
	float maxX = maxSpeed.getX();
	

	if (leftPressed) {
		speed = speed + accelerationModulus*(delta / 1000.0f);
		if (speed.getX() > maxX) speed.set(maxX, 0.0f, 0.0f);
	}
	else if (rightPressed) {
		speed = speed - accelerationModulus*(delta / 1000.0f);
		if (speed.getX() < -maxX) speed.set(-maxX, 0.0f, 0.0f);
	}
	else {
		float xspeed = speed.getX();
		if (0.05f <= xspeed)
			speed = speed - accelerationModulus*(delta / 1000.0f);
		else if (xspeed <= -0.05f)
			speed = speed + accelerationModulus*(delta / 1000.0f);
		else/* if (-0.05f < xspeed < 0.05f)*/ {
			speed.set(0.0f, 0.0f, 0.0f);
		}
	}
	position = position + speed*(delta / 1000.0f);

	if (position.getX() <= limitLeft) {
		position.set(limitLeft, 0.0f, 0.0f);
		speed.set(0.0f, 0.0f, 0.0f);
	}
	if(position.getX() >= limitRight){
		position.set(limitRight, 0.0f, 0.0f);
		speed.set(0.0f, 0.0f, 0.0f);
	}
	speedAngleEffect = 20.0f*speed.getX() / maxX;
	float aux = speedAngleEffect * 3.14f / 180.0f;
	speedAngleEffectVec = Vec3(sin(speedAngleEffect* 3.14f / 180.0f), 0.0f, cos(speedAngleEffect* 3.14f / 180.0f));
	//printf("%f: %f %f %f\n", speedAngleEffect, speedAngleEffectVec.getX(), speedAngleEffectVec.getY(), speedAngleEffectVec.getZ());

}

void Spaceship::updateKeys(bool left, bool right) {
	leftPressed = left;
	rightPressed = right;
}

void Spaceship::draw(VSShaderLib _shader) {
	glUniform1i(texMode_uniformId, 4);

	
	pushMatrix(MODEL);

	GLint loc;
	//CUBE
	// send the material
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.ambient");
	glUniform4fv(loc, 1, mesh[objectId].mat.ambient);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.diffuse");
	glUniform4fv(loc, 1, mesh[objectId].mat.diffuse);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.specular");
	glUniform4fv(loc, 1, mesh[objectId].mat.specular);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.shininess");
	glUniform1f(loc, mesh[objectId].mat.shininess);

	translate(MODEL, position.getX(), position.getY(), position.getZ());
	rotate(MODEL, speedAngleEffect, 0.0f, 1.0f, 0.0f);

	pushMatrix(MODEL);
	scale(MODEL, 1.5f, 1.0f, 1.0f);
	translate(MODEL, -0.5f, -0.5f, -0.5f);
	
	// send matrices to OGL
	computeDerivedMatrix(PROJ_VIEW_MODEL);
	glUniformMatrix4fv(vm_uniformId, 1, GL_FALSE, mCompMatrix[VIEW_MODEL]);
	glUniformMatrix4fv(pvm_uniformId, 1, GL_FALSE, mCompMatrix[PROJ_VIEW_MODEL]);
	computeNormalMatrix3x3();
	glUniformMatrix3fv(normal_uniformId, 1, GL_FALSE, mNormal3x3);
	// Render mesh
	glBindVertexArray(mesh[objectId].vao);
	glDrawElements(mesh[objectId].type, mesh[objectId].numIndexes, GL_UNSIGNED_INT, 0);
	glBindVertexArray(0);
	
	// CONE1
	// send the material
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.ambient");
	glUniform4fv(loc, 1, mesh[objectId + 1].mat.ambient);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.diffuse");
	glUniform4fv(loc, 1, mesh[objectId + 1].mat.diffuse);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.specular");
	glUniform4fv(loc, 1, mesh[objectId + 1].mat.specular);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.shininess");
	glUniform1f(loc, mesh[objectId + 1].mat.shininess);
	// send matrices to OGL
	pushMatrix(MODEL);
	translate(MODEL, 0.0f, 0.5f, 0.5f);
	rotate(MODEL, 90.0f, 0.0f, 0.0f, 1.0f);
	scale(MODEL, 1.0f, 1.0f, 1.0f);
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

	// CONE2
	// send the material
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.ambient");
	glUniform4fv(loc, 1, mesh[objectId + 2].mat.ambient);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.diffuse");
	glUniform4fv(loc, 1, mesh[objectId + 2].mat.diffuse);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.specular");
	glUniform4fv(loc, 1, mesh[objectId + 2].mat.specular);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.shininess");
	glUniform1f(loc, mesh[objectId + 2].mat.shininess);
	// send matrices to OGL
	pushMatrix(MODEL);
	translate(MODEL, 1.0f, 0.5f, 0.5f);
	rotate(MODEL, 270.0f, 0.0f, 0.0f, 1.0f);
	scale(MODEL, 1.0f, 1.0f, 1.0f);
	computeDerivedMatrix(PROJ_VIEW_MODEL);
	glUniformMatrix4fv(vm_uniformId, 1, GL_FALSE, mCompMatrix[VIEW_MODEL]);
	glUniformMatrix4fv(pvm_uniformId, 1, GL_FALSE, mCompMatrix[PROJ_VIEW_MODEL]);
	computeNormalMatrix3x3();
	glUniformMatrix3fv(normal_uniformId, 1, GL_FALSE, mNormal3x3);
	popMatrix(MODEL);
	// Render mesh
	glBindVertexArray(mesh[objectId + 2].vao);
	glDrawElements(mesh[objectId + 2].type, mesh[objectId + 2].numIndexes, GL_UNSIGNED_INT, 0);
	glBindVertexArray(0);

	popMatrix(MODEL);
	popMatrix(MODEL);
}

