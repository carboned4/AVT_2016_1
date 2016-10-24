#ifndef _ALIEN_H_
#define _ALIEN_H_

#include "DynamicObject.h"
#include "VSShaderLib.h"

class Alien : public DynamicObject {
private:
	float amb[4] = { 0.1f, 0.25f, 0.1f, 1.0f };
	float diff[4] = { 0.1f, 0.9f, 0.1f, 1.0f };
	float spec[4] = { 0.9f, -0.5f, 0.1f, 1.0f };
	float emissive[4] = { 0.0f, 0.0f, 0.0f, 1.0f };
	float shininess = 20.0f;
	int texcount = 0;
	int addToId = 3;

	float left = 0;
	float width = 1;
	float prevRow;
	float rowHeight;
	bool changeRow = false;
	float speedModulus = 0.5f;

public:
	Alien(int _objId, int* addedToId, float _x, float _y, float _z, float _left, float _width, float _rowheight);
	~Alien();
		
	void update(int delta);
	void draw(VSShaderLib shader);
};


#endif