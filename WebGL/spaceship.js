function Spaceship(limitL, limitR) {
	this.position = v3(0.0, 0.0, 0.0);
    this.speed = v3(0.0, 0.0, 0.0);
	this.limitLeft = limitL;
	this.limitRight = limitR;
	this.accelerationModulus = v3(6.0, 0.0, 0.0);
	this.maxSpeed = v3(4.0, 0.0, 0.0);
	this.speedAngleEffectVec = v3(0.0, 0.0, 0.0);
	this.draw;
	this.sendGeometry;
}

var spaceshipVertexPositionBuffer;
var spaceshipVertexNormalBuffer;
var spaceshipVertexTextureCoordBuffer;
var spaceshipVertexIndexBuffer;
var spaceshipVertexTangentBuffer;


Spaceship.prototype.draw = function(){
	mvPushMatrix(mvMatrix);
	gl.uniform4f(shaderProgram.materialDiffuseColorUniform, 0, 0, 0,1.0);
	gl.uniform4f(shaderProgram.materialSpecularColorUniform, 0, 0, 0,1.0);
	gl.uniform1f(shaderProgram.materialShininessUniform, 5);
	gl.uniform1i(shaderProgram.texting_mode,1);
	gl.activeTexture(gl.TEXTURE9);
	//gl.bindTexture(gl.TEXTURE_2D, candleTex);
	gl.uniform1i(shaderProgram.samplerUniform, 9);
		 mat4.translate(mvMatrix,[this.posX,this.posY-3,this.posZ]);
		 mat4.rotate(mvMatrix,rad(180),[0,0,1]);
		 mat4.scale(mvMatrix, [0.2,0.2,0.2]);
	this.sendGeometry();
	mvPopMatrix(mvMatrix);


}

Spaceship.prototype.sendGeometry = function(){
	gl.bindBuffer(gl.ARRAY_BUFFER, spaceshipVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexposAttribute, spaceshipVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, spaceshipVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.texcoordAttribute, spaceshipVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, spaceshipVertexNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.normalAttribute, spaceshipVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	//gl.bindBuffer(gl.ARRAY_BUFFER, spaceshipVertexTangentBuffer);
	//gl.vertexAttribPointer(shaderProgram.tangentAttribute, spaceshipVertexTangentBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, spaceshipVertexIndexBuffer);
	
	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, spaceshipVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}
var poop;
function handleLoadedSpaceship(spaceshipData) {
	poop = spaceshipData;
	spaceshipVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, spaceshipVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(spaceshipData.vertexNormals), gl.STATIC_DRAW);
	spaceshipVertexNormalBuffer.itemSize = 3;
	spaceshipVertexNormalBuffer.numItems = spaceshipData.vertexNormals.length / 3;

	spaceshipVertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, spaceshipVertexTextureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(spaceshipData.vertexTextureCoords), gl.STATIC_DRAW);
	spaceshipVertexTextureCoordBuffer.itemSize = 2;
	spaceshipVertexTextureCoordBuffer.numItems = spaceshipData.vertexTextureCoords.length / 2;

	spaceshipVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, spaceshipVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(spaceshipData.vertexPositions), gl.STATIC_DRAW);
	spaceshipVertexPositionBuffer.itemSize = 3;
	spaceshipVertexPositionBuffer.numItems = spaceshipData.vertexPositions.length / 3;

	spaceshipVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, spaceshipVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(spaceshipData.indices), gl.STREAM_DRAW);
	spaceshipVertexIndexBuffer.itemSize = 1;
	spaceshipVertexIndexBuffer.numItems = spaceshipData.indices.length;
}

function loadSpaceship() {
	var request = new XMLHttpRequest();
	request.open("GET", "OBJgunship.json");
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			handleLoadedSpaceship(JSON.parse(request.responseText));
		}
	}
	request.send();
}