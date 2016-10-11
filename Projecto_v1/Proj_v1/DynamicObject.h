#ifndef _DYNAMICOBJECT_H_
#define _DYNAMICOBJECT_H_

#include "GameObject.h"

class DynamicObject : public GameObject {
public:
	DynamicObject(int _objId) : GameObject(_objId){}
	virtual ~DynamicObject() {}
		
	Vec3 speed;

	Vec3 getSpeed();
	void update(float delta);
		
		
};


#endif