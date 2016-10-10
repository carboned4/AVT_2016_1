#ifndef _DYNAMICOBJECT_H_
#define _DYNAMICOBJECT_H_

#include "GameObject.h"

class DynamicObject : public GameObject {
public:
	DynamicObject(struct MyMesh _theMesh, Vec3 _speed) : GameObject(_theMesh), speed(_speed){}
	virtual ~DynamicObject() {}
		
	Vec3 speed;

	Vec3 getSpeed();
	void update(float delta);
		
		
};


#endif