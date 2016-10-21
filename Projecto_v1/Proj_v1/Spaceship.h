#ifndef _SPACESHIP_H_
#define _SPACESHIP_H_

#include "DynamicObject.h"
#include "VSShaderLib.h"

#define SPACESHIP_DIMENSION_YMIN -1.1
#define SPACESHIP_DIMENSION_YMAX 1.1
#define SPACESHIP_DIMENSION_XMIN -4.6
#define SPACESHIP_DIMENSION_XMAX 4.6

class Spaceship : public DynamicObject {
private:
	float amb[4] = { 0.0f, 0.0f, 0.5f, 1.0f };
	float diff[4] = { 0.4f, 0.0f, 0.5f, 1.0f };
	float spec[4] = { 0.45f, 0.0f, 0.5f, 1.0f };
	float emissive[4] = { 0.0f, 0.0f, 0.0f, 1.0f };
	float shininess = 100.0f;
	float limitRight;
	float limitLeft;
	int texcount = 0;
	int addToId = 3;

	bool leftPressed = false;
	bool rightPressed = false;
	Vec3 accelerationModulus;
	Vec3 maxSpeed;

	/* Position/Collision Flags */
	bool _alienShot;
		

public:
	//Spaceship(Box(SPACESHIP_DIMENSION_XMIN, SPACESHIP_DIMENSION_XMAX, SPACESHIP_DIMENSION_YMIN, SPACESHIP_DIMENSION_YMAX));
	//_alienShot = false;

	Spaceship(int _objId, int* addedToId, float _x, float _y, float _z,float _limitLeft, float _limitRight);
	~Spaceship();

	/* checkIfCollided() - Verifies if frog collided with game objects.*/
	/*int checkIfColided(std::vector <GameObject *> collidable) {
		std::vector<GameObject* >::iterator iter = collidable.begin();
		int colision_type = 0;
		_alienShot = false;

	
		for (iter; iter != collidable.end(); iter++) {
			if ((int) this == (int)*iter) continue;			//Collision with itself.

			colision_type = (*iter)->checkColisions(getPosition(), getBox());

			if (colision_type == 1) {						//Crashed with a alienShot	
				_lives--;
				die("Atingido!");
				//_score -= 10;						//Points to earn (negative = lose) when the frog is run over
				break;
			}
		}
	}*/

	void update(int delta);
	void draw(VSShaderLib shader);
	void updateKeys(bool left, bool right);
};


#endif#pragma once
