#ifndef _PORTALLIQUID_H_
#define _PORTALLIQUID_H_


#include "StaticObject.h"
#include "VSShaderLib.h"

class PortalLiquid : public StaticObject {
private:
	float amb[4] = { 0.25f, 0.25f, 0.25f, 0.000005f };
	float diff[4] = { 0.5f, 0.5f, 0.5f, 0.0000005f };
	float spec[4] = { 0.0f, 0.0f, 0.0f, 0.0000005f };
	float emissive[4] = { 0.25f, 0.25f, 0.25f, 0.000005f };
	float shininess = 20.0f;
	int texcount = 7;
	int addToId = 1;

public:
	PortalLiquid(int _objId, int* addedToId, float _x, float _y, float _z);
	~PortalLiquid();

	void draw(VSShaderLib shader);

};


#endif