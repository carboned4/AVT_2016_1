function Planet(_x,_y,_z) {
	this.position = v3(_x,_y,_z);
    this.angleSurface = 90.0;
	this.angleAtmosphere = 0.0;
	this.degPerSecSurface = 10.0;
	this.degPerSecAtmosphere = -5.0;
	
}



Planet.prototype.update = function(delta){
	this.angleSurface += this.degPerSecSurface * (delta/1000);
	this.angleAtmosphere += this.degPerSecAtmosphere * (delta/1000);
}


var surfaceVertexPositionBuffer;
var surfaceVertexNormalBuffer;
var surfaceVertexTextureCoordBuffer;
var surfaceVertexIndexBuffer;

var cloudVertexPositionBuffer;
var cloudVertexNormalBuffer;
var cloudVertexTextureCoordBuffer;
var cloudVertexIndexBuffer;


Planet.prototype.draw = function(){
	pushModelMatrix();
	mat4.translate(modelMatrix,[this.position.X,this.position.Y-1,this.position.Z]);
	mat4.rotate(modelMatrix,rad(-23),[1,0,0]);
	mat4.rotate(modelMatrix,rad(this.angleSurface),[0,1,0]);
	mat4.scale(modelMatrix, [250,250,250]);
	
	gl.uniform4f(shaderProgram.materialAmbientColorUniform, 0.1, 0.1, 0.25, 1.0);
	gl.uniform4f(shaderProgram.materialDiffuseColorUniform, 0.75, 0.75, 0.75, 1.0);
	gl.uniform4f(shaderProgram.materialSpecularColorUniform, 0.5, 0.5, 0.5, 1.0);
	gl.uniform1f(shaderProgram.materialShininessUniform, 100.0);
	gl.uniform1i(shaderProgram.texMode_uniformId,0);
	
	gl.uniform1i(shaderProgram.materialTexCount, 8);
	gl.activeTexture(gl.TEXTURE8);
	gl.bindTexture(gl.TEXTURE_2D, earthTex);
	gl.uniform1i(shaderProgram.tex_loc8, 8);
	
	this.sendSurfaceGeometry();
	popModelMatrix();

}

Planet.prototype.sendSurfaceGeometry = function(){
	gl.bindBuffer(gl.ARRAY_BUFFER, surfaceVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexposAttribute, surfaceVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, surfaceVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.texcoordAttribute, surfaceVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, surfaceVertexNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.normalAttribute, surfaceVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, surfaceVertexIndexBuffer);
	
	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, surfaceVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

Planet.prototype.sendCloudGeometry = function(){
	gl.bindBuffer(gl.ARRAY_BUFFER, cloudVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexposAttribute, cloudVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, cloudVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.texcoordAttribute, cloudVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, cloudVertexNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.normalAttribute, cloudVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cloudVertexIndexBuffer);
	
	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, cloudVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function handleLoadedSurface(surfaceData) {
	
	surfaceVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, surfaceVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(surfaceData.vertexNormals), gl.STATIC_DRAW);
	surfaceVertexNormalBuffer.itemSize = 3;
	surfaceVertexNormalBuffer.numItems = surfaceData.vertexNormals.length / 3;

	surfaceVertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, surfaceVertexTextureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(surfaceData.vertexTextureCoords), gl.STATIC_DRAW);
	surfaceVertexTextureCoordBuffer.itemSize = 2;
	surfaceVertexTextureCoordBuffer.numItems = surfaceData.vertexTextureCoords.length / 2;

	surfaceVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, surfaceVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(surfaceData.vertexPositions), gl.STATIC_DRAW);
	surfaceVertexPositionBuffer.itemSize = 3;
	surfaceVertexPositionBuffer.numItems = surfaceData.vertexPositions.length / 3;

	surfaceVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, surfaceVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(surfaceData.indices), gl.STREAM_DRAW);
	surfaceVertexIndexBuffer.itemSize = 1;
	surfaceVertexIndexBuffer.numItems = surfaceData.indices.length;
}


function handleLoadedClouds(cloudData) {
	
	cloudVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cloudVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cloudData.vertexNormals), gl.STATIC_DRAW);
	cloudVertexNormalBuffer.itemSize = 3;
	cloudVertexNormalBuffer.numItems = cloudData.vertexNormals.length / 3;

	cloudVertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cloudVertexTextureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cloudData.vertexTextureCoords), gl.STATIC_DRAW);
	cloudVertexTextureCoordBuffer.itemSize = 2;
	cloudVertexTextureCoordBuffer.numItems = cloudData.vertexTextureCoords.length / 2;

	cloudVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cloudVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cloudData.vertexPositions), gl.STATIC_DRAW);
	cloudVertexPositionBuffer.itemSize = 3;
	cloudVertexPositionBuffer.numItems = cloudData.vertexPositions.length / 3;

	cloudVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cloudVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cloudData.indices), gl.STREAM_DRAW);
	cloudVertexIndexBuffer.itemSize = 1;
	cloudVertexIndexBuffer.numItems = cloudData.indices.length;
}

function loadPlanet() {
	var request = new XMLHttpRequest();
	request.open("GET", "OBJsphere.json");
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			handleLoadedSurface(JSON.parse(request.responseText));
			handleLoadedClouds(JSON.parse(request.responseText));
		}
	}
	request.send();
}