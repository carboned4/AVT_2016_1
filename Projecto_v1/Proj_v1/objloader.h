#include <vector>

typedef struct
{
	float x, y, z, w;
}
OBJVec4;

bool loadOBJ(
	const char * path,
	std::vector < OBJVec4 > & out_vertices,
	std::vector < OBJVec4 > & out_uvs,
	std::vector < OBJVec4 > & out_normals
);