#ifndef _EXPLOSION_H_
#define _EXPLOSION_H_

#include "DynamicObject.h"
#include "VSShaderLib.h"
#include <vector>

#define FLAREFADEPERSECOND 0.0625f
#define FLARE_PLANES 8
#define FLARE_RADIUSES 8
#define INITIALSPEEDMODULUS 0.5f
#define ACCELERATIONMODULUS 0.25f

class Explosion : public DynamicObject {
private:
	float amb[4] = { 1.0f, 1.0f, 1.0f, 1.0f };
	float diff[4] = { 1.0f, 1.0f, 1.0f, 1.0f };
	float spec[4] = { 0.0f, 0.0f, 0.0f, 0.0f };
	float emissive[4] = { 1.0f, 1.0f, 1.0f, 1.0f };
	float shininess = 50.0f;
	int texcount = 15;
	int addToId = 1;

	float lifeLeft = 1.0f;
	float lifeFade = FLAREFADEPERSECOND;
	Vec3 acceleration;
	Vec3 gravityPoint;
	std::vector <Vec3> positions;
	std::vector <Vec3> speeds;
	std::vector <Vec3> accelerations;

public:
	
	Explosion(int _objId, int* addedToId,
		float _x, float _y, float _z,
		float _ivx, float _ivy, float _ivz,
		float _gx, float _gy, float _gz);
	~Explosion();

	void update(int delta);
	void draw(VSShaderLib shader);
	
	void setGravityPoint(float _x, float _y, float _z) {
		gravityPoint.set(_x, _y, _z);
	}
	void setAcceleration(float _x, float _y, float _z) {
		acceleration.set(_x, _y, _z);
	}
	void setSpeed(float _x, float _y, float _z) {
		speed.set(_x, _y, _z);
	}
	void setPosition(float _x, float _y, float _z) {
		position.set(_x, _y, _z);
	}
	float getLifeLeft() { return lifeLeft; }
};


#endif#pragma once
