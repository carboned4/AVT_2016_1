#ifndef _GAMEOBJECT_H_
#define _GAMEOBJECT_H_

#include <stdlib.h>
#include "GL/glew.h"
#include "Vec3.h"
#include "VSShaderLib.h"
#include "basic_geometry.h"
#include "AVTmathLib.h"
#include "Box.h"

extern float mMatrix[COUNT_MATRICES][16];
extern float mCompMatrix[COUNT_COMPUTED_MATRICES][16];
extern float mNormal3x3[9];
extern GLint pvm_uniformId;
extern GLint vm_uniformId;
extern GLint normal_uniformId;
extern GLint lPos_uniformId;
extern struct MyMesh mesh[];
extern VSShaderLib shader;

class GameObject {

public:
	int objectId;
	Vec3 position;
	int addToId = 0;
	Box colBox;
	GLint texMode = 0;
	int texId = 0;

	GameObject(int _objId, float _x, float _y, float _z) : objectId(_objId) { position = Vec3(_x, _y, _z); }
	virtual ~GameObject() {}
	virtual void draw(VSShaderLib shader) = 0;

	Vec3 getPosition() {
		return position;
	}
	Box getCollisionBox() {
		return colBox;
	}
	void setTextureModeId(GLint t_mode, int t_id) {
		texMode = t_mode;
		texId = t_id;
	}
};

#endif