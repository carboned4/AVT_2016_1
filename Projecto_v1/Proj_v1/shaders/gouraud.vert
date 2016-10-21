#version 330

uniform mat4 m_pvm;
uniform mat4 m_viewModel;
uniform mat3 m_normal;

uniform vec4 l_pospoint0;

in vec4 position;
in vec4 normal;    //por causa do gerador de geometria

out vec4 colorG;

struct Materials {
	vec4 diffuse;
	vec4 ambient;
	vec4 specular;
	vec4 emissive;
	float shininess;
	int texCount;
};


uniform Materials mat;

void main () {

	vec4 pos = m_viewModel * position;

	vec3 normalG = normalize(m_normal * normal.xyz);
	vec3 lightDirG = vec3(l_pospoint0 - pos);
	vec3 eyeG = vec3(-pos);

	vec4 spec = vec4(0.0);

	
	vec3 n = normalize(normalG);
	vec3 l = normalize(lightDirG);
	vec3 e = normalize(eyeG);

	float intensity = max(dot(n,l), 0.0);

	
	if (intensity > 0.0) {

		vec3 h = normalize(l + e);
		float intSpec = max(dot(h,n), 0.0);
		spec = mat.specular * pow(intSpec, mat.shininess);
	}
	
	colorG = max((intensity * mat.diffuse + spec), mat.ambient);

	gl_Position = m_pvm * position;	
}