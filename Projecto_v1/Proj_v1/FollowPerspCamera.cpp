#include "FollowPerspCamera.h"


FollowPerspCamera::FollowPerspCamera(
	float _fov, float _ratio, float _near, float _far,
	float _x, float _y, float _z) : fov(_fov), ratio(_ratio), nearPlane(_near), farPlane(_far) {
	center = Vec3(_x, _y, _z);
}

FollowPerspCamera::~FollowPerspCamera() {

}

void FollowPerspCamera::setRatio(float _ratio) {
	ratio = _ratio;
}

void FollowPerspCamera::updatePosition(float _x, float _y, float _z) {
	center.set(_x, _y+1.0f, _z);
}

void FollowPerspCamera::processMouseButtons(int button, int state, int xx, int yy) {
	// start tracking the mouse
	if (state == GLUT_DOWN) {
		mouseStartX = xx;
		mouseStartY = yy;
		if (button == GLUT_LEFT_BUTTON)
			mouseTrackingType = 1;
		else if (button == GLUT_RIGHT_BUTTON)
			mouseTrackingType = 2;
	}
	//stop tracking the mouse
	else if (state == GLUT_UP) {
		if (mouseTrackingType == 1) {
			cameraAlpha -= (xx - mouseStartX);
			cameraBeta += (yy - mouseStartY);
		}
		else if (mouseTrackingType == 2) {
			cameraRadius+= (yy - mouseStartY) * 0.01f;
			if (cameraRadius< 0.1f)
				cameraRadius= 0.1f;
		}
		mouseTrackingType = 0;
	}
	
}

void FollowPerspCamera::processMouseMotion(int xx, int yy){
	int deltaX, deltaY;
	float alphaAux, betaAux;
	float rAux;
	deltaX = -xx + mouseStartX;
	deltaY = yy - mouseStartY;
	// left mouse button: move camera
	if (mouseTrackingType == 1) {
		alphaAux = cameraAlpha + deltaX;
		betaAux = cameraBeta + deltaY;
		if (betaAux > 85.0f)
			betaAux = 85.0f;
		else if (betaAux < -85.0f)
			betaAux = -85.0f;
		rAux = cameraRadius;
	}
	// right mouse button: zoom
	else if (mouseTrackingType == 2) {
		alphaAux = cameraAlpha;
		betaAux = cameraBeta;
		rAux = cameraRadius+ (deltaY * 0.01f);
		if (rAux < 0.1f)
			rAux = 0.1f;
	}
	cameraX = cameraRadius* sin(cameraAlpha * 3.14f / 180.0f) * cos(cameraBeta * 3.14f / 180.0f);
	cameraZ = cameraRadius* cos(cameraAlpha * 3.14f / 180.0f) * cos(cameraBeta * 3.14f / 180.0f);
	cameraY = cameraRadius*   						     sin(cameraBeta * 3.14f / 180.0f);

}

void FollowPerspCamera::mouseWheel(int wheel, int direction, int x, int y) {
	cameraRadius -= direction * 0.1f;
	if (cameraRadius< 0.5f)
		cameraRadius= 0.1f;
	cameraX = cameraRadius* sin(cameraAlpha * 3.14f / 180.0f) * cos(cameraBeta * 3.14f / 180.0f);
	cameraZ = cameraRadius* cos(cameraAlpha * 3.14f / 180.0f) * cos(cameraBeta * 3.14f / 180.0f);
	cameraY = cameraRadius*   						     sin(cameraBeta * 3.14f / 180.0f);

}

void FollowPerspCamera::setCamXYZ(float _x, float _y, float _z) {
	cameraX = _x;
	cameraY = _y;
	cameraZ = _z;
}

void FollowPerspCamera::doProjection() {
	perspective(fov, ratio, nearPlane, farPlane);
}

void FollowPerspCamera::doView() {
	//printf("%f %f %f   %f %f %f\n", cameraX, cameraY, cameraZ, center.getX() + cameraX, center.getY() + cameraY, center.getZ() + cameraZ);
	lookAt(center.getX()+cameraX, center.getY()+cameraY, center.getZ()+cameraZ, center.getX(), center.getY(), center.getZ(), 0, 1, 0);

}