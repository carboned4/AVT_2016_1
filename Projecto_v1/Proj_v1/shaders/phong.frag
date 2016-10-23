#version 330

out vec4 colorOut;

struct Materials {
	vec4 diffuse;
	vec4 ambient;
	vec4 specular;
	vec4 emissive;
	float shininess;
	int texCount;
};

uniform Materials mat;

uniform vec4 l_spotdir;

in Data {
	vec3 normal;
	vec3 eye;
	vec3 lightDir[8];
} DataIn;

void main() {
	float intensity = 0.0f;
	float spotCutOff=0.99;
	vec3 h;
	float intSpec;
	vec4 spec = vec4(0.0);
	
	for(int i = 0; i<8; i++){
		vec3 n = normalize(DataIn.normal);
		vec3 l = normalize(DataIn.lightDir[i]);
		vec3 e = normalize(DataIn.eye);
		vec3 sd = normalize(vec3(-l_spotdir)); 
		if(i<=5){ //POINT	
			intensity += max(dot(n,l), 0.0);
			if (intensity > 0.0) {
				h = normalize(l + e);
				intSpec = max(dot(h,n), 0.0);
				spec = spec + mat.specular * pow(intSpec, mat.shininess);
			}
		}
		else if(i==6){ //DIRECTIONAL
			intensity += max(dot(n,l), 0.0);
			if (intensity > 0.0) {
				h = normalize(l + e);
				intSpec = max(dot(h,n), 0.0);
				spec = spec + mat.specular * pow(intSpec, mat.shininess);
			}
		}
		else if(i==7){ //SPOT
			if (dot(sd,l) > spotCutOff) {
				intensity += max(dot(n,l), 0.0);
				if (intensity > 0.0) {
					h = normalize(l + e);
					intSpec = max(dot(h,n), 0.0);
					spec = spec + mat.specular * pow(intSpec, mat.shininess);
				}
			}
		}


	}
	colorOut = max((intensity * mat.diffuse + spec),mat.ambient);
	//colorOut = vec4(1.0f, 1.0f, 1.0f, 1.0f);
}