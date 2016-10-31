#version 330

out vec4 colorOut;

uniform int texMode;
uniform sampler2D texmap0;
uniform sampler2D texmap1;
uniform sampler2D texmap2;
uniform sampler2D texmap3;
uniform sampler2D texmap4;

uniform vec2 doingtextv2;


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

uniform int doingText;

in Data {
	vec3 normal;
	vec3 eye;
	vec3 lightDir[8];
	vec2 tex_coord;
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
	vec4 texel, texel2;
	int lol = doingText;

//OPTION A - DRAWING LETTERS
	if(2 == 1){
		//vec4 cor = vec4(1,1,1,1);
		//colorOut = texture(texmap2, DataIn.tex_coord)*cor;
		colorOut = vec4(1.0, 1.0, 1.0, 1.0);
	}
	
//OPTION B - NORMAL FRAGMENTS

//STEP 1 - spec & diff
	else{
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
	
//STEP 2 - textures

		if(texMode == 0) // modulate diffuse color with texel color
		{
			texel = texture(texmap2, DataIn.tex_coord);  // texel from lighwood.tga
			colorOut = max(intensity * mat.diffuse * texel + spec,mat.ambient * texel);
		}
		else if (texMode == 1) // diffuse color is replaced by texel color, with specular area or ambient (0.1*texel)
		{
			texel = texture(texmap2, DataIn.tex_coord);  // texel from stone.tga
			colorOut = max(intensity*texel + spec, 0.1*texel);
		}
		else if (texMode == 2) // multitexturing
		{
			texel = texture(texmap0, DataIn.tex_coord);  // texel from lighwood.tga
			texel2 = texture(texmap1, DataIn.tex_coord);  // texel from checker.tga
			colorOut = texel * texel2;
		}
		else if (texMode == 3) //use only texture
		{
			texel = texture(texmap0, DataIn.tex_coord); 
			colorOut = texel;
		}
		else { //do not use texture
			colorOut = max((intensity * mat.diffuse + spec),mat.ambient);
		}
	}
	//colorOut = vec4(1.0, 1.0, 1.0, 1.0);
	
//END
	//colourOut has been defined
}