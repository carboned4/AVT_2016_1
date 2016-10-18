#ifndef _Spaceship_ShotSHOT_H_
#define _Spaceship_ShotSHOT_H_

#include "DynamicObject.h"
#include "VSShaderLib.h"

class Spaceship_Shot : public DynamicObject {
private:
	float amb[4] = { 0.25f, 0.1f, 0.1f, 1.0f };
	float diff[4] = { 0.9f, 0.2f, 0.2f, 1.0f };
	float spec[4] = { 0.2f, 0.2f, 0.9f, 1.0f };
	float emissive[4] = { 0.0f, 0.0f, 0.0f, 1.0f };
	float shininess = 50.0f;
	int texcount = 0;
	int addToId = 1;

	bool changeRow = false;
	float speedModulus = 0.5f;

public:
	Spaceship_Shot(int _objId, int* addedToId, float _x, float _y, float _z);
	~Spaceship_Shot();

	void update(int delta);
	void draw(VSShaderLib shader);
};


#endif