#ifndef _GAMEOBJECT_H_
#define _GAMEOBJECT_H_

#include <stdlib.h>
#include "GL/glew.h"
#include "Vec3.h"
#include "VSShaderLib.h"
#include "basic_geometry.h"

class GameObject {

public:
	int objId;
	Vec3 _position;

	virtual ~GameObject() {}
	virtual void draw(VSShaderLib shader, struct MyMesh mesh) = 0;
	
};

#endif