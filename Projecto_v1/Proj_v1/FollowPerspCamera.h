#ifndef _FOLLOWDPERSP_H_
#define _FOLLOWPERSP_H_

#include "Camera.h"

class FollowPerspCamera : public Camera {
private:
	Vec3 position;
	Vec3 target;
	float fov;
	float ratio;
	float nearPlane;
	float farPlane;

public:
	FollowPerspCamera(
		float _fov, float _ratio, float _near, float _far,
		float _x, float _y, float _z,
		float _tx, float _ty, float _tz);
	virtual ~FollowPerspCamera();
	void setRatio(float _ratio);
	void doProjection();
	void doView();
};


#endif