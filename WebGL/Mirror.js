function Mirror(_x,_y,_z) {
	this.position = v3(_x,_y,_z);
}


var mirrorVertexPositionBuffer;
var mirrorVertexNormalBuffer;
var mirrorVertexTextureCoordBuffer;
var mirrorVertexIndexBuffer;

var mirrorStencilVertexPositionBuffer;
var mirrorStencilVertexNormalBuffer;
var mirrorStencilVertexTextureCoordBuffer;
var mirrorStencilVertexIndexBuffer;


Mirror.prototype.draw = function(){
	pushModelMatrix();
	mat4.translate(modelMatrix,[this.position.X,this.position.Y,this.position.Z+10]);
	mat4.rotate(modelMatrix,rad(90),[-1,0,0]);
	
	gl.uniform4f(shaderProgram.materialAmbientColorUniform, 0.2, 0.2, 0.2, 0.5);
	gl.uniform4f(shaderProgram.materialDiffuseColorUniform, 0, 0, 0, 0);
	gl.uniform4f(shaderProgram.materialSpecularColorUniform, 0.5, 0.5, 0.5, 0.5);
	gl.uniform1f(shaderProgram.materialShininessUniform, 1000.0);
	gl.uniform1i(shaderProgram.texMode_uniformId,4);
	
	gl.uniform1i(shaderProgram.materialTexCount, 8);
	gl.activeTexture(gl.TEXTURE8);
	gl.bindTexture(gl.TEXTURE_2D, earthTex);
	gl.uniform1i(shaderProgram.tex_loc8, 8);
	
	this.sendMirrorGeometry();
	popModelMatrix();

}

Mirror.prototype.fillStencil = function(){
	pushModelMatrix();
	mat4.translate(modelMatrix,[this.position.X,this.position.Y,this.position.Z+10]);
	mat4.rotate(modelMatrix,rad(90),[-1,0,0]);
	
	gl.uniform4f(shaderProgram.materialAmbientColorUniform, 0, 0, 0, 1);
	gl.uniform4f(shaderProgram.materialDiffuseColorUniform, 0, 0, 0, 1);
	gl.uniform4f(shaderProgram.materialSpecularColorUniform, 0, 0, 0, 1);
	gl.uniform1f(shaderProgram.materialShininessUniform, 20.0);
	gl.uniform1i(shaderProgram.texMode_uniformId,4);
	
	gl.uniform1i(shaderProgram.materialTexCount, 9);
	gl.activeTexture(gl.TEXTURE9);
	gl.bindTexture(gl.TEXTURE_2D, cloudTex);
	gl.uniform1i(shaderProgram.tex_loc9, 9);
	
	this.sendMirrorStencilGeometry();
	popModelMatrix();

}

Mirror.prototype.sendMirrorGeometry = function(){
	gl.bindBuffer(gl.ARRAY_BUFFER, mirrorVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexposAttribute, mirrorVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, mirrorVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.texcoordAttribute, mirrorVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, mirrorVertexNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.normalAttribute, mirrorVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mirrorVertexIndexBuffer);
	
	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, mirrorVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

Mirror.prototype.sendMirrorStencilGeometry = function(){
	gl.bindBuffer(gl.ARRAY_BUFFER, mirrorStencilVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexposAttribute, mirrorStencilVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, mirrorStencilVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.texcoordAttribute, mirrorStencilVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, mirrorStencilVertexNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.normalAttribute, mirrorStencilVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mirrorStencilVertexIndexBuffer);
	
	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, mirrorStencilVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function handleLoadedMirror(mirrorData) {
	
	mirrorVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, mirrorVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mirrorData.vertexNormals), gl.STATIC_DRAW);
	mirrorVertexNormalBuffer.itemSize = 3;
	mirrorVertexNormalBuffer.numItems = mirrorData.vertexNormals.length / 3;

	mirrorVertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, mirrorVertexTextureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mirrorData.vertexTextureCoords), gl.STATIC_DRAW);
	mirrorVertexTextureCoordBuffer.itemSize = 2;
	mirrorVertexTextureCoordBuffer.numItems = mirrorData.vertexTextureCoords.length / 2;

	mirrorVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, mirrorVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mirrorData.vertexPositions), gl.STATIC_DRAW);
	mirrorVertexPositionBuffer.itemSize = 3;
	mirrorVertexPositionBuffer.numItems = mirrorData.vertexPositions.length / 3;

	mirrorVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mirrorVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mirrorData.indices), gl.STREAM_DRAW);
	mirrorVertexIndexBuffer.itemSize = 1;
	mirrorVertexIndexBuffer.numItems = mirrorData.indices.length;
}


function handleLoadedMirrorStencils(mirrorStencilData) {
	
	mirrorStencilVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, mirrorStencilVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mirrorStencilData.vertexNormals), gl.STATIC_DRAW);
	mirrorStencilVertexNormalBuffer.itemSize = 3;
	mirrorStencilVertexNormalBuffer.numItems = mirrorStencilData.vertexNormals.length / 3;

	mirrorStencilVertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, mirrorStencilVertexTextureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mirrorStencilData.vertexTextureCoords), gl.STATIC_DRAW);
	mirrorStencilVertexTextureCoordBuffer.itemSize = 2;
	mirrorStencilVertexTextureCoordBuffer.numItems = mirrorStencilData.vertexTextureCoords.length / 2;

	mirrorStencilVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, mirrorStencilVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mirrorStencilData.vertexPositions), gl.STATIC_DRAW);
	mirrorStencilVertexPositionBuffer.itemSize = 3;
	mirrorStencilVertexPositionBuffer.numItems = mirrorStencilData.vertexPositions.length / 3;

	mirrorStencilVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mirrorStencilVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mirrorStencilData.indices), gl.STREAM_DRAW);
	mirrorStencilVertexIndexBuffer.itemSize = 1;
	mirrorStencilVertexIndexBuffer.numItems = mirrorStencilData.indices.length;
}

function loadMirror() {
	var quadindices = createQuad(20, 20);
	mirrorVertexPositionBuffer = quadindices[0];
	mirrorVertexNormalBuffer = quadindices[1];
	mirrorVertexTextureCoordBuffer = quadindices[2];
	mirrorVertexIndexBuffer = quadindices[3];
	mirrorStencilVertexPositionBuffer = quadindices[0];
	mirrorStencilVertexNormalBuffer = quadindices[1];
	mirrorStencilVertexTextureCoordBuffer = quadindices[2];
	mirrorStencilVertexIndexBuffer = quadindices[3];
}