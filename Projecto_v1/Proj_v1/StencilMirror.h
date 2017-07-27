#ifndef _STENCILMIRROR_H_
#define _STENCILMIRROR_H_


#include "StaticObject.h"
#include "VSShaderLib.h"

class StencilMirror : public StaticObject {
private:
	//stencil
	float amb[4] = { 0.0f, 0.0f, 0.0f, 1.0f };
	float diff[4] = { 0.0f, 0.0f, 0.0f, 1.0f };
	float spec[4] = { 0.0f, 0.0f, 0.0f, 1.0f };
	float emissive[4] = { 0.0f, 0.0f, 0.0f, 1.0f };
	float shininess = 20.0f;
	int texcount = 16;
	//mirror
	float amb1[4] = { 0.2f, 0.2f, 0.2f, 0.5f };
	float diff1[4] = { 0.0f, 0.0f, 0.0f, 0.0f };
	float spec1[4] = { 0.5f, 0.5f, 0.5f, 0.5f };
	float emissive1[4] = { 0.0f, 0.0f, 0.0f, 1.0f };
	float shininess1 = 1.0f;
	int texcount1 = 16;
	int addToId = 2;
	float elapsedShift = 0.0f;

public:
	StencilMirror(int _objId, int* addedToId, float _x, float _y, float _z);
	~StencilMirror();

	void fillStencil(VSShaderLib shader);
	void draw(VSShaderLib shader);

};


#endif