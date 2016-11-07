#ifndef _PLANET_H_
#define _PLANET_H_


#include "DynamicObject.h"
#include "VSShaderLib.h"

class Planet : public DynamicObject {
private:
	float amb[4] = { 0.25f, 0.25f, 0.25f, 1.0f };
	float diff[4] = { 0.75f, 0.75f, 0.75f, 1.0f };
	float spec[4] = { 0.5f, 0.5f, 0.5f, 1.0f };
	float emissive[4] = { 0.0f, 0.0f, 0.0f, 1.0f };
	float shininess = 100.0f;
	int texcount = 8;
	float amb1[4] = { 0.0f, 0.0f, 0.0f, 0.25f };
	float diff1[4] = { 0.25f, 0.25f, 0.25f, 0.25f };
	float spec1[4] = { 0.0f, 0.0f, 0.0f, 0.25f };
	float emissive1[4] = { 0.0f, 0.0f, 0.0f, 0.25f };
	float shininess1 = 20.0f;
	int texcount1 = 9;
	int addToId = 2;

	float degPerSecSurface = 10.0f;
	float angleSurface = 90.0f;
	float degPerSecAtmosphere = -5.0f;
	float angleAtmosphere = 0.0f;

public:
	Planet(int _objId, int* addedToId, float _x, float _y, float _z);
	~Planet();

	void update(int delta);
	void draw(VSShaderLib shader);
	void drawAtmosphere(VSShaderLib shader);

};


#endif