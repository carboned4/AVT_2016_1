#ifndef _ALIEN_H_
#define _ALIEN_H_

#include "DynamicObject.h"
#include "VSShaderLib.h"

class Alien : public DynamicObject {
private:
	float amb[4] = { 0.2f, 0.15f, 0.1f, 1.0f };
	float diff[4] = { 0.8f, 0.6f, 0.4f, 1.0f };
	float spec[4] = { 0.8f, 0.8f, 0.8f, 1.0f };
	float emissive[4] = { 0.0f, 0.0f, 0.0f, 1.0f };
	float shininess = 100.0f;
	int texcount = 0;
	int addToId = 3;

	float left = 0;
	float width = 1;

public:
	Alien(int _objId, int* addedToId, float _x, float _y, float _z, float _left, float _width);
	~Alien();
		
	void update(float delta);
	void draw(VSShaderLib shader);
};


#endif