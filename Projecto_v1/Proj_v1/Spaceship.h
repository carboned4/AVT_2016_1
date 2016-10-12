#ifndef _SPACESHIP_H_
#define _SPACESHIP_H_

#include "DynamicObject.h"
#include "VSShaderLib.h"

class Spaceship : public DynamicObject {
private:
	float amb[4] = { 0.5f, 0.0f, 0.0f, 1.0f };
	float diff[4] = { 0.4f, 0.0f, 0.0f, 1.0f };
	float spec[4] = { 0.45f, 0.0f, 0.0f, 1.0f };
	float emissive[4] = { 0.0f, 0.0f, 0.0f, 1.0f };
	float shininess = 100.0f;
	int texcount = 0;
	int addToId = 3;

public:
	Spaceship(int _objId, int* addedToId, float _x, float _y, float _z);
	~Spaceship();

	void update(float delta);
	void draw(VSShaderLib shader);
};


#endif#pragma once
