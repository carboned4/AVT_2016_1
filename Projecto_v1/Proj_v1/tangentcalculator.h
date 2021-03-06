#include <vector>
#include "glm/glm.hpp"

void computeTangentBasis(
	// inputs
	std::vector<glm::vec4> & vertices,
	std::vector<glm::vec4> & uvs,
	std::vector<glm::vec4> & normals,
	// outputs
	std::vector<glm::vec4> & tangents,
	std::vector<glm::vec4> & bitangents
);