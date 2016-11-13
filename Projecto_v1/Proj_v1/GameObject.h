#ifndef _GAMEOBJECT_H_
#define _GAMEOBJECT_H_

#include <stdlib.h>
#include "GL/glew.h"
#include "Vec3.h"
#include "VSShaderLib.h"
#include "basic_geometry.h"
#include "AVTmathLib.h"
#include "Box.h"
#include "VertexAttrDef.h"
#include "objloader.h"

extern float mMatrix[COUNT_MATRICES][16];
extern float mCompMatrix[COUNT_COMPUTED_MATRICES][16];
extern float mNormal3x3[9];
extern GLint pvm_uniformId;
extern GLint vm_uniformId;
extern GLint normal_uniformId;
extern GLint lPos_uniformId;
extern GLint texMode_uniformId;
extern struct MyMesh mesh[];
extern VSShaderLib shader;

class GameObject {

public:
	int objectId;
	Vec3 position;
	int addToId = 0;
	Box colBox;
	GLint texMode = 0;
	int texId = 0;

	GameObject(int _objId, float _x, float _y, float _z) : objectId(_objId) { position = Vec3(_x, _y, _z); }
	virtual ~GameObject() {}
	virtual void draw(VSShaderLib shader) = 0;

	Vec3 getPosition() {
		return position;
	}
	Box getCollisionBox() {
		return colBox;
	}
	void setTextureModeId(GLint t_mode, int t_id) {
		texMode = t_mode;
		texId = t_id;
	}

	void handleOBJ(int objidForOBJ,
		std::vector<glm::vec4> in_vertices,
		std::vector<glm::vec4> in_uvs,
		std::vector<glm::vec4> in_normals)
	{
		glGenVertexArrays(1, &(mesh[objidForOBJ].vao));
		glBindVertexArray(mesh[objidForOBJ].vao);
		mesh[objidForOBJ].numIndexes = in_vertices.size();



		//Implementation without glBufferSubData so we will need 3 bufers for vertex attributes 
		GLuint buffers[3];
		glGenBuffers(3, buffers);

		//vertex coordinates buffer
		glBindBuffer(GL_ARRAY_BUFFER, buffers[0]);
		glBufferData(GL_ARRAY_BUFFER, in_vertices.size() * sizeof(glm::vec4), &in_vertices[0], GL_STATIC_DRAW);
		glEnableVertexAttribArray(VERTEX_COORD_ATTRIB);
		glVertexAttribPointer(VERTEX_COORD_ATTRIB, 4, GL_FLOAT, 0, 0, 0);

		//texture coordinates buffer
		glBindBuffer(GL_ARRAY_BUFFER, buffers[1]);
		glBufferData(GL_ARRAY_BUFFER, in_uvs.size() * sizeof(glm::vec4), &in_uvs[0], GL_STATIC_DRAW);
		glEnableVertexAttribArray(TEXTURE_COORD_ATTRIB);
		glVertexAttribPointer(TEXTURE_COORD_ATTRIB, 2, GL_FLOAT, 0, 0, 0);

		//normals buffer
		glBindBuffer(GL_ARRAY_BUFFER, buffers[2]);
		glBufferData(GL_ARRAY_BUFFER, in_normals.size() * sizeof(glm::vec4), &in_normals[0], GL_STATIC_DRAW);
		glEnableVertexAttribArray(NORMAL_ATTRIB);
		glVertexAttribPointer(NORMAL_ATTRIB, 3, GL_FLOAT, 0, 0, 0);

		// unbind the VAO
		glBindVertexArray(0);
		glBindBuffer(GL_ARRAY_BUFFER, 0);
		glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, 0);
		glDisableVertexAttribArray(VERTEX_COORD_ATTRIB);
		glDisableVertexAttribArray(NORMAL_ATTRIB);
		glDisableVertexAttribArray(TEXTURE_COORD_ATTRIB);

		mesh[objidForOBJ].type = GL_TRIANGLES;
	}
};

#endif