#version 330

uniform mat4 m_pvm;
uniform mat4 m_viewModel;
uniform mat3 m_normal;

uniform vec4 l_pospoint0, l_pospoint1, l_pospoint2, l_pospoint3, l_pospoint4, l_pospoint5;
uniform vec4 l_posdir;
uniform vec4 l_posspot;
in vec4 position;
in vec4 normal;    //por causa do gerador de geometria

out Data {
	vec3 normal;
	vec3 eye;
	vec3 lightDir;
} DataOut;

void main () {

	vec4 pos = m_viewModel * position;

	DataOut.normal = normalize(m_normal * normal.xyz);
	DataOut.lightDir = vec3(l_pospoint0 - pos);
	DataOut.eye = vec3(-pos);

	gl_Position = m_pvm * position;	
}