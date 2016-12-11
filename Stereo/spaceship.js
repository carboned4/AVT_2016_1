
function Spaceship(limitL, limitR) {
	this.position = v3(0.0, 0.0, 0.0);
    this.speed = v3(0.0, 0.0, 0.0);
	this.limitLeft = limitL;
	this.limitRight = limitR;
	this.accelerationModulus = v3(6.0, 0.0, 0.0);
	this.maxSpeed = v3(4.0, 0.0, 0.0);
	this.speedAngleEffectVec = v3(0.0, 0.0, 0.0);
	this.speedAngleEffect=0.0;
	this.leftPressed = false;
	this.rightPressed = false;
	this.colRadius = 1.0;
}

Spaceship.prototype.updateKeys = function(_left,_right){
	this.leftPressed = _left;
	this.rightPressed = _right;
}

Spaceship.prototype.checkCollisionShot = function(colalienshot){
	var dist = distance(this.position.X, this.position.Z, colalienshot.position.X, colalienshot.position.Z);
	return dist < this.colRadius + colalienshot.colRadius;
}

Spaceship.prototype.update = function(delta){
	var maxX = this.maxSpeed.X;
	

	if (this.leftPressed) {
		this.speed = v3add(this.speed,v3mul((delta / 1000.0),this.accelerationModulus));
		if (this.speed.X > maxX) this.speed.set(maxX, 0.0, 0.0);
	}
	else if (this.rightPressed) {
		this.speed = v3sub(this.speed,v3mul((delta / 1000.0),this.accelerationModulus));
		if (this.speed.X < -maxX) this.speed.set(-maxX, 0.0, 0.0);
	}
	else {
		var xspeed = this.speed.X;
		if (0.05 <= xspeed)
			this.speed = v3sub(this.speed,v3mul((delta / 1000.0),this.accelerationModulus));
		else if (xspeed <= -0.05)
			this.speed = v3add(this.speed,v3mul((delta / 1000.0),this.accelerationModulus));
		else/* if (-0.05 < xthis.speed < 0.05)*/ {
			this.speed.set(0.0, 0.0, 0.0);
		}
	}
	this.position = v3add(this.position,v3mul((delta / 1000.0),this.speed));

	if (this.position.X <= this.limitLeft) {
		this.position.set(this.limitLeft, 0.0, 0.0);
		this.speedAngleEffect *= 0.5;
		this.speed.set(0.0, 0.0, 0.0);
	}
	else if(this.position.X >= this.limitRight){
		this.position.set(this.limitRight, 0.0, 0.0);
		this.speedAngleEffect *= 0.5;
		if(this.speedAngleEffect < 0.05) this.speedAngleEffect = 0.0;
		this.speed.set(0.0, 0.0, 0.0);
	}
	else {
		this.speedAngleEffect = 20.0*this.speed.X / maxX;
	}

	this.speedAngleEffectVec = v3(Math.sin(this.speedAngleEffect* 3.14 / 180.0), 0.0, Math.cos(this.speedAngleEffect* 3.14 / 180.0));
	
}

var spaceshipVertexPositionBuffer;
var spaceshipVertexNormalBuffer;
var spaceshipVertexTextureCoordBuffer;
var spaceshipVertexIndexBuffer;
var spaceshipVertexTangentBuffer;

Spaceship.prototype.draw = function(notHud){
	//console.log(modelMatrix);
	pushModelMatrix();
	gl.uniform4f(shaderProgram.materialAmbientColorUniform, 0.1, 0.1, 0.1, 1.0);
	gl.uniform4f(shaderProgram.materialDiffuseColorUniform, 0.5, 0.5, 0.5, 1.0);
	gl.uniform4f(shaderProgram.materialSpecularColorUniform, 1.0, 1.0, 1.0, 1.0);
	gl.uniform1f(shaderProgram.materialShininessUniform, 10.0);
	
	if(notHud) gl.uniform1i(shaderProgram.texMode_uniformId,0);
	else gl.uniform1i(shaderProgram.texMode_uniformId, 3);
	gl.uniform1i(shaderProgram.materialTexCount, 15);
	gl.activeTexture(gl.TEXTURE15);
	gl.bindTexture(gl.TEXTURE_2D, gunshipTex);
	gl.uniform1i(shaderProgram.tex_loc15, 15);
	gl.activeTexture(gl.TEXTURE3);
	gl.bindTexture(gl.TEXTURE_2D, gunshipnormalTex);
	gl.uniform1i(shaderProgram.tex_loc3, 3);
	if(notHud){
		mat4.translate(modelMatrix,[this.position.X-0.1,this.position.Y-0.5,this.position.Z]);
		mat4.rotate(modelMatrix,rad(this.speedAngleEffect),[0,1,0]);
		mat4.rotate(modelMatrix,rad(-this.speedAngleEffect),[0,0,1]);
		mat4.translate(modelMatrix,[0.1,0.3,-1.0]);
	}
		mat4.scale(modelMatrix, [0.125,0.125,0.25]);
	//console.log(modelMatrix);
	this.sendGeometry();
	popModelMatrix();
	//console.log(modelMatrix);
	

}

Spaceship.prototype.sendGeometry = function(){
	//gl.enableVertexAttribArray(shaderProgram.tangentAttribute);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, spaceshipVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexposAttribute, spaceshipVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, spaceshipVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.texcoordAttribute, spaceshipVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, spaceshipVertexNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.normalAttribute, spaceshipVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
/*
	gl.bindBuffer(gl.ARRAY_BUFFER, spaceshipVertexTangentBuffer);
	gl.vertexAttribPointer(shaderProgram.tangentAttribute, spaceshipVertexTangentBuffer.itemSize, gl.FLOAT, false, 0, 0);
*/
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, spaceshipVertexIndexBuffer);
	
	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, spaceshipVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	
	//gl.disableVertexAttribArray(shaderProgram.tangentAttribute);
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
/*
	spaceshipVertexTangentBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, spaceshipVertexTangentBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(spaceshipData.tangents), gl.STATIC_DRAW);
	spaceshipVertexTangentBuffer.itemSize = 4;
	spaceshipVertexTangentBuffer.numItems = spaceshipData.tangents.length / 4;
*/
	spaceshipVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, spaceshipVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(spaceshipData.indices), gl.STREAM_DRAW);
	spaceshipVertexIndexBuffer.itemSize = 1;
	spaceshipVertexIndexBuffer.numItems = spaceshipData.indices.length;
}

function loadSpaceship() {
	var request = new XMLHttpRequest();
	request.open("GET", "OBJgalileo.json");
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			handleLoadedSpaceship(JSON.parse(request.responseText));
		}
	}
	request.send();
}