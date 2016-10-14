#ifndef _FIXEDPERSP_H_
#define _FIXEDPERSP_H_

#include "Camera.h"

class FixedPerspCamera : public Camera {
private:
	Vec3 position;
	float left;
	float right;
	float up;
	float down;
	float near;
	float far;

public:
	FixedPerspCamera(
		float _left, float _right, float _down, float _up, float _near, float _far,
		float _x, float _y, float _z) : left(_left), right(_right), up(_up), down(_down),
		near(_near), far(_far) {
		position = Vec3(_x, _y, _z);
	}
	virtual ~FixedPerspCamera() {}
	void doPerspective();
	void doView();
	//ortho(-3.0f* ratio, 3.0f* ratio, -3.0f, 3.0f, 0.1f, 1000.0f)
};


#endif