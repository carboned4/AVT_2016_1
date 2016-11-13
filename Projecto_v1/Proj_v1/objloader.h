#include <vector>
#include "glm/glm.hpp"

bool loadOBJ(
	const char * path,
	std::vector<glm::vec4> & out_vertices,
	std::vector<glm::vec4> & out_uvs,
	std::vector<glm::vec4> & out_normals
);