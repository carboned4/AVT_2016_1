function SpaceshipShot(_x,_y,_z) {
	this.position = v3(_x,_y,_z);
    this.speedModulus = 2.0;
	this.speed = v3(0.0, 0.0, this.speedModulus);
	this.elapsedLife = 0.0;
	this.texcount = 5;
	this.colRadius = 0.1;
}


SpaceshipShot.prototype.update = function(delta){
	this.position = v3add(this.position,v3mul(delta / 1000.0,this.speed));
	this.elapsedLife += delta/1000.0;
	
}


var spaceshipShotVertexPositionBuffer;
var spaceshipShotVertexNormalBuffer;
var spaceshipShotVertexTextureCoordBuffer;
var spaceshipShotVertexIndexBuffer;



SpaceshipShot.prototype.draw = function(){
	pushModelMatrix();
	mat4.translate(modelMatrix,[this.position.X+0.1,this.position.Y,this.position.Z]);
	//mat4.rotate(modelMatrix,rad(-90),[0,1,0]);
	mat4.scale(modelMatrix, [0.1,0.1,0.1]);
	
	gl.uniform4f(shaderProgram.materialAmbientColorUniform, 0.2, 0.2, 0.2, 1.0);
	gl.uniform4f(shaderProgram.materialDiffuseColorUniform, 0.5, 0.5, 0.5, 1.0);
	gl.uniform4f(shaderProgram.materialSpecularColorUniform, -0.5, -0.5, -0.5, 1.0);
	gl.uniform1f(shaderProgram.materialShininessUniform, 50.0);
	gl.uniform1i(shaderProgram.texMode_uniformId,4);
	
	
	this.sendGeometry();
	popModelMatrix();

}

SpaceshipShot.prototype.sendGeometry = function(){
	gl.bindBuffer(gl.ARRAY_BUFFER, spaceshipShotVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexposAttribute, spaceshipShotVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, spaceshipShotVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.texcoordAttribute, spaceshipShotVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, spaceshipShotVertexNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.normalAttribute, spaceshipShotVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, spaceshipShotVertexIndexBuffer);
	
	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, spaceshipShotVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}


function handleLoadedSpaceshipShot(spaceshipshotData) {
	
	spaceshipShotVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, spaceshipShotVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(spaceshipshotData.vertexNormals), gl.STATIC_DRAW);
	spaceshipShotVertexNormalBuffer.itemSize = 3;
	spaceshipShotVertexNormalBuffer.numItems = spaceshipshotData.vertexNormals.length / 3;

	spaceshipShotVertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, spaceshipShotVertexTextureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(spaceshipshotData.vertexTextureCoords), gl.STATIC_DRAW);
	spaceshipShotVertexTextureCoordBuffer.itemSize = 2;
	spaceshipShotVertexTextureCoordBuffer.numItems = spaceshipshotData.vertexTextureCoords.length / 2;

	spaceshipShotVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, spaceshipShotVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(spaceshipshotData.vertexPositions), gl.STATIC_DRAW);
	spaceshipShotVertexPositionBuffer.itemSize = 3;
	spaceshipShotVertexPositionBuffer.numItems = spaceshipshotData.vertexPositions.length / 3;

	spaceshipShotVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, spaceshipShotVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(spaceshipshotData.indices), gl.STREAM_DRAW);
	spaceshipShotVertexIndexBuffer.itemSize = 1;
	spaceshipShotVertexIndexBuffer.numItems = spaceshipshotData.indices.length;
}

function loadSpaceshipShot() {
	var request = new XMLHttpRequest();
	request.open("GET", "OBJbulletlow.json");
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			handleLoadedSpaceshipShot(JSON.parse(request.responseText));
		}
	}
	request.send();
}