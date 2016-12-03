function Skybox(_x,_y,_z) {
	this.position = v3(_x,_y,_z);
}


var skyboxVertexPositionBuffer;
var skyboxVertexNormalBuffer;
var skyboxVertexTextureCoordBuffer;
var skyboxVertexIndexBuffer;

Skybox.prototype.draw = function(){
	pushModelMatrix();
	mat4.translate(modelMatrix,[this.position.X-20,this.position.Y-20,this.position.Z+20]);
	mat4.scale(modelMatrix, [1,20,1]);
	
	gl.uniform4f(shaderProgram.materialAmbientColorUniform, 0.1, 0.25, 0.1, 1.0);
	gl.uniform4f(shaderProgram.materialDiffuseColorUniform, 0.1, 0.9, 0.1, 1.0);
	gl.uniform4f(shaderProgram.materialSpecularColorUniform, 0.9, -0.5, 0.1, 1.0);
	gl.uniform1f(shaderProgram.materialShininessUniform, 200.0);
	gl.uniform1i(shaderProgram.texMode_uniformId,2);
	
	gl.uniform1i(shaderProgram.materialTexCount, 0);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, starsTex);
	gl.uniform1i(shaderProgram.tex_loc0, 0);
	
	this.sendGeometry();
	popModelMatrix();

}

Skybox.prototype.sendGeometry = function(){
	gl.bindBuffer(gl.ARRAY_BUFFER, skyboxVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexposAttribute, skyboxVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, skyboxVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.texcoordAttribute, skyboxVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, skyboxVertexNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.normalAttribute, skyboxVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, skyboxVertexIndexBuffer);
	
	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, skyboxVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function handleLoadedSkybox(skyboxData) {
	
	skyboxVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, skyboxVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(skyboxData.vertexNormals), gl.STATIC_DRAW);
	skyboxVertexNormalBuffer.itemSize = 3;
	skyboxVertexNormalBuffer.numItems = skyboxData.vertexNormals.length / 3;

	skyboxVertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, skyboxVertexTextureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(skyboxData.vertexTextureCoords), gl.STATIC_DRAW);
	skyboxVertexTextureCoordBuffer.itemSize = 2;
	skyboxVertexTextureCoordBuffer.numItems = skyboxData.vertexTextureCoords.length / 2;

	skyboxVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, skyboxVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(skyboxData.vertexPositions), gl.STATIC_DRAW);
	skyboxVertexPositionBuffer.itemSize = 3;
	skyboxVertexPositionBuffer.numItems = skyboxData.vertexPositions.length / 3;

	skyboxVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, skyboxVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(skyboxData.indices), gl.STREAM_DRAW);
	skyboxVertexIndexBuffer.itemSize = 1;
	skyboxVertexIndexBuffer.numItems = skyboxData.indices.length;
}



function loadSkybox() {
	var request = new XMLHttpRequest();
	request.open("GET", "OBJskybox.json");
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			handleLoadedSkybox(JSON.parse(request.responseText));
		}
	}
	request.send();
}