#version 330

const int I_POINT = 0;
const int I_DIR = 1;
const int I_SPOT = 2;

uniform mat4 m_pvm;
uniform mat4 m_viewModel;
uniform mat3 m_normal;
uniform vec3 lightState;

uniform int texMode;
uniform float textureShift;

uniform vec4 l_pospoint0, l_pospoint1, l_pospoint2, l_pospoint3, l_pospoint4, l_pospoint5;
uniform vec4 l_posdir;
uniform vec4 l_posspot;
uniform int l_pointOn;
uniform bool l_dirOn;
uniform bool l_spotOn;


struct Materials {
	vec4 diffuse;
	vec4 ambient;
	vec4 specular;
	vec4 emissive;
	float shininess;
	int texCount;
};

uniform Materials mat;

in vec4 position;
in vec4 normal;    //por causa do gerador de geometria
in vec4 texCoord;
in vec4 tangent;
in vec2 vVertex;
in vec2 vtexCoord;

out Data {
	vec3 normal;
	vec3 eye;
	vec3 tangent;
	vec3 bitangent;
	vec3 lightDir[8];
	vec2 tex_coord;
	vec3 halfVec;
} DataOut;

void main () {
	if(texMode == 5){
		DataOut.tex_coord = vtexCoord;
		gl_Position = m_pvm * vec4(vVertex, 0.0, 1.0);
	}
	else {
		vec4 pos = m_viewModel * position;
		int lightForBump = 2;
		DataOut.normal = normalize(m_normal * normal.xyz);
		DataOut.tangent = normalize(m_normal * tangent.xyz);
		DataOut.bitangent = tangent.w * cross (DataOut.normal,DataOut.tangent);
		DataOut.eye = vec3(-pos);
		vec3 v;

		if(lightState[I_POINT] == 1.0f){
			DataOut.lightDir[0] = vec3(l_pospoint0 - pos);
			DataOut.lightDir[1] = vec3(l_pospoint1 - pos);
			DataOut.lightDir[2] = vec3(l_pospoint2 - pos);
			DataOut.lightDir[3] = vec3(l_pospoint3 - pos);
			DataOut.lightDir[4] = vec3(l_pospoint4 - pos);
			DataOut.lightDir[5] = vec3(l_pospoint5 - pos);
			if(mat.texCount == 15){
				v.x = dot (DataOut.lightDir[ lightForBump ], DataOut.tangent);
				v.y = dot (DataOut.lightDir[ lightForBump ], DataOut.bitangent);
				v.z = dot (DataOut.lightDir[ lightForBump ], DataOut.normal);
				DataOut.lightDir[ lightForBump ] = normalize(v);
				vec3 halfVector = normalize(vec3(l_pospoint0 - pos) - DataOut.eye);
				v.x = dot (halfVector, DataOut.tangent);
				v.y = dot (halfVector, DataOut.bitangent);
				v.z = dot (halfVector, DataOut.normal);
				DataOut.halfVec = normalize(v);
			}
		}
		else{
			DataOut.lightDir[0] = vec3(0);
			DataOut.lightDir[1] = vec3(0);
			DataOut.lightDir[2] = vec3(0);
			DataOut.lightDir[3] = vec3(0);
			DataOut.lightDir[4] = vec3(0);
			DataOut.lightDir[5] = vec3(0);
			if(mat.texCount == 15){
				v.x = dot (DataOut.lightDir[ lightForBump ], DataOut.tangent);
				v.y = dot (DataOut.lightDir[ lightForBump ], DataOut.bitangent);
				v.z = dot (DataOut.lightDir[ lightForBump ], DataOut.normal);
				DataOut.lightDir[ lightForBump ] = normalize(v);
				vec3 halfVector = normalize(vec3(0) - DataOut.eye);
				v.x = dot (halfVector, DataOut.tangent);
				v.y = dot (halfVector, DataOut.bitangent);
				v.z = dot (halfVector, DataOut.normal);
				DataOut.halfVec = normalize(v);
			}
		}
		if(lightState[I_DIR] == 1.0f){
			DataOut.lightDir[6] = vec3(l_posdir - pos);
		}
		else{
			DataOut.lightDir[6] = vec3(0);
		}
		if(lightState[I_SPOT] == 1.0f){
			DataOut.lightDir[7] = vec3(l_posspot - pos);
		}
		else{
			DataOut.lightDir[7] = vec3(0);
		}
		DataOut.tex_coord = texCoord.st;
		gl_Position = m_pvm * position;
	}
}