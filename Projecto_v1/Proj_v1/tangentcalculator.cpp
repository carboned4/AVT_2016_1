#include "tangentcalculator.h"

//adaptado do opengl-tutorial (diferença: uso mais frequente de glm vec4)

void computeTangentBasis(
	// inputs
	std::vector<glm::vec4> & vertices,
	std::vector<glm::vec4> & uvs,
	std::vector<glm::vec4> & normals,
	// outputs
	std::vector<glm::vec4> & tangents,
	std::vector<glm::vec4> & bitangents
) {
	for (unsigned int i = 0; i < vertices.size(); i += 3) {

		// Shortcuts for vertices
		glm::vec4 & v0 = vertices[i + 0];
		glm::vec4 & v1 = vertices[i + 1];
		glm::vec4 & v2 = vertices[i + 2];

		// Shortcuts for UVs
		glm::vec4 & uv0 = uvs[i + 0];
		glm::vec4 & uv1 = uvs[i + 1];
		glm::vec4 & uv2 = uvs[i + 2];

		// Edges of the triangle : postion delta
		glm::vec4 deltaPos1 = v1 - v0;
		glm::vec4 deltaPos2 = v2 - v0;

		// UV delta
		glm::vec4 deltaUV1 = uv1 - uv0;
		glm::vec4 deltaUV2 = uv2 - uv0;

		float r = 1.0f / (deltaUV1.x * deltaUV2.y - deltaUV1.y * deltaUV2.x);
		glm::vec4 tangent = (deltaPos1 * deltaUV2.y - deltaPos2 * deltaUV1.y)*r;
		glm::vec4 bitangent = (deltaPos2 * deltaUV1.x - deltaPos1 * deltaUV2.x)*r;

		// Set the same tangent for all three vertices of the triangle.
		// They will be merged later, in vboindexer.cpp
		tangents.push_back(tangent);
		tangents.push_back(tangent);
		tangents.push_back(tangent);

		// Same thing for binormals
		bitangents.push_back(bitangent);
		bitangents.push_back(bitangent);
		bitangents.push_back(bitangent);
	}

	// See "Going Further"
	for (unsigned int i = 0; i<vertices.size(); i += 1)
	{
		glm::vec3 & n = (glm::vec3)normals[i];
		glm::vec3 & t = (glm::vec3)tangents[i];
		glm::vec3 & b = (glm::vec3)bitangents[i];

		// Gram-Schmidt orthogonalize
		t = glm::normalize(t - n * glm::dot(n, t));

		// Calculate handedness
		if (glm::dot(glm::cross(n, t), b) < 0.0f) {
			t = t * -1.0f;
		}
	}

}