function Head(_x,_y,_z) {
	this.position = v3(_x,_y,_z);
}


Head.prototype.update = function(delta){
	
}


var headVertexPositionBuffer;
var headVertexNormalBuffer;
var headVertexTextureCoordBuffer;
var headVertexIndexBuffer;

var hairVertexPositionBuffer;
var hairVertexNormalBuffer;
var hairVertexTextureCoordBuffer;
var hairVertexIndexBuffer;



Head.prototype.draw = function(){
	pushModelMatrix();
	mat4.translate(modelMatrix,[this.position.X,this.position.Y-24,this.position.Z-10]);
	mat4.rotate(modelMatrix, rad(20),[0,1,0]);
	mat4.scale(modelMatrix,[2,2,2]);
	
	gl.uniform4f(shaderProgram.materialAmbientColorUniform, 0.1, 0.1, 0.1, 1.0);
	gl.uniform4f(shaderProgram.materialDiffuseColorUniform, 0.5, 0.5, 0.5, 1.0);
	gl.uniform4f(shaderProgram.materialSpecularColorUniform, 1.0, 1.0, 1.0, 1.0);
	gl.uniform1f(shaderProgram.materialShininessUniform, 10.0);
	
	gl.uniform1i(shaderProgram.texMode_uniformId,3);
	gl.uniform1i(shaderProgram.materialTexCount, 15);
	gl.activeTexture(gl.TEXTURE15);
	gl.bindTexture(gl.TEXTURE_2D, headTex);
	gl.uniform1i(shaderProgram.tex_loc15, 15);
	
	this.sendHeadGeometry();
	
	gl.uniform1i(shaderProgram.materialTexCount, 3);
	gl.activeTexture(gl.TEXTURE3);
	gl.bindTexture(gl.TEXTURE_2D, head2Tex);
	gl.uniform1i(shaderProgram.tex_loc3, 3);
	
	this.sendHairGeometry();
	popModelMatrix();

}

Head.prototype.sendHeadGeometry = function(){
	gl.bindBuffer(gl.ARRAY_BUFFER, headVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexposAttribute, headVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, headVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.texcoordAttribute, headVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, headVertexNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.normalAttribute, headVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, headVertexIndexBuffer);
	
	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, headVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

Head.prototype.sendHairGeometry = function(){
	gl.bindBuffer(gl.ARRAY_BUFFER, hairVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexposAttribute, hairVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, hairVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.texcoordAttribute, hairVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, hairVertexNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.normalAttribute, hairVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, hairVertexIndexBuffer);
	
	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, hairVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}


function handleLoadedHead(headData) {
	
	headVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, headVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(headData.vertexNormals), gl.STATIC_DRAW);
	headVertexNormalBuffer.itemSize = 3;
	headVertexNormalBuffer.numItems = headData.vertexNormals.length / 3;

	headVertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, headVertexTextureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(headData.vertexTextureCoords), gl.STATIC_DRAW);
	headVertexTextureCoordBuffer.itemSize = 2;
	headVertexTextureCoordBuffer.numItems = headData.vertexTextureCoords.length / 2;

	headVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, headVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(headData.vertexPositions), gl.STATIC_DRAW);
	headVertexPositionBuffer.itemSize = 3;
	headVertexPositionBuffer.numItems = headData.vertexPositions.length / 3;

	headVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, headVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(headData.indices), gl.STREAM_DRAW);
	headVertexIndexBuffer.itemSize = 1;
	headVertexIndexBuffer.numItems = headData.indices.length;
}

function handleLoadedHair(hairData) {
	
	hairVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, hairVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(hairData.vertexNormals), gl.STATIC_DRAW);
	hairVertexNormalBuffer.itemSize = 3;
	hairVertexNormalBuffer.numItems = hairData.vertexNormals.length / 3;

	hairVertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, hairVertexTextureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(hairData.vertexTextureCoords), gl.STATIC_DRAW);
	hairVertexTextureCoordBuffer.itemSize = 2;
	hairVertexTextureCoordBuffer.numItems = hairData.vertexTextureCoords.length / 2;

	hairVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, hairVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(hairData.vertexPositions), gl.STATIC_DRAW);
	hairVertexPositionBuffer.itemSize = 3;
	hairVertexPositionBuffer.numItems = hairData.vertexPositions.length / 3;

	hairVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, hairVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(hairData.indices), gl.STREAM_DRAW);
	hairVertexIndexBuffer.itemSize = 1;
	hairVertexIndexBuffer.numItems = hairData.indices.length;
}


function loadHead() {
	var request = new XMLHttpRequest();
	request.open("GET", "OBJhead.json");
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			handleLoadedHead(JSON.parse(request.responseText));
		}
	}
	request.send();
	var request2 = new XMLHttpRequest();
	request2.open("GET", "OBJhair.json");
	request2.onreadystatechange = function () {
		if (request2.readyState == 4) {
			handleLoadedHair(JSON.parse(request2.responseText));
		}
	}
	request2.send();
}