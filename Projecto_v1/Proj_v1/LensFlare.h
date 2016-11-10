#ifndef _LENSFLARE_H_
#define _LENSFLARE_H_


#include "StaticObject.h"
#include "VSShaderLib.h"

class LensFlare : public StaticObject {
private:
	float amb[4] = { 0.1f, 0.25f, 0.1f, 1.0f };
	float diff[4] = { 0.1f, 0.9f, 0.1f, 1.0f };
	float spec[4] = { 0.9f, -0.5f, 0.1f, 1.0f };
	float emissive[4] = { 0.0f, 0.0f, 0.0f, 1.0f };
	float shininess = 20.0f;
	int texcount = 0;
	int addToId = 6;
	int numberCoronas = 6;

public:
	LensFlare(int _objId, int* addedToId, float _x, float _y, float _z);
	~LensFlare();

	void draw(VSShaderLib shader);
	void drawFlares(VSShaderLib shader, float _lx, float _ly, float _lz, int _winw, int _winh);

};


#endif