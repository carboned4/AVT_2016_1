#ifndef _ALIEN_SHOT_H_
#define _ALIEN_SHOT_H_

#include "DynamicObject.h"
#include "VSShaderLib.h"

#define ALIENSHOT_DIMENSION_ZMIN -0.05
#define ALIENSHOT_DIMENSION_ZMAX 0.05
#define ALIENSHOT_DIMENSION_XMIN -0.05
#define ALIENSHOT_DIMENSION_XMAX 0.05

class Alien_Shot : public DynamicObject {
private:
	float amb[4] = { 0.25f, 0.25f, 0.1f, 1.0f };
	float diff[4] = { 0.9f, 0.9f, 0.2f, 1.0f };
	float spec[4] = { 0.2f, 0.9f, 0.9f, 1.0f };
	float emissive[4] = { 0.0f, 0.0f, 0.0f, 1.0f };

	float shininess = 50.0f;
	int texcount = 0;
	int addToId = 1;

	bool changeRow = false;
	float speedModulus = 0.5f;
	float elapsedLife = 0.0f;

public:
	Alien_Shot(int _objId, int* addedToId, float _x, float _y, float _z);
	~Alien_Shot();

	void update(int delta);
	void draw(VSShaderLib shader);
};


#endif