#ifndef _DYNAMICOBJECT_H_
#define _DYNAMICOBJECT_H_

#include "GameObject.h"

class DynamicObject : public GameObject {
public:
	DynamicObject()
	virtual ~DynamicObject() {}
		
	Vec3 _speed;

	Vec3 getSpeed();
	void update(float delta);
		
		
};


#endif