#ifndef _STATICOBJECT_H_
#define _STATICOBJECT_H_

#include "GameObject.h"

class StaticObject : public GameObject {
public:
	StaticObject(int _objId, float _x, float _y, float _z) : GameObject(_objId, _x, _y, _z) {}
	virtual ~StaticObject() {}

};

#endif