#ifndef _PORTALLIQUID_H_
#define _PORTALLIQUID_H_


#include "StaticObject.h"
#include "VSShaderLib.h"

class PortalLiquid : public StaticObject {
private:
	float amb[4] = { 0.25f, 0.25f, 0.25f, 0.5f };
	float diff[4] = { 0.5f, 0.5f, 0.5f, 0.5f };
	float spec[4] = { 0.0f, 0.0f, 0.0f, 0.5f };
	float emissive[4] = { 0.25f, 0.25f, 0.25f, 0.5f };
	float shininess = 20.0f;
	int texcount = 7;
	float amb1[4] = { 0.1f, 0.1f, 0.1f, 1.0f };
	float diff1[4] = { 0.5f, 0.5f, 0.5f, 1.0f };
	float spec1[4] = { 0.75f, 0.75f, 0.75f, 1.0f };
	float emissive1[4] = { 0.25f, 0.25f, 0.25f, 1.0f };
	float shininess1 = 1000.0f;
	int texcount1 = 4;
	int addToId = 2;

public:
	PortalLiquid(int _objId, int* addedToId, float _x, float _y, float _z);
	~PortalLiquid();

	void drawTransparent(VSShaderLib shader);
	void draw(VSShaderLib shader);
};


#endif