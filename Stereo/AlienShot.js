function AlienShot(_x,_y,_z) {
	this.position = v3(_x,_y,_z);
    this.speedModulus = 1.5;
	this.speed = v3(0.0, 0.0, -this.speedModulus);
	this.elapsedLife = 0.0;
	this.texcount = 5;
	this.colRadius = 0.05;
}


AlienShot.prototype.update = function(delta){
	this.position = v3add(this.position,v3mul(delta / 1000.0,this.speed));
	this.elapsedLife += delta/1000.0;
	
}


var AlienShotVertexPositionBuffer;
var AlienShotVertexNormalBuffer;
var AlienShotVertexTextureCoordBuffer;
var AlienShotVertexIndexBuffer;



AlienShot.prototype.draw = function(){
	
	var scx = 0.5*(Math.sin(3*this.elapsedLife)+1.5);
	var scy = 0.5*(Math.sin(5*this.elapsedLife+1) + 1.5);
	var scz = 0.5*(Math.sin(8*this.elapsedLife + 1) + 1.5);

	pushModelMatrix();
	mat4.translate(modelMatrix,[this.position.X,this.position.Y,this.position.Z]);
	mat4.rotate(modelMatrix,this.elapsedLife,[0,1,1]);
	mat4.scale(modelMatrix, [25*scx,25*scy,25*scz]);
	
	gl.uniform4f(shaderProgram.materialAmbientColorUniform, 0.25, 0.25, 0.1, 1.0);
	gl.uniform4f(shaderProgram.materialDiffuseColorUniform, 0.9, 0.9, 0.2, 1.0);
	gl.uniform4f(shaderProgram.materialSpecularColorUniform, -0.5, 0.9, 0.9, 1.0);
	gl.uniform1f(shaderProgram.materialShininessUniform, 10.0);
	gl.uniform1i(shaderProgram.texMode_uniformId,4);
	
	
	this.sendGeometry();
	popModelMatrix();

}

AlienShot.prototype.sendGeometry = function(){
	gl.bindBuffer(gl.ARRAY_BUFFER, AlienShotVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexposAttribute, AlienShotVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, AlienShotVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.texcoordAttribute, AlienShotVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, AlienShotVertexNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.normalAttribute, AlienShotVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, AlienShotVertexIndexBuffer);
	
	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, AlienShotVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}


function handleLoadedAlienShot(alienShotData) {
	
	AlienShotVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, AlienShotVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(alienShotData.vertexNormals), gl.STATIC_DRAW);
	AlienShotVertexNormalBuffer.itemSize = 3;
	AlienShotVertexNormalBuffer.numItems = alienShotData.vertexNormals.length / 3;

	AlienShotVertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, AlienShotVertexTextureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(alienShotData.vertexTextureCoords), gl.STATIC_DRAW);
	AlienShotVertexTextureCoordBuffer.itemSize = 2;
	AlienShotVertexTextureCoordBuffer.numItems = alienShotData.vertexTextureCoords.length / 2;

	AlienShotVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, AlienShotVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(alienShotData.vertexPositions), gl.STATIC_DRAW);
	AlienShotVertexPositionBuffer.itemSize = 3;
	AlienShotVertexPositionBuffer.numItems = alienShotData.vertexPositions.length / 3;

	AlienShotVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, AlienShotVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(alienShotData.indices), gl.STREAM_DRAW);
	AlienShotVertexIndexBuffer.itemSize = 1;
	AlienShotVertexIndexBuffer.numItems = alienShotData.indices.length;
}

function loadAlienShot() {
	var request = new XMLHttpRequest();
	request.open("GET", "OBJsphere.json");
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			handleLoadedAlienShot(JSON.parse(request.responseText));
		}
	}
	request.send();
}