#ifndef _Spaceship_ShotSHOT_H_
#define _Spaceship_ShotSHOT_H_

#include "DynamicObject.h"
#include "VSShaderLib.h"

#define SHIPSHOT_DIMENSION_ZMIN -0.35
#define SHIPSHOT_DIMENSION_ZMAX 0.35
#define SHIPSHOT_DIMENSION_XMIN -0.1
#define SHIPSHOT_DIMENSION_XMAX 0.1

class Spaceship_Shot : public DynamicObject {
private:
	float amb[4] = { 0.1f, 0.1f, 0.1f, 1.0f };
	float diff[4] = { 0.3f, 0.3f, 0.3f, 1.0f };
	float spec[4] = { 0.9f, 0.9f, 0.9f, 1.0f };
	float emissive[4] = { 0.0f, 0.0f, 0.0f, 1.0f };
	float shininess = 1000.0f;
	int texcount = 0;
	int addToId = 2;

	bool changeRow = false;
	float speedModulus = 2.0f;

public:
	Spaceship_Shot(int _objId, int* addedToId, float _x, float _y, float _z);
	~Spaceship_Shot();

	void update(int delta);
	void draw(VSShaderLib shader);
};


#endif