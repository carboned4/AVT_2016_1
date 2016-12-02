function Alien(_x,_y,_z,_left,_width,_rowheight) {
	this.position = v3(_x,_y,_z);
    this.speedModulus = 0.5;
	this.speed = v3(-this.speedModulus, 0.0, 0.0);
	this.left = _left;
	this.width = _width;
	this.prevRow = _z;
	this.rowHeight = _rowheight;
	this.changeRow = false;
	this.draw;
	this.sendGeometry;
	this.texcount = 5;
}

Alien.prototype.update = function(delta){
	if (!this.changeRow) {
		this.position = v3add(this.position,v3mul(delta / 1000.0,this.speed));
		var xpos = this.position.X;
		if (xpos > this.left) {
			this.position.set(this.left, this.position.Y, this.position.Z);
			this.changeRow = true;
			this.speed = v3(0.0, 0.0, -this.speedModulus);
		}
		if (xpos < this.left - this.width) {
			this.position.set(this.left-this.width, this.position.Y, this.position.Z);
			this.changeRow = true;
			this.speed = v3(0.0, 0.0, -this.speedModulus);
		}
	}
	else if (this.changeRow) {
		this.position = v3add(this.position,v3mul(delta / 1000.0,this.speed));
		var zpos = this.position.Z;
		if (zpos < this.prevRow-this.rowHeight) {
			this.position.set(this.position.X, this.position.Y, this.prevRow - this.rowHeight);
			this.prevRow -= this.rowHeight;
			this.changeRow = false;
			if (this.position.X == this.left) {
				this.speed = v3(-this.speedModulus, 0.0, 0.0);
			}
			if (this.position.X == this.left - this.width) {
				this.speed = v3(+this.speedModulus, 0.0, 0.0);
			}
		}
	}
	
}


var alienVertexPositionBuffer;
var alienVertexNormalBuffer;
var alienVertexTextureCoordBuffer;
var alienVertexIndexBuffer;



Alien.prototype.draw = function(){
	pushModelMatrix();
	mat4.translate(modelMatrix,[this.position.X,this.position.Y-1,this.position.Z]);
	mat4.rotate(modelMatrix,rad(180),[0,1,0]);
	mat4.rotate(modelMatrix,rad(20),[1,0,0]);
	mat4.scale(modelMatrix, [0.5,0.5,0.5]);
	
	gl.uniform4f(shaderProgram.materialAmbientColorUniform, 0.9, 0.9, 0.9, 1.0);
	gl.uniform4f(shaderProgram.materialDiffuseColorUniform, 0.9, 0.9, 0.9, 1.0);
	gl.uniform4f(shaderProgram.materialSpecularColorUniform, 0.9, -0.5, 0.1, 1.0);
	gl.uniform1f(shaderProgram.materialShininessUniform, 20.0);
	gl.uniform1i(shaderProgram.texMode_uniformId,0);
	
	gl.uniform1i(shaderProgram.materialTexCount, 5);
	gl.activeTexture(gl.TEXTURE5);
	gl.bindTexture(gl.TEXTURE_2D, alienTex);
	gl.uniform1i(shaderProgram.tex_loc5, 5);
	
	this.sendGeometry();
	popModelMatrix();

}

Alien.prototype.sendGeometry = function(){
	gl.bindBuffer(gl.ARRAY_BUFFER, alienVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexposAttribute, alienVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, alienVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.texcoordAttribute, alienVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, alienVertexNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.normalAttribute, alienVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, alienVertexIndexBuffer);
	
	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, alienVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}


function handleLoadedAlien(alienData) {
	
	alienVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, alienVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(alienData.vertexNormals), gl.STATIC_DRAW);
	alienVertexNormalBuffer.itemSize = 3;
	alienVertexNormalBuffer.numItems = alienData.vertexNormals.length / 3;

	alienVertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, alienVertexTextureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(alienData.vertexTextureCoords), gl.STATIC_DRAW);
	alienVertexTextureCoordBuffer.itemSize = 2;
	alienVertexTextureCoordBuffer.numItems = alienData.vertexTextureCoords.length / 2;

	alienVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, alienVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(alienData.vertexPositions), gl.STATIC_DRAW);
	alienVertexPositionBuffer.itemSize = 3;
	alienVertexPositionBuffer.numItems = alienData.vertexPositions.length / 3;

	alienVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, alienVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(alienData.indices), gl.STREAM_DRAW);
	alienVertexIndexBuffer.itemSize = 1;
	alienVertexIndexBuffer.numItems = alienData.indices.length;
}

function loadAlien() {
	var request = new XMLHttpRequest();
	request.open("GET", "OBJalien.json");
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			handleLoadedAlien(JSON.parse(request.responseText));
		}
	}
	request.send();
}