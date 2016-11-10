#include "LensFlare.h"
#include <math.h>

LensFlare::LensFlare(int _objId, int* addedToId, float _x, float _y, float _z) : StaticObject(_objId, _x, _y, _z) {
	memcpy(mesh[objectId].mat.ambient, amb, 4 * sizeof(float));
	memcpy(mesh[objectId].mat.diffuse, diff, 4 * sizeof(float));
	memcpy(mesh[objectId].mat.specular, spec, 4 * sizeof(float));
	memcpy(mesh[objectId].mat.emissive, emissive, 4 * sizeof(float));
	mesh[objectId].mat.shininess = shininess;
	mesh[objectId].mat.texCount = texcount;
	
	createQuad(objectId, 1.0f, 1.0f);
	createQuad(objectId + 1, 1.0f, 1.0f);
	createQuad(objectId + 2, 1.0f, 1.0f);
	createQuad(objectId + 3, 1.0f, 1.0f);
	createQuad(objectId + 4, 1.0f, 1.0f);
	createQuad(objectId + 5, 1.0f, 1.0f);

	*addedToId = addToId;
}

LensFlare::~LensFlare() {

}

void LensFlare::draw(VSShaderLib _shader) {
	
}

void LensFlare::drawFlares(VSShaderLib shader, float _lx, float _ly, float _lz, int _winw, int _winh) {
	//test if off screen
	if (_lx > _winw + 0.0f
		|| _lx < 0.0f
		|| _ly < 0.0f
		|| _ly > _winh + 0.0f
		|| _lz < 0.1f
		|| _lz > 1000.0f) {
		printf("no lensflare\n");
		return;
	}
	int fScale = 0.2f;
	int fMaxSize = 0.5f;

	int startx = int(_lx + 0.5);
	int starty = int(_ly + 0.5);
	int centerx = int(_winw / 2.0f + 0.5f);
	int centery = int(_winh / 2.0f + 0.5f);
	int destx = centerx + (centerx - _lx);
	int desty = centery + (centery - _ly);
	int maxflaredist, flaredist, flaremaxsize, flarescale;

	int side, alpha;

	maxflaredist = int(sqrt(centerx*centerx + centery*centery));
	flaredist = int(sqrt((_lx - centerx)*(_lx - centerx) + (_ly - centery)*(_ly - centery)));
	flaremaxsize = int(_winw * fMaxSize);
	flarescale = int(_winw * fScale);

	float px, py;
	float relativePositions[6] = { 0.1f, 0.2f, 0.4f, 0.7f, 0.9f, 1.0f };
	float fsizes[6] = { 0.1f, 0.2f, 0.4f, 0.7f, 0.3f, 0.1f };
	float falphas[6] = { 0.3f, 0.2f, 0.4f, 0.3f, 0.3f, 0.3f };

	for (int i = 0; i < numberCoronas; i++) {
		px = (1-relativePositions[i])*startx + relativePositions[i]*destx;
		py = (1 - relativePositions[i])*starty + relativePositions[i] * desty;

		side = flaredist*flarescale*fsizes[i]/maxflaredist;
		if (side > flaremaxsize) side = flaremaxsize;

		alpha = (flaredist*falphas[i]) / maxflaredist;

		pushMatrix(MODEL);
		translate(MODEL, px, py, 0.5f);
		GLint loc;

		glUniform1i(texMode_uniformId, 3);

		//SPHERE
		// send the material
		loc = glGetUniformLocation(shader.getProgramIndex(), "mat.ambient");
		glUniform4fv(loc, 1, mesh[objectId + i].mat.ambient);
		loc = glGetUniformLocation(shader.getProgramIndex(), "mat.diffuse");
		glUniform4fv(loc, 1, mesh[objectId + i].mat.diffuse);
		loc = glGetUniformLocation(shader.getProgramIndex(), "mat.specular");
		glUniform4fv(loc, 1, mesh[objectId + i].mat.specular);
		loc = glGetUniformLocation(shader.getProgramIndex(), "mat.shininess");
		glUniform1f(loc, mesh[objectId + i].mat.shininess);
		loc = glGetUniformLocation(shader.getProgramIndex(), "mat.texCount");
		glUniform1i(loc, mesh[objectId + i].mat.texCount);
		// send matrices to OGL
		scale(MODEL, side, side, 1.0f);
		computeDerivedMatrix(PROJ_VIEW_MODEL);
		glUniformMatrix4fv(vm_uniformId, 1, GL_FALSE, mCompMatrix[VIEW_MODEL]);
		glUniformMatrix4fv(pvm_uniformId, 1, GL_FALSE, mCompMatrix[PROJ_VIEW_MODEL]);
		computeNormalMatrix3x3();
		glUniformMatrix3fv(normal_uniformId, 1, GL_FALSE, mNormal3x3);
		// Render mesh
		glBindVertexArray(mesh[objectId + i].vao);
		glDrawElements(mesh[objectId + i].type, mesh[objectId + i].numIndexes, GL_UNSIGNED_INT, 0);
		glBindVertexArray(0);

		popMatrix(MODEL);
	}
}
