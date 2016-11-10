#ifndef _LENSFLARE_H_
#define _LENSFLARE_H_


#include "StaticObject.h"
#include "VSShaderLib.h"

class LensFlare : public StaticObject {
private:
	float amb[4] = { 1.0f, 1.0f, 1.0f, 1.0f };
	float diff[4] = { 1.0f, 1.0f, 1.0f, 1.0f };
	float spec[4] = { 0.0f, 0.0f, 0.0f, 0.0f };
	float emissive[4] = { 1.0f, 1.0f, 1.0f, 1.0f };
	float shininess = 69.0f;
	int texcount = 10;
	int addToId = 6;
	int numberCoronas = 6;
	float relativePositions[6] = { 0.3f, 0.4f, 0.5f, 0.55f, 0.7f, 0.8f };
	float fsizes[6] = { 0.2f, 0.4f, 0.8f, 1.4f, 0.6f, 0.2f };
	float falphas[6] = { 0.6f, 0.4f, 0.8f, 0.6f, 0.4f, 0.6f };
	int ftexcounts[6] = { 14, 12, 13, 11, 10, 12 };

public:
	LensFlare(int _objId, int* addedToId, float _x, float _y, float _z);
	~LensFlare();

	void draw(VSShaderLib shader);
	void drawFlares(VSShaderLib shader, float _lx, float _ly, float _lz, int _winw, int _winh);

};


#endif