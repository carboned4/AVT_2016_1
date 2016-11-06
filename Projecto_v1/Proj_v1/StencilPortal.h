#ifndef _STENCILPORTAL_H_
#define _STENCILPORTAL_H_


#include "StaticObject.h"
#include "VSShaderLib.h"

class StencilPortal : public StaticObject {
private:
	float amb[4] = { 0.0f, 0.0f, 0.0f, 1.0f };
	float diff[4] = { 0.0f, 0.0f, 0.0f, 1.0f };
	float spec[4] = { 0.0f, 0.0f, 0.0f, 1.0f };
	float emissive[4] = { 0.0f, 0.0f, 0.0f, 1.0f };
	float shininess = 20.0f;
	int texcount = 0;
	float amb1[4] = { 0.5f, 0.5f, 0.5f, 1.0f };
	float diff1[4] = { 0.75f, 0.75f, 0.75f, 1.0f };
	float spec1[4] = { 1.0f, 1.0f, 1.0f, 1.0f };
	float emissive1[4] = { 0.0f, 0.0f, 0.0f, 1.0f };
	float shininess1 = 1000.0f;
	int texcount1 = 6;
	int addToId = 2;

public:
	StencilPortal(int _objId, int* addedToId, float _x, float _y, float _z);
	~StencilPortal();

	void fillStencil(VSShaderLib shader);
	void draw(VSShaderLib shader);

};


#endif