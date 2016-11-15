#ifndef _STARSBG_H_
#define _STARSBG_H_


#include "StaticObject.h"
#include "VSShaderLib.h"

class StarsBackground : public StaticObject {
private:
	float amb[4] = { 0.1f, 0.25f, 0.1f, 1.0f };
	float diff[4] = { 0.1f, 0.9f, 0.1f, 1.0f };
	float spec[4] = { 0.9f, -0.5f, 0.1f, 0.5f };
	float emissive[4] = { 0.0f, 0.0f, 0.0f, 1.0f };
	float shininess = 200.0f;
	int texcount = 0;
	int addToId = 1;

public:
	StarsBackground(int _objId, int* addedToId, float _x, float _y, float _z);
	~StarsBackground();

	void draw(VSShaderLib shader);

};


#endif