#ifndef _SPACESHIP_H_
#define _SPACESHIP_H_

#include "DynamicObject.h"
#include "VSShaderLib.h"

#define SPACESHIP_DIMENSION_ZMIN 0.0
#define SPACESHIP_DIMENSION_ZMAX 1.2
#define SPACESHIP_DIMENSION_XMIN -0.5
#define SPACESHIP_DIMENSION_XMAX 0.5

class Spaceship : public DynamicObject {
private:
	float amb[4] = { 0.1f, 0.1f, 0.1f, 1.0f };
	float diff[4] = { 0.65f, 0.65f, 0.5f, 1.0f };
	float spec[4] = { 0.65f, 0.65f, 0.5, 1.0f };
	float emissive[4] = { 0.0f, 0.0f, 0.0f, 1.0f };
	float shininess = 10.0f;
	float limitRight;
	float limitLeft;
	int texcount = 15;
	int texcountnormal = 3;
	int addToId = 1;

	bool leftPressed = false;
	bool rightPressed = false;
	Vec3 accelerationModulus;
	Vec3 maxSpeed;
	float speedAngleEffect = 0.0f;
	Vec3 speedAngleEffectVec;

	/* Position/Collision Flags */
	bool _alienShot;
	
public:
	
	Spaceship(int _objId, int* addedToId, float _x, float _y, float _z,float _limitLeft, float _limitRight);
	~Spaceship();

	void update(int delta);
	void draw(VSShaderLib shader);
	void updateKeys(bool left, bool right);
	bool checkCollisionShot(Vec3 shotPos, Box shotBox );
	
	Vec3 getSpeedAngle() {
		return speedAngleEffectVec;
	}
	void setSpeed(float _x, float _y, float _z) {
		speed.set(_x, _y, _z);
	}
	void setPosition(float _x, float _y, float _z) {
		position.set(_x, _y, _z);
	}
};


#endif#pragma once
