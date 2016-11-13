#include "Spaceship.h"
#include <math.h>
#include "VertexAttrDef.h"

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

	std::vector <glm::vec4> objv;
	std::vector <glm::vec4> objuv;
	std::vector <glm::vec4> objn;

	loadOBJ("Toy_Space_ship.obj", objv, objuv, objn);
	//loadOBJ("cubotutorial.obj", objv, objuv, objn); 
	printf("%d %d %d\n", objv.size(), objuv.size(), objn.size());
	handleOBJ(objectId, objv, objuv, objn);
	printf("coco\n");
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
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.texCount");
	glUniform1i(loc, mesh[objectId].mat.texCount);

	translate(MODEL, position.getX(), position.getY(), position.getZ());
	rotate(MODEL, speedAngleEffect, 0.0f, 1.0f, 0.0f);

	pushMatrix(MODEL);
	translate(MODEL, 0.0f, -0.25f, -0.5f);
	scale(MODEL, 0.05f, 0.05f, 0.05f);
	
	// send matrices to OGL
	computeDerivedMatrix(PROJ_VIEW_MODEL);
	glUniformMatrix4fv(vm_uniformId, 1, GL_FALSE, mCompMatrix[VIEW_MODEL]);
	glUniformMatrix4fv(pvm_uniformId, 1, GL_FALSE, mCompMatrix[PROJ_VIEW_MODEL]);
	computeNormalMatrix3x3();
	glUniformMatrix3fv(normal_uniformId, 1, GL_FALSE, mNormal3x3);
	// Render mesh
	printf("coco1 %d %d\n", mesh[objectId].numIndexes, mesh[objectId].vao);
	glBindVertexArray(mesh[objectId].vao);
	//glDrawElements(mesh[objectId].type, mesh[objectId].numIndexes, GL_UNSIGNED_INT, 0);
	glDrawArrays(mesh[objectId].type, 0, mesh[objectId].numIndexes);
	glBindVertexArray(0);
	printf("coco2");



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
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.texCount");
	glUniform1i(loc, mesh[objectId].mat.texCount);
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
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.texCount");
	glUniform1i(loc, mesh[objectId].mat.texCount);
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


