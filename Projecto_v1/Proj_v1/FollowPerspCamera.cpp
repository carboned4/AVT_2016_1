#include "FollowPerspCamera.h"


FollowPerspCamera::FollowPerspCamera(
	float _fov, float _ratio, float _near, float _far,
	float _x, float _y, float _z,
	float _tx, float _ty, float _tz) : fov(_fov), ratio(_ratio), nearPlane(_near), farPlane(_far) {
	position = Vec3(_x, _y, _z);
	target = Vec3(_tx, _ty, _tz);
}

FollowPerspCamera::~FollowPerspCamera() {

}

void FollowPerspCamera::setRatio(float _ratio) {
	ratio = _ratio;
}

void FollowPerspCamera::doProjection() {
	perspective(fov, ratio, nearPlane, farPlane);
}

void FollowPerspCamera::doView() {
	lookAt(position.getX(), position.getY(), position.getZ(), target.getX(), target.getY(), target.getZ(), 0, 1, 0);

}