#ifndef _FOLLOWDPERSP_H_
#define _FOLLOWPERSP_H_

#include "Camera.h"
#include "GL/freeglut.h"

class FollowPerspCamera : public Camera {
private:
	Vec3 position;
	Vec3 center;
	float fov;
	float ratio;
	float nearPlane;
	float farPlane;
	float cameraAlpha = 180.0f;
	float cameraBeta = 20.0f;
	float cameraRadius = 3.0f;
	float cameraX = 0.0f;
	float cameraY = 0.0f;
	float cameraZ = 0.0f;
	int mouseTrackingType = 0;
	int mouseStartX = 0;
	int mouseStartY = 0;

public:
	FollowPerspCamera(
		float _fov, float _ratio, float _near, float _far,
		float _x, float _y, float _z);
	virtual ~FollowPerspCamera();
	void setRatio(float _ratio);
	void updatePosition(float _x, float _y, float _z);
	void doProjection();
	void doView();
	void processMouseButtons(int button, int state, int xx, int yy);
	void processMouseMotion(int xx, int yy);
	void mouseWheel(int wheel, int direction, int x, int y);
	void setCamXYZ(float _x, float _y, float _z);
};


#endif