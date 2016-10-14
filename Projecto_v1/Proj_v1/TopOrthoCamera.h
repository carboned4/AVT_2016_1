#ifndef _TOPORTHO_H_
#define _TOPORTHO_H_

#include "Camera.h"

class TopOrthoCamera : public Camera {
private:
	Vec3 position;
	float left;
	float right;
	float up;
	float down;
	float nearPlane;
	float farPlane;

public:
	TopOrthoCamera(
		float _left, float _right, float _down, float _up, float _near, float _far,
		float _x, float _y, float _z);
	virtual ~TopOrthoCamera();
	void setRatio(float _ratio);
	void doProjection();
	void doView();
	
};


#endif