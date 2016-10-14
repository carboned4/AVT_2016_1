#ifndef _FIXEDPERSP_H_
#define _FIXEDPERSP_H_

#include "Camera.h"

class FixedPerspCamera : public Camera {
private:
	Vec3 position;
	Vec3 target;
	float fov;
	float ratio;
	float nearPlane;
	float farPlane;

public:
	FixedPerspCamera(
		float _fov, float _ratio, float _near, float _far,
		float _x, float _y, float _z,
		float _tx, float _ty, float _tz);
	virtual ~FixedPerspCamera();
	void setRatio(float _ratio);
	void doProjection();
	void doView();
};


#endif