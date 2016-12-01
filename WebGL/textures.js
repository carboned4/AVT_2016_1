

var texturesLeft = 0;
var gunshipnormalTex;


function handleLoadedTexture(texture) {
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	// Set up texture so we can render any size image and so we are
// working with pixels.

	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameterf(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);
    gl.texParameterf(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.REPEAT);

	//gl.generateMipmap(gl.TEXTURE_2D);


	gl.bindTexture(gl.TEXTURE_2D, null);
	texturesLeft-=1;
}


function loadSpaceshipTexture(){
	texturesLeft+=1;
	gunshipnormalTex = gl.createTexture();
	gunshipnormalTex.image = new Image();
	gunshipnormalTex.image.onload = function () {
		handleLoadedTexture(gunshipnormalTex);
	}
	gunshipnormalTex.image.src = "images/GunshipSheet_bump.png";
}
