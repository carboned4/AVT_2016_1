#include "TopOrthoCamera.h"


TopOrthoCamera::TopOrthoCamera(float _left, float _right, float _down, float _up, float _near, float _far,
	float _x, float _y, float _z) : left(_left), right(_right), up(_up), down(_down), nearPlane(_near), farPlane(_far) {
	position = Vec3(_x, _y, _z);
}

TopOrthoCamera::~TopOrthoCamera() {

}

void TopOrthoCamera::setRatio(float _ratio) {
	// ratio = left-right / up-down
	// we should keep up-down fixed
	// so we change left-right = ratio / up-down
	float currentRatio = (right-left) / (up - down);
	left = left*_ratio / currentRatio;
	right = right*_ratio / currentRatio;
}

void TopOrthoCamera::doProjection() {
	ortho((float)left, (float)right, (float)down, (float)up, (float)nearPlane, (float)farPlane);
	
}

void TopOrthoCamera::doView() {
	lookAt(position.getX(), position.getY(), position.getZ(), position.getX(), position.getY()-1.0f, position.getZ(),0,0,1);
}