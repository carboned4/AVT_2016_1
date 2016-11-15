#include <vector>
#include "glm/glm.hpp"

bool is_near(float v1, float v2);

bool getSimilarVertexIndex(
	glm::vec4 & in_vertex,
	glm::vec4 & in_uv,
	glm::vec4 & in_normal,
	std::vector<glm::vec4> & out_vertices,
	std::vector<glm::vec4> & out_uvs,
	std::vector<glm::vec4> & out_normals,
	unsigned short & result
);

void indexVBO_TBN(
	std::vector<glm::vec4> & in_vertices,
	std::vector<glm::vec4> & in_uvs,
	std::vector<glm::vec4> & in_normals,
	std::vector<glm::vec4> & in_tangents,
	std::vector<glm::vec4> & in_bitangents,

	std::vector<unsigned int> & out_indices,
	std::vector<glm::vec4> & out_vertices,
	std::vector<glm::vec4> & out_uvs,
	std::vector<glm::vec4> & out_normals,
	std::vector<glm::vec4> & out_tangents,
	std::vector<glm::vec4> & out_bitangents
);