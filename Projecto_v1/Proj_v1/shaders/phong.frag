#version 330



uniform int texMode;
uniform sampler2D texmap0;
uniform sampler2D texmap1;
uniform sampler2D texmap2;
uniform sampler2D texmap3;
uniform sampler2D texmap4;
uniform sampler2D texmap5;
uniform sampler2D texmap6;
uniform sampler2D texmap7;
uniform sampler2D texmap8;
uniform sampler2D texmap9;
uniform sampler2D texmap10;
uniform sampler2D texmap11;
uniform sampler2D texmap12;
uniform sampler2D texmap13;
uniform sampler2D texmap14;
uniform sampler2D texmap15;
uniform sampler2D texmap16;
uniform sampler2D texmap17;
uniform sampler2D texmap18;
uniform sampler2D texmap19;
uniform sampler2D texmap20;
uniform sampler2D texmap21;
uniform sampler2D texmap22;
uniform sampler2D texmap23;
uniform sampler2D texmap24;

uniform vec2 doingtextv2;

out vec4 colorOut;
const vec3 fogColor = vec3(0.25, 0.1, 0.1);
const float FogDensity = 0.05;

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

  vec3 finalColor = vec3(0, 0, 0);
 //distance
  float dist = 0;
  float fogFactor = 0;
  dist = length(DataIn.eye.z);
  fogFactor = 1.0 /exp( (dist * FogDensity)* (dist * FogDensity));
  fogFactor = clamp( fogFactor, 0.0, 1.0 );

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
	vec4 texel, texel1, texel2;
	//int lol = doingText;

	
//OPTION A - NORMAL FRAGMENTS

//STEP 1 - spec & diff
	//se doingtext == 0
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
			intensity += max(dot(n,l), 0.0);
			if (intensity > 0.0) {
				h = normalize(l + e);
				intSpec = max(dot(h,n), 0.0);
				spec = spec + mat.specular * pow(intSpec, mat.shininess);
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
	if(mat.texCount == 0)
		texel = texture(texmap0, DataIn.tex_coord);
	else if(mat.texCount == 1)
		texel = texture(texmap1, DataIn.tex_coord);
	else if(mat.texCount == 2)
		texel = texture(texmap2, DataIn.tex_coord);
	else if(mat.texCount == 3)
		texel = texture(texmap3, DataIn.tex_coord);
	else if(mat.texCount == 4)
		texel = texture(texmap4, DataIn.tex_coord);
	else if(mat.texCount == 5)
		texel = texture(texmap5, DataIn.tex_coord);
	else if(mat.texCount == 6)
		texel = texture(texmap6, DataIn.tex_coord);
	else if(mat.texCount == 7)
		texel = texture(texmap7, DataIn.tex_coord);
	else if(mat.texCount == 8)
		texel = texture(texmap8, DataIn.tex_coord);
	else if(mat.texCount == 9)
		texel = texture(texmap9, DataIn.tex_coord);
	else if(mat.texCount == 10)
		texel = texture(texmap10, DataIn.tex_coord);
	else if(mat.texCount == 11)
		texel = texture(texmap11, DataIn.tex_coord);
	else if(mat.texCount == 12)
		texel = texture(texmap12, DataIn.tex_coord);
	else if(mat.texCount == 13)
		texel = texture(texmap13, DataIn.tex_coord);
	else if(mat.texCount == 14)
		texel = texture(texmap14, DataIn.tex_coord);
	else if(mat.texCount == 15)
		texel = texture(texmap15, DataIn.tex_coord);
	else if(mat.texCount == 16)
		texel = texture(texmap16, DataIn.tex_coord);
	else if(mat.texCount == 17)
		texel = texture(texmap17, DataIn.tex_coord);
	else if(mat.texCount == 18)
		texel = texture(texmap18, DataIn.tex_coord);
	else if(mat.texCount == 19)
		texel = texture(texmap19, DataIn.tex_coord);
	else if(mat.texCount == 20)
		texel = texture(texmap20, DataIn.tex_coord);
	else if(mat.texCount == 21)
		texel = texture(texmap21, DataIn.tex_coord);
	else if(mat.texCount == 22)
		texel = texture(texmap22, DataIn.tex_coord);
	else if(mat.texCount == 23)
		texel = texture(texmap23, DataIn.tex_coord);
	else if(mat.texCount == 24)
		texel = texture(texmap24, DataIn.tex_coord);
	
	if(texMode == 0) // modulate diffuse color with texel color
	{
		colorOut.rgb = max(intensity * mat.diffuse.rgb * texel.rgb + spec.rgb,mat.ambient.rgb * texel.rgb);
		colorOut.a = mat.ambient.a * texel.a;
	}
	else if (texMode == 1) // diffuse color is replaced by texel color, with specular area or ambient (0.1*texel)
	{
		colorOut.rgb = max(intensity*texel.rgb + spec.rgb, 0.1*texel.rgb);
		colorOut.a = mat.ambient.a * texel.a;
	}
	else if (texMode == 2) // multitexturing
	{
		texel1 = texture(texmap0, DataIn.tex_coord);  // texel from stars.tga
		texel2 = texture(texmap1, DataIn.tex_coord);  // texel from checker.tga
		vec4 possibleMix = texel1 * texel2;
		colorOut = max(intensity*texel1 + spec, possibleMix);
	}
	else if (texMode == 3) //use only texture
	{	
		if(texel.a == 0.0f) discard;
		colorOut.rgb = texel.rgb;
		colorOut.a = texel.a;
	}
	else if (texMode == 5) //writing
	{
		vec4 cor = vec4(1,1,1,1);
		vec4 texcolol = texture(texmap2, DataIn.tex_coord);
		if(texcolol[0]+texcolol[1]+texcolol[2] < 2.5) discard;
		colorOut = texcolol*cor;
	}
	else if (texMode == 6) // full texel color, with specular area or ambient (0.1*texel)
	{
		if (mat.ambient.a * texel.a == 0.0) discard;
		colorOut.rgb = max(texel.rgb + spec.rgb, 0.1*texel.rgb);
		colorOut.a = mat.ambient.a * texel.a;
	}
	else { //do not use texture // 4
		colorOut = max((intensity * mat.diffuse + spec),mat.ambient);
	}

	if(mat.texCount!=0 && mat.texCount!=2 && mat.texCount!=10 && mat.texCount!=11 && mat.texCount!=12 && mat.texCount!=13 && mat.texCount!=14 ){
		finalColor=colorOut.rgb;
		colorOut.rgb = mix(fogColor, finalColor, fogFactor);
	}


//OPTION B - DRAWING LETTERS
	
	
//END
	//colourOut has been defined
}