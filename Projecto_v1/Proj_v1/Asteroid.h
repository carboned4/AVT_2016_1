#ifndef _ASTEROID_H_
#define _ASTEROID_H_


#include "StaticObject.h"
#include "VSShaderLib.h"

#define ASTEROIDNUMBER

class Asteroid : public StaticObject {
private:
	float amb[4] = { 0.25f, 0.25f, 0.25f, 1.0f };
	float diff[4] = { 0.5f, 0.5f, 0.5f, 1.0f };
	float spec[4] = { 0.2f, 0.2f, 0.2f, 1.0f };
	float emissive[4] = { 0.25f, 0.25f, 0.25f, 1.0f };
	float shininess = 10.0f;
	int texcount = 12;
	int addToId = 1;

public:
	Asteroid(int _objId, int* addedToId, float _x, float _y, float _z);
	~Asteroid();

	void draw(VSShaderLib shader);
};


#endif