#ifndef _ALIEN_H_
#define _ALIEN_H_

#include "Dynamicbject.h"
#include "VSShaderLib.h"
#include "basic_geometry.h"

class Alien : public DynamicObject {
public:
	Alien()
	~Alien() {}
		
	void update(float delta);
	void draw(VSShaderLib shader, struct MyMesh mesh);
};


#endif