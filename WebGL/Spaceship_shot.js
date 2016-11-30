function Spaceship_Shot(_x, _y, _z){ 
	this.position = v3(_x, _y, _z)
	this.speedModulus = 2;
	this.speed = v3(0.0, 0.0, speedModulus);

/*	
	colBox = Box(SHIPSHOT_DIMENSION_XMIN, SHIPSHOT_DIMENSION_XMAX, SHIPSHOT_DIMENSION_ZMIN, SHIPSHOT_DIMENSION_ZMAX);
	memcpy(mesh[objectId].mat.ambient, amb, 4 * sizeof(float));
	memcpy(mesh[objectId].mat.diffuse, diff, 4 * sizeof(float));
	memcpy(mesh[objectId].mat.specular, spec, 4 * sizeof(float));
	memcpy(mesh[objectId].mat.emissive, emissive, 4 * sizeof(float));
	mesh[objectId].mat.shininess = shininess;
	mesh[objectId].mat.texCount = texcount;

	memcpy(mesh[objectId +1].mat.ambient, amb, 4 * sizeof(float));
	memcpy(mesh[objectId + 1].mat.diffuse, diff, 4 * sizeof(float));
	memcpy(mesh[objectId + 1].mat.specular, spec, 4 * sizeof(float));
	memcpy(mesh[objectId + 1].mat.emissive, emissive, 4 * sizeof(float));
	mesh[objectId + 1].mat.shininess = shininess;
	mesh[objectId + 1].mat.texCount = texcount;


	//createSphere(objectId, 0.1f, 12);
	createCylinder(objectId,0.4f, 0.05f, 12);
	createCone(objectId+1, 0.3f, 0.1f, 12);

	*addedToId = addToId;
*/
}

var Spaceship_ShotVertexNormalBuffer;
var Spaceship_ShotVertexTextureCoordBuffer;
var Spaceship_ShotVertexIndexBuffer;

Spaceship_Shot.prototype.update = function(delta) {
	//speed.set(0.0f, 0.0f, speedModulus);
	this.position = this.position + this.speed*(delta / 1000);
	this.elapsedLife += (delta / 1000);
	
}