void Spaceship::handleOBJ(int objidForOBJ,
	std::vector<glm::vec4> in_vertices,
	std::vector<glm::vec4> in_uvs,
	std::vector<glm::vec4> in_normals)
{

	// Compute and store vertices
	/*
	int numSides = sides;
	int numPoints = numP + 2;
	
	float *vertex = (float *)malloc(sizeof(float)*numP * 2 * 4 * (numSides + 1));
	float *normal = (float *)malloc(sizeof(float)*numP * 2 * 4 * (numSides + 1));
	float *textco = (float *)malloc(sizeof(float)*numP * 2 * 4 * (numSides + 1));
	*/
	/*
	float inc = 2 * 3.14159f / (numSides);
	float nx, ny;
	float delta;
	int smooth;
	std::vector<int> smoothness;
	int k = 0;
	for (int i = 0; i < numP; i++) {
		revSmoothNormal2(points + (i * 2), &nx, &ny, smoothCos, 0);
		for (int j = 0; j <= numSides; j++) {

			if ((i == 0 && p[0] == 0.0f) || (i == numP - 1 && p[(i + 1) * 2] == 0.0))
				delta = inc * 0.5f;
			else
				delta = 0.0f;

			normal[((k)*(numSides + 1) + j) * 4] = nx * cos(j*inc + delta);
			normal[((k)*(numSides + 1) + j) * 4 + 1] = ny;
			normal[((k)*(numSides + 1) + j) * 4 + 2] = nx * sin(-j*inc + delta);
			normal[((k)*(numSides + 1) + j) * 4 + 3] = 0.0f;

			vertex[((k)*(numSides + 1) + j) * 4] = p[i * 2] * cos(j*inc);
			vertex[((k)*(numSides + 1) + j) * 4 + 1] = p[(i * 2) + 1];
			vertex[((k)*(numSides + 1) + j) * 4 + 2] = p[i * 2] * sin(-j*inc);
			vertex[((k)*(numSides + 1) + j) * 4 + 3] = 1.0f;

			textco[((k)*(numSides + 1) + j) * 4] = ((j + 0.0f) / numSides);
			textco[((k)*(numSides + 1) + j) * 4 + 1] = (i + 0.0f) / (numP - 1);
			textco[((k)*(numSides + 1) + j) * 4 + 2] = 0;
			textco[((k)*(numSides + 1) + j) * 4 + 3] = 1.0f;
		}
		k++;
		if (i < numP - 1) {
			smooth = revSmoothNormal2(points + ((i + 1) * 2), &nx, &ny, smoothCos, 1);

			if (!smooth) {
				smoothness.push_back(1);
				for (int j = 0; j <= numSides; j++) {

					normal[((k)*(numSides + 1) + j) * 4] = nx * cos(j*inc);
					normal[((k)*(numSides + 1) + j) * 4 + 1] = ny;
					normal[((k)*(numSides + 1) + j) * 4 + 2] = nx * sin(-j*inc);
					normal[((k)*(numSides + 1) + j) * 4 + 3] = 0.0f;

					vertex[((k)*(numSides + 1) + j) * 4] = p[(i + 1) * 2] * cos(j*inc);
					vertex[((k)*(numSides + 1) + j) * 4 + 1] = p[((i + 1) * 2) + 1];
					vertex[((k)*(numSides + 1) + j) * 4 + 2] = p[(i + 1) * 2] * sin(-j*inc);
					vertex[((k)*(numSides + 1) + j) * 4 + 3] = 1.0f;

					textco[((k)*(numSides + 1) + j) * 4] = ((j + 0.0f) / numSides);
					textco[((k)*(numSides + 1) + j) * 4 + 1] = (i + 1 + 0.0f) / (numP - 1);
					textco[((k)*(numSides + 1) + j) * 4 + 2] = 0;
					textco[((k)*(numSides + 1) + j) * 4 + 3] = 1.0f;
				}
				k++;
			}
			else
				smoothness.push_back(0);
		}
	}

	unsigned int *faceIndex = (unsigned int *)malloc(sizeof(unsigned int) * (numP - 1) * (numSides + 1) * 6);
	unsigned int count = 0;
	k = 0;
	for (int i = 0; i < numP - 1; ++i) {
		for (int j = 0; j < numSides; ++j) {

			//if (i != 0 || p[0] != 0.0)
			{
				faceIndex[count++] = k * (numSides + 1) + j;
				faceIndex[count++] = (k + 1) * (numSides + 1) + j + 1;
				faceIndex[count++] = (k + 1) * (numSides + 1) + j;
			}
			//if (i != numP-2 || p[(numP-1)*2] != 0.0)
			{
				faceIndex[count++] = k * (numSides + 1) + j;
				faceIndex[count++] = k * (numSides + 1) + j + 1;
				faceIndex[count++] = (k + 1) * (numSides + 1) + j + 1;
			}

		}
		k++;
		k += smoothness[i];
	}

	int numVertices = numP * 2 * (numSides + 1);
	mesh[objId].numIndexes = count;
	*/
	glGenVertexArrays(1, &(mesh[objidForOBJ].vao));
	glBindVertexArray(mesh[objidForOBJ].vao);
	mesh[objidForOBJ].numIndexes = in_vertices.size();
	printf("created vao: %d\n", mesh[objidForOBJ].vao);
	
	
	
	//Implementation without glBufferSubData so we will need 3 bufers for vertex attributes 
	GLuint buffers[3];
	glGenBuffers(3, buffers);

	//vertex coordinates buffer
	glBindBuffer(GL_ARRAY_BUFFER, buffers[0]);
	glBufferData(GL_ARRAY_BUFFER, in_vertices.size()*sizeof(glm::vec4), &in_vertices[0], GL_STATIC_DRAW);
	glEnableVertexAttribArray(VERTEX_COORD_ATTRIB);
	glVertexAttribPointer(VERTEX_COORD_ATTRIB, 4, GL_FLOAT, 0, 0, 0);
	printf("vbos %d %d %d\n", buffers[0], buffers[1], buffers[2]);
	//texture coordinates buffer
	glBindBuffer(GL_ARRAY_BUFFER, buffers[1]);
	glBufferData(GL_ARRAY_BUFFER, in_uvs.size() * sizeof(glm::vec4), &in_uvs[0], GL_STATIC_DRAW);
	glEnableVertexAttribArray(TEXTURE_COORD_ATTRIB);
	glVertexAttribPointer(TEXTURE_COORD_ATTRIB, 2, GL_FLOAT, 0, 0, 0);

	//normals buffer
	glBindBuffer(GL_ARRAY_BUFFER, buffers[2]);
	glBufferData(GL_ARRAY_BUFFER, in_normals.size() * sizeof(glm::vec4), &in_normals[0], GL_STATIC_DRAW);
	glEnableVertexAttribArray(NORMAL_ATTRIB);
	glVertexAttribPointer(NORMAL_ATTRIB, 3, GL_FLOAT, 0, 0, 0);

	/*
	//Implementation with glBufferSubData just for learning purposes

	glGenBuffers(2, VboId);
	glBindBuffer(GL_ARRAY_BUFFER, VboId[0]);
	glBufferData(GL_ARRAY_BUFFER, numVertices * sizeof(float) * 4 * 3, NULL, GL_STATIC_DRAW);
	glBufferSubData(GL_ARRAY_BUFFER, 0, numVertices * sizeof(float) * 4, vertex);
	glBufferSubData(GL_ARRAY_BUFFER, numVertices * sizeof(float) * 4, numVertices * sizeof(float) * 4, normal);
	glBufferSubData(GL_ARRAY_BUFFER, numVertices * sizeof(float) * 4 * 2, numVertices * sizeof(float) * 4, textco);
	
	glEnableVertexAttribArray(VERTEX_COORD_ATTRIB);
	glVertexAttribPointer(VERTEX_COORD_ATTRIB, 4, GL_FLOAT, 0, 0, 0);
	glEnableVertexAttribArray(NORMAL_ATTRIB);
	glVertexAttribPointer(NORMAL_ATTRIB, 4, GL_FLOAT, 0, 0, (void *)(numVertices * sizeof(float) * 4));
	glEnableVertexAttribArray(TEXTURE_COORD_ATTRIB);
	glVertexAttribPointer(TEXTURE_COORD_ATTRIB, 4, GL_FLOAT, 0, 0, (void *)(numVertices * sizeof(float) * 4 * 2));
	
	//index buffer
	glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, VboId[1]);
	glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(unsigned int) * mesh[objId].numIndexes, faceIndex, GL_STATIC_DRAW);
	*/
	// unbind the VAO
	glBindVertexArray(0);
	glBindBuffer(GL_ARRAY_BUFFER, 0);
	glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, 0);
	glDisableVertexAttribArray(VERTEX_COORD_ATTRIB);
	glDisableVertexAttribArray(NORMAL_ATTRIB);
	glDisableVertexAttribArray(TEXTURE_COORD_ATTRIB);

	mesh[objidForOBJ].type = GL_TRIANGLES;
}