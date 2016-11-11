#ifndef _DYNAMICOBJECT_H_
#define _DYNAMICOBJECT_H_

#include "GameObject.h"

class DynamicObject : public GameObject {
public:


	DynamicObject(int _objId, float _x, float _y, float _z) : GameObject(_objId, _x, _y, _z){}
	virtual ~DynamicObject() {}
		
	Vec3 speed;

	Vec3 getSpeed() {
		return speed;
	}
	void update(float delta);
		
		
};


#endif