Spaceship_Shot.prototype.draw = function() {
	mvPushMatrix(mvMatrix);
	mat4.translate(mvMatrix, this.position.X, this.position.Y, this.position.Z);
	mat4.rotate(mvMatrix, rat(90), [1, 0, 0]);

	/*	GLint loc;
	
	glUniform1i(texMode_uniformId, 4);


	//CILINDRO
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
	//scale(mvMatrix, 0.5f, 0.5f, 0.5f);	
	mat4.translate(mvMatrix, 0 , -0.15, 0);
	computeDerivedMatrix(PROJ_VIEW_mvMatrix);
	glUniformMatrix4fv(vm_uniformId, 1, GL_FALSE, mCompMatrix[VIEW_mvMatrix]);
	glUniformMatrix4fv(pvm_uniformId, 1, GL_FALSE, mCompMatrix[PROJ_VIEW_mvMatrix]);
	computeNormalMatrix3x3();
	glUniformMatrix3fv(normal_uniformId, 1, GL_FALSE, mNormal3x3);
	mvPopMatrix(mvMatrix);
	// Render mesh
	glBindVertexArray(mesh[objectId].vao);
	glDrawElements(mesh[objectId].type, mesh[objectId].numIndexes, GL_UNSIGNED_INT, 0);
	glBindVertexArray(0);

	//CONE
	// send the material
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.ambient");
	glUniform4fv(loc, 1, mesh[objectId+1].mat.ambient);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.diffuse");
	glUniform4fv(loc, 1, mesh[objectId + 1].mat.diffuse);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.specular");
	glUniform4fv(loc, 1, mesh[objectId + 1].mat.specular);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.shininess");
	glUniform1f(loc, mesh[objectId + 1].mat.shininess);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.texCount");
	glUniform1i(loc, mesh[objectId].mat.texCount);
	// send matrices to OGL
	mvPushMatrix(mvMatrix);
	mat4.translate(mvMatrix, 0.0, 0.05, 0);
	//scale(mvMatrix, 0.5f, 0.5f, 0.5f);
	computeDerivedMatrix(PROJ_VIEW_mvMatrix);
	glUniformMatrix4fv(vm_uniformId, 1, GL_FALSE, mCompMatrix[VIEW_mvMatrix]);
	glUniformMatrix4fv(pvm_uniformId, 1, GL_FALSE, mCompMatrix[PROJ_VIEW_mvMatrix]);
	computeNormalMatrix3x3();
	glUniformMatrix3fv(normal_uniformId, 1, GL_FALSE, mNormal3x3);
	popMatrix(mvMatrix);
	// Render mesh
	glBindVertexArray(mesh[objectId + 1].vao);
	glDrawElements(mesh[objectId + 1].type, mesh[objectId + 1].numIndexes, GL_UNSIGNED_INT, 0);
	glBindVertexArray(0);

	pushMatrix(mvMatrix);
	translate(mvMatrix, 0.0f, -0.35f, 0.0f);
	rotate(mvMatrix, elapsedLife*90.0f, 0.0f, 1.0f, 0.0f);
	scale(mvMatrix, 0.1f, 1.0f, 2.0f);
	computeDerivedMatrix(PROJ_VIEW_mvMatrix);
	glUniformMatrix4fv(vm_uniformId, 1, GL_FALSE, mCompMatrix[VIEW_mvMatrix]);
	glUniformMatrix4fv(pvm_uniformId, 1, GL_FALSE, mCompMatrix[PROJ_VIEW_mvMatrix]);
	computeNormalMatrix3x3();
	glUniformMatrix3fv(normal_uniformId, 1, GL_FALSE, mNormal3x3);
	popMatrix(mvMatrix);
	// Render mesh
	glBindVertexArray(mesh[objectId + 1].vao);
	glDrawElements(mesh[objectId + 1].type, mesh[objectId + 1].numIndexes, GL_UNSIGNED_INT, 0);
	glBindVertexArray(0);

	pushMatrix(mvMatrix);
	translate(mvMatrix, 0.0f, -0.35f, 0.0f);
	rotate(mvMatrix, elapsedLife*90.0f, 0.0f, 1.0f, 0.0f);
	scale(mvMatrix, 2.0f, 1.0f, 0.1f);
	computeDerivedMatrix(PROJ_VIEW_mvMatrix);
	glUniformMatrix4fv(vm_uniformId, 1, GL_FALSE, mCompMatrix[VIEW_mvMatrix]);
	glUniformMatrix4fv(pvm_uniformId, 1, GL_FALSE, mCompMatrix[PROJ_VIEW_mvMatrix]);
	computeNormalMatrix3x3();
	glUniformMatrix3fv(normal_uniformId, 1, GL_FALSE, mNormal3x3);
	popMatrix(mvMatrix);
	// Render mesh
	glBindVertexArray(mesh[objectId + 1].vao);
	glDrawElements(mesh[objectId + 1].type, mesh[objectId + 1].numIndexes, GL_UNSIGNED_INT, 0);
	glBindVertexArray(0);
*/
	mvPopMatrix(mvMatrix);
}

function handleLoadedSpaceship_Shot(Spaceship_ShotData) {
	poop = Spaceship_ShotData;
	Spaceship_ShotVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, Spaceship_ShotVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Spaceship_ShotData.vertexNormals), gl.STATIC_DRAW);
	Spaceship_ShotVertexNormalBuffer.itemSize = 3;
	Spaceship_ShotVertexNormalBuffer.numItems = Spaceship_ShotData.vertexNormals.length / 3;

	Spaceship_ShotVertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, Spaceship_ShotVertexTextureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Spaceship_ShotData.vertexTextureCoords), gl.STATIC_DRAW);
	Spaceship_ShotVertexTextureCoordBuffer.itemSize = 2;
	Spaceship_ShotVertexTextureCoordBuffer.numItems = Spaceship_ShotData.vertexTextureCoords.length / 2;

	Spaceship_ShotVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, Spaceship_ShotVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Spaceship_ShotData.vertexPositions), gl.STATIC_DRAW);
	Spaceship_ShotVertexPositionBuffer.itemSize = 3;
	Spaceship_ShotVertexPositionBuffer.numItems = Spaceship_ShotData.vertexPositions.length / 3;

	Spaceship_ShotVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Spaceship_ShotVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(Spaceship_ShotData.indices), gl.STREAM_DRAW);
	Spaceship_ShotVertexIndexBuffer.itemSize = 1;
	Spaceship_ShotVertexIndexBuffer.numItems = Spaceship_ShotData.indices.length;
}

function loadSpaceship_Shot() {
	var request = new XMLHttpRequest();
	request.open("GET", "OBJ_bullet.json");
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			handleLoadedSpaceship_Shot(JSON.parse(request.responseText));
		}
	}
	request.send();
}