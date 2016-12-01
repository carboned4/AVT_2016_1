function Alien(_x,_y,_z,_left,_width,_rowheight) {
	this.position = v3(_x,_y,_z);
    this.speed = v3(0.0, 0.0, 0.0);
	this.left = 0;
	this.width = 1;
	this.prevRow;
	this.rowHeight;	
	this.changeRow = false;
	this.speedModulus = 0.5;
	this.draw;
	this.sendGeometry;
	this.texcount = 5;
}

var alienVertexPositionBuffer1;
var alienVertexNormalBuffer1;
var alienVertexTextureCoordBuffer1;
var alienVertexIndexBuffer1;
var alienVertexTangentBuffer1;

var alienVertexPositionBuffer2;
var alienVertexNormalBuffer2;
var alienVertexTextureCoordBuffer2;
var alienVertexIndexBuffer2;
var alienVertexTangentBuffer2;

var alienVertexPositionBuffer3;
var alienVertexNormalBuffer3;
var alienVertexTextureCoordBuffer3;
var alienVertexIndexBuffer3;
var alienVertexTangentBuffer3;


Alien.prototype.draw = function(){
	pushModelMatrix();
	mat4.translate(mvMatrix,[this.position.X,this.position.Y-3,this.position.Z]);

	//SPHERE
	gl.uniform4f(shaderProgram.materialDiffuseColorUniform, 0, 0, 0,1.0);
	gl.uniform4f(shaderProgram.materialSpecularColorUniform, 0, 0, 0,1.0);
	gl.uniform1f(shaderProgram.materialShininessUniform, 5);
	gl.uniform1i(shaderProgram.texting_mode,1);
	gl.activeTexture(gl.TEXTURE9);
	//gl.bindTexture(gl.TEXTURE_2D, candleTex);
	gl.uniform1i(shaderProgram.samplerUniform, 9);
	pushModelMatrix();
		 mat4.scale(mvMatrix, [1.5,0.5,1.0]);
		 mat4.rotate(mvMatrix,rad(90),[0,1,0]);
	this.sendGeometry1();
	popModelMatrix();

	//CONE1
	gl.uniform4f(shaderProgram.materialDiffuseColorUniform, 0, 0, 0,1.0);
	gl.uniform4f(shaderProgram.materialSpecularColorUniform, 0, 0, 0,1.0);
	gl.uniform1f(shaderProgram.materialShininessUniform, 5);
	gl.uniform1i(shaderProgram.texting_mode,1);
	gl.activeTexture(gl.TEXTURE9);
	//gl.bindTexture(gl.TEXTURE_2D, candleTex);
	gl.uniform1i(shaderProgram.samplerUniform, 9);
	pushModelMatrix();
		 mat4.translate(mvMatrix,[0.5,0,0]);
		 mat4.rotate(mvMatrix,rad(135),[-1,0,-1]);
		 mat4.scale(mvMatrix, [0.5,0.5,0.5]);
	this.sendGeometry2();
	popModelMatrix();

	//CONE2
	gl.uniform4f(shaderProgram.materialDiffuseColorUniform, 0, 0, 0,1.0);
	gl.uniform4f(shaderProgram.materialSpecularColorUniform, 0, 0, 0,1.0);
	gl.uniform1f(shaderProgram.materialShininessUniform, 5);
	gl.uniform1i(shaderProgram.texting_mode,1);
	gl.activeTexture(gl.TEXTURE9);
	//gl.bindTexture(gl.TEXTURE_2D, candleTex);
	gl.uniform1i(shaderProgram.samplerUniform, 9);
	pushModelMatrix();
		 mat4.translate(mvMatrix,[-0.5,0,0]);
		 mat4.rotate(mvMatrix,rad(-135),[1,0,-1]);
		 mat4.scale(mvMatrix, [0.5,0.5,0.5]);
	this.sendGeometry3();
	popModelMatrix();

popModelMatrix();

}

Alien.prototype.sendGeometry1 = function(){
	gl.bindBuffer(gl.ARRAY_BUFFER, alienVertexPositionBuffer1);
	gl.vertexAttribPointer(shaderProgram.vertexposAttribute, alienVertexPositionBuffer1.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, alienVertexTextureCoordBuffer1);
	gl.vertexAttribPointer(shaderProgram.texcoordAttribute, alienVertexTextureCoordBuffer1.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, alienVertexNormalBuffer1);
	gl.vertexAttribPointer(shaderProgram.normalAttribute, alienVertexNormalBuffer1.itemSize, gl.FLOAT, false, 0, 0);

	//gl.bindBuffer(gl.ARRAY_BUFFER, alienVertexTangentBuffer);
	//gl.vertexAttribPointer(shaderProgram.tangentAttribute, alienVertexTangentBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, alienVertexIndexBuffer1);
	
	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, alienVertexIndexBuffer1.numItems, gl.UNSIGNED_SHORT, 0);
}

Alien.prototype.sendGeometry2 = function(){
	gl.bindBuffer(gl.ARRAY_BUFFER, alienVertexPositionBuffer2);
	gl.vertexAttribPointer(shaderProgram.vertexposAttribute, alienVertexPositionBuffer2.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, alienVertexTextureCoordBuffer2);
	gl.vertexAttribPointer(shaderProgram.texcoordAttribute, alienVertexTextureCoordBuffer2.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, alienVertexNormalBuffer2);
	gl.vertexAttribPointer(shaderProgram.normalAttribute, alienVertexNormalBuffer2.itemSize, gl.FLOAT, false, 0, 0);

	//gl.bindBuffer(gl.ARRAY_BUFFER, alienVertexTangentBuffer);
	//gl.vertexAttribPointer(shaderProgram.tangentAttribute, alienVertexTangentBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, alienVertexIndexBuffer2);
	
	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, alienVertexIndexBuffer2.numItems, gl.UNSIGNED_SHORT, 0);
}

Alien.prototype.sendGeometry3 = function(){
	gl.bindBuffer(gl.ARRAY_BUFFER, alienVertexPositionBuffer3);
	gl.vertexAttribPointer(shaderProgram.vertexposAttribute, alienVertexPositionBuffer3.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, alienVertexTextureCoordBuffer3);
	gl.vertexAttribPointer(shaderProgram.texcoordAttribute, alienVertexTextureCoordBuffer3.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, alienVertexNormalBuffer3);
	gl.vertexAttribPointer(shaderProgram.normalAttribute, alienVertexNormalBuffer3.itemSize, gl.FLOAT, false, 0, 0);

	//gl.bindBuffer(gl.ARRAY_BUFFER, alienVertexTangentBuffer);
	//gl.vertexAttribPointer(shaderProgram.tangentAttribute, alienVertexTangentBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, alienVertexIndexBuffer3);
	
	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, alienVertexIndexBuffer3.numItems, gl.UNSIGNED_SHORT, 0);
}
var poop;
function handleLoadedalien(alienData) {
	poop = alienData;
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

	alienTangentBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, alienTangentBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(alienData.tangents), gl.STATIC_DRAW);
	alienTangentBuffer.itemSize = 4;
	alienTangentBuffer.numItems = alienData.tangents.length / 4;

	alienVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, alienVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(alienData.indices), gl.STREAM_DRAW);
	alienVertexIndexBuffer.itemSize = 1;
	alienVertexIndexBuffer.numItems = alienData.indices.length;
}

function loadalien() {
	var request = new XMLHttpRequest();
	request.open("GET", "OBJ_gunship.json");
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			handleLoadedalien(JSON.parse(request.responseText));
		}
	}
	request.send();
}