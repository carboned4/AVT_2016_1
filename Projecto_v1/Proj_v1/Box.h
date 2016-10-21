
#ifndef BOX_H
#define BOX_H

#include "Vec3.h"

/* Class Box - Class represents "Hit Boxes" */
class Box {

private: double _xMin;

private: double _xMax;

private: double _yMin;

private: double _yMax;


public: Box() {		//Default Values.
	_xMin = -2.0;
	_xMax = 2.0;
	_yMin = -2.0;
	_yMax = 2.0;
}

public: Box(double xMin, double xMax, double yMin, double yMax) {
	_xMin = xMin;
	_xMax = xMax;
	_yMin = yMin;
	_yMax = yMax;
}

public: ~Box() {}

public: double getXMIN() {
	return _xMin;
}
public: double getXMAX() {
	return _xMax;
}
public: double getYMIN() {
	return _yMin;
}
public: double getYMAX() {
	return _yMax;
}

		/* Collided() - Verifies if the boxes intercepts. */
public: static bool Collided(Box box1, Vec3 pos1, Box box2, Vec3 pos2) {
	double otherleft = pos1.getX() + box1.getXMIN();
	double otherright = pos1.getX() + box1.getXMAX();
	double otherbottom = pos1.getY() + box1.getYMIN();
	double othertop = pos1.getY() + box1.getYMAX();

	double selfleft = pos2.getX() + box2.getXMIN();
	double selfright = pos2.getX() + box2.getXMAX();
	double selfbottom = pos2.getY() + box2.getYMIN();
	double selftop = pos2.getY() + box2.getYMAX();

	if (!(selfleft > otherright || selfright < otherleft || selfbottom > othertop || selftop < otherbottom)) {
		return true;
	}
	else {
		return false;
	}
}

};


#endif