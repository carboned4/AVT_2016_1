function Alien_Shot(_x, _y, _z){
	this.position = v3(_x, _y, _z);
	this.speedModulus = 0.5;
	this.speed = v3(-speedModulus, 0.0, 0.0);
}

var Alien_ShotVertexNormalBuffer;
var Alien_ShotVertexTextureCoordBuffer;
var Alien_ShotVertexIndexBuffer;

Alien.prototype.update = function(delta) {
	this.speed = v3(0.0, 0.0, 1.0);
	this.position = v3sub(this.position, this.speed*(delta / 1000);
	this.elapsedLife += (delta / 1000);
}

Alien.prototype.draw = function() {
	mvPushMatrix(mvMatrix);
	mat4.translate(mvMatrix, this.position.X, this.position.Y, this.position.Z);
	
/*	GLint loc;
	
	glUniform1i(texMode_uniformId, 4);

	var scx = 0.5*(sin(3*this.elapsedLife)+1.5);
	var scy = 0.5*(sin(5*this.elapsedLife+1) + 1.5);
	var scz = 0.5*(sin(8*this.elapsedLife + 1) + 1.5);

	//SPHERE
	// send the material
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.ambient");
	glUniform4fv(loc, 1, mesh[objectId].mat.ambient);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.diffuse");
	glUniform4fv(loc, 1, mesh[objectId].mat.diffuse);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.specular");
	glUniform4fv(loc, 1, mesh[objectId].mat.specular);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.shininess");
	glUniform1f(loc, mesh[objectId].mat.shininess);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.texCount");
	glUniform1i(loc, mesh[objectId].mat.texCount);
	
	// send matrices to OGL
	mvPushMatrix(mvMatrix);
	scale(mvMatrix, scx, scy, scz);
	computeDerivedMatrix(PROJ_VIEW_MODEL);
	glUniformMatrix4fv(vm_uniformId, 1, GL_FALSE, mCompMatrix[VIEW_MODEL]);
	glUniformMatrix4fv(pvm_uniformId, 1, GL_FALSE, mCompMatrix[PROJ_VIEW_MODEL]);
	computeNormalMatrix3x3();
	glUniformMatrix3fv(normal_uniformId, 1, GL_FALSE, mNormal3x3);
	mvPopMatrix(mvMatrix);
	// Render mesh
	glBindVertexArray(mesh[objectId].vao);
	glDrawElements(mesh[objectId].type, mesh[objectId].numIndexes, GL_UNSIGNED_INT, 0);
	glBindVertexArray(0);
*/
	mvPopMatrix(mvMatrix);
}

function handleLoadedAlien_Shot(Alien_ShotData) {
	poop = Alien_ShotData;
	Alien_ShotVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, Alien_ShotVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Alien_ShotData.vertexNormals), gl.STATIC_DRAW);
	Alien_ShotVertexNormalBuffer.itemSize = 3;
	Alien_ShotVertexNormalBuffer.numItems = Alien_ShotData.vertexNormals.length / 3;

	Alien_ShotVertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, Alien_ShotVertexTextureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Alien_ShotData.vertexTextureCoords), gl.STATIC_DRAW);
	Alien_ShotVertexTextureCoordBuffer.itemSize = 2;
	Alien_ShotVertexTextureCoordBuffer.numItems = Alien_ShotData.vertexTextureCoords.length / 2;

	Alien_ShotVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, Alien_ShotVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Alien_ShotData.vertexPositions), gl.STATIC_DRAW);
	Alien_ShotVertexPositionBuffer.itemSize = 3;
	Alien_ShotVertexPositionBuffer.numItems = Alien_ShotData.vertexPositions.length / 3;

	Alien_ShotVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Alien_ShotVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(Alien_ShotData.indices), gl.STREAM_DRAW);
	Alien_ShotVertexIndexBuffer.itemSize = 1;
	Alien_ShotVertexIndexBuffer.numItems = Alien_ShotData.indices.length;
}

function loadAlien_Shot() {
	var request = new XMLHttpRequest();
	request.open("GET", "OBJ_bullet.json");
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			handleLoadedAlien_Shot(JSON.parse(request.responseText));
		}
	}
	request.send();
}

