function Asteroid(_x, _y,_z){
	this.position = v3(_x, _y, _z);
}


var asteroidVertexPositionBuffer;
var asteroidVertexNormalBuffer;
var asteroidVertexTextureCoordBuffer;
var asteroidVertexIndexBuffer;

Asteroid.prototype.draw = function(){
	pushModelMatrix();
	gl.uniform4f(shaderProgram.materialAmbientColorUniform, 0.25, 0.25, 0.25, 1.0);
	gl.uniform4f(shaderProgram.materialDiffuseColorUniform, 0.5, 0.5, 0.5, 1.0);
	gl.uniform4f(shaderProgram.materialSpecularColorUniform, 0.2, 0.2, 0.2, 1.0);
	gl.uniform1f(shaderProgram.materialShininessUniform, 10.0);
	
	gl.uniform1i(shaderProgram.texMode_uniformId,3);
	gl.uniform1i(shaderProgram.materialTexCount, 12);
	gl.activeTexture(gl.TEXTURE12);
	gl.bindTexture(gl.TEXTURE_2D, asteroidTex);
	gl.uniform1i(shaderProgram.tex_loc12, 12);
	
	mat4.translate(modelMatrix,[this.position.X,this.position.Y,this.position.Z]);
	this.sendGeometry();
	popModelMatrix();
}

Asteroid.prototype.sendGeometry = function(){
	gl.bindBuffer(gl.ARRAY_BUFFER, asteroidVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexposAttribute, asteroidVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, asteroidVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.texcoordAttribute, asteroidVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, asteroidVertexNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.normalAttribute, asteroidVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	//CHEATING
	mat4.multiply(viewMatrix,modelMatrix,modelviewMatrix);
	for(var i = 0; i<3; i++){
		for(var j = 0; j<3; j++){
			if(i==j) modelviewMatrix[i * 4 + j] = 1;
			else modelviewMatrix[i * 4 + j] = 0;
			
		}
	}
	mat4.multiply(projectionMatrix,modelviewMatrix,pvmMatrix);
	mat4.toInverseMat3(modelviewMatrix, normalMatrix);
	mat3.transpose(normalMatrix);
	
	gl.uniformMatrix4fv(shaderProgram.vm_uniformId, false, modelviewMatrix);
	gl.uniformMatrix4fv(shaderProgram.pvm_uniformId, false, pvmMatrix);
	gl.uniformMatrix3fv(shaderProgram.normal_uniformId, false, normalMatrix);
    
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, asteroidVertexIndexBuffer);
	gl.drawElements(gl.TRIANGLES, asteroidVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}


function loadAsteroid() {
	var quadindices = createQuad(0.4, 0.4);
	asteroidVertexPositionBuffer = quadindices[0];
	asteroidVertexNormalBuffer = quadindices[1];
	asteroidVertexTextureCoordBuffer = quadindices[2];
	asteroidVertexIndexBuffer = quadindices[3];

}