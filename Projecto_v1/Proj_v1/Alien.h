#ifndef _ALIEN_H_
#define _ALIEN_H_

#include "DynamicObject.h"
#include "VSShaderLib.h"

class Alien : public DynamicObject {
public:
	Alien(struct MyMesh _theMesh, Vec3 _speed);
	~Alien();
		
	void update(float delta);
	void draw(VSShaderLib shader);
};


#endif