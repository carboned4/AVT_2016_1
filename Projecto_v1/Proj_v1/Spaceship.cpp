#include "Spaceship.h"
#include <math.h>

using namespace std;

Spaceship::Spaceship(int _objId, int* addedToId, bool toLoad, float _x, float _y, float _z,float _limitLeft,float _limitRight) : DynamicObject(_objId,_x,_y, _z) {
	
	colBox = Box(SPACESHIP_DIMENSION_XMIN, SPACESHIP_DIMENSION_XMAX, SPACESHIP_DIMENSION_ZMIN, SPACESHIP_DIMENSION_ZMAX);
	speed = Vec3(0.0f, 0.0f, 0.0f);
	accelerationModulus = Vec3(6.0f, 0, 0);
	maxSpeed = Vec3(4.0f, 0.0f, 0.0f);
	speedAngleEffectVec = Vec3(0.0f, 0.0f, 0.0f);
	limitLeft = _limitLeft;
	limitRight = _limitRight;
	*addedToId = addToId;
	if (!toLoad) return;

	memcpy(mesh[objectId].mat.ambient, amb, 4 * sizeof(float));
	memcpy(mesh[objectId].mat.diffuse, diff, 4 * sizeof(float));
	memcpy(mesh[objectId].mat.specular, spec, 4 * sizeof(float));
	memcpy(mesh[objectId].mat.emissive, emissive, 4 * sizeof(float));
	mesh[objectId].mat.shininess = shininess;
	mesh[objectId].mat.texCount = texcount;
	
	

	std::vector <glm::vec4> objv;
	std::vector <glm::vec4> objuv;
	std::vector <glm::vec4> objn;
	loadOBJ("gunship.obj", objv, objuv, objn);
	//loadOBJ("cube.obj", objv, objuv, objn); 
	std::vector <glm::vec4> objtan;
	std::vector <glm::vec4> objbt;
	computeTangentBasis(objv, objuv, objn, objtan, objbt);
	std::vector<unsigned int> vindices;
	std::vector<glm::vec4> indexed_vertices;
	std::vector<glm::vec4> indexed_uvs;
	std::vector<glm::vec4> indexed_normals;
	std::vector<glm::vec4> indexed_tangents;
	std::vector<glm::vec4> indexed_bitangents;
	indexVBO_TBN(
		objv, objuv, objn, objtan, objbt,
		vindices, indexed_vertices, indexed_uvs, indexed_normals, indexed_tangents, indexed_bitangents
	);
	handleIndexedOBJ(objectId,
		vindices, indexed_vertices, indexed_uvs, indexed_normals, indexed_tangents);
	//handleOBJ(objectId, objv, objuv, objn);
}

Spaceship::~Spaceship() {
	
}

bool Spaceship::checkCollisionShot( Vec3 shotPos, Box shotBox) {

	 if (Box::Collided(colBox, position, shotBox, shotPos)) {
		 //printf("Colidiu com a bala\n");
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
	glUniform1i(texMode_uniformId, 0);

	
	pushMatrix(MODEL);
	translate(MODEL, position.getX(), position.getY(), position.getZ());

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
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.texCount");
	glUniform1i(loc, mesh[objectId].mat.texCount);

	rotate(MODEL, speedAngleEffect, 0.0f, 1.0f, 0.0f);
	rotate(MODEL, -speedAngleEffect, 0.0f, 0.0f, 1.0f);
	pushMatrix(MODEL);
	translate(MODEL, 0.1f, 0.3f, -1.0f);
	scale(MODEL, 0.01f, 0.01f, 0.01f);
	// send matrices to OGL
	computeDerivedMatrix(PROJ_VIEW_MODEL);
	glUniformMatrix4fv(vm_uniformId, 1, GL_FALSE, mCompMatrix[VIEW_MODEL]);
	glUniformMatrix4fv(pvm_uniformId, 1, GL_FALSE, mCompMatrix[PROJ_VIEW_MODEL]);
	computeNormalMatrix3x3();
	glUniformMatrix3fv(normal_uniformId, 1, GL_FALSE, mNormal3x3);
	popMatrix(MODEL);
	// Render mesh
	glBindVertexArray(mesh[objectId].vao);
	glDrawElements(mesh[objectId].type, mesh[objectId].numIndexes, GL_UNSIGNED_INT, 0);
	//glDrawArrays(mesh[objectId].type, 0, mesh[objectId].numIndexes);
	glBindVertexArray(0);
	

	popMatrix(MODEL);
}


