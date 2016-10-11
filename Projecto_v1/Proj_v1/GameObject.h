#ifndef _GAMEOBJECT_H_
#define _GAMEOBJECT_H_

#include <stdlib.h>
#include "GL/glew.h"
#include "Vec3.h"
#include "VSShaderLib.h"
#include "basic_geometry.h"
#include "AVTmathLib.h"

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
	struct MyMesh *theMesh;


	GameObject(struct MyMesh *_theMesh, int _objId) : theMesh(_theMesh), objectId(_objId) {}
	virtual ~GameObject() {}
	virtual void draw(VSShaderLib shader) = 0;
	
};

#endif