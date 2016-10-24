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
	float spotCutOff=0.9;
	vec3 h;
	float intSpec;
	vec4 spec = vec4(0.0);
	float a = 0.7;
	float b = 0;
	float c = 0.07;
	float attenuation;
	float distance;

	for(int i = 0; i<8; i++){
		vec3 n = normalize(DataIn.normal);
		vec3 l = normalize(DataIn.lightDir[i]);
		vec3 e = normalize(DataIn.eye);
		vec3 sd = normalize(vec3(-l_spotdir)); 
		if(i<=5){ //POINT	
			distance = length(DataIn.lightDir[i]);
			attenuation = 0.5/(a+(b*distance)+(c*distance*distance));
			intensity += max(dot(n,l), 0.0) * attenuation;
			if (intensity > 0.0) {
				h = normalize(l + e);
				intSpec = max(dot(h,n), 0.0);
				spec = spec + mat.specular * pow(intSpec, mat.shininess) * attenuation;
			}
		}
		else if(i==6){ //DIRECTIONAL
			intensity += max(dot(n,l), 0.0)*0.5;
			if (intensity > 0.0) {
				h = normalize(l + e);
				intSpec = max(dot(h,n), 0.0);
				spec = spec + mat.specular * pow(intSpec, mat.shininess)*0.5;
			}
		}
		else if(i==7){ //SPOT
			float cosSDL = dot(sd,l);
			float spotExponent = 100.0;
			if (cosSDL > spotCutOff) {
				distance = length(DataIn.lightDir[i]);
				attenuation = 2.0/(a+(b*distance)+(c*distance*distance)) * pow(cosSDL,spotExponent);
				intensity += max(dot(n,l), 0.0) * attenuation;
				if (intensity > 0.0) {
					h = normalize(l + e);
					intSpec = max(dot(h,n), 0.0);
					spec = spec + mat.specular * pow(intSpec, mat.shininess) * attenuation;
				}
			}
		}


	}
	colorOut = max((intensity * mat.diffuse + spec),mat.ambient);
	//colorOut = vec4(1.0f, 1.0f, 1.0f, 1.0f);
}