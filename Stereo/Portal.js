function Portal(_x,_y,_z) {
	this.position = v3(_x,_y,_z);
}


var portalVertexPositionBuffer;
var portalVertexNormalBuffer;
var portalVertexTextureCoordBuffer;
var portalVertexIndexBuffer;


Portal.prototype.drawEye = function(){
	pushModelMatrix();
	mat4.translate(modelMatrix,[this.position.X+4,this.position.Y,this.position.Z+6]);
	mat4.rotate(modelMatrix,rad(-45),[0,1,0]);
	mat4.scale(modelMatrix,[250,250,250]);
	
	gl.uniform4f(shaderProgram.materialAmbientColorUniform, 0.5, 0.5, 0.5, 1.0);
	gl.uniform4f(shaderProgram.materialDiffuseColorUniform, 0.75, 0.75, 0.75, 1.0);
	gl.uniform4f(shaderProgram.materialSpecularColorUniform, 1, 1, 1, 1.0);
	gl.uniform1f(shaderProgram.materialShininessUniform, 1000.0);
	gl.uniform1i(shaderProgram.texMode_uniformId,1);
	
	gl.uniform1i(shaderProgram.materialTexCount, 6);
	gl.activeTexture(gl.TEXTURE6);
	gl.bindTexture(gl.TEXTURE_2D, eyeTex);
	gl.uniform1i(shaderProgram.tex_loc6, 6);
	
	this.sendPortalGeometry();
	popModelMatrix();

}

Portal.prototype.drawLiquid = function(){
	pushModelMatrix();
	mat4.translate(modelMatrix,[this.position.X,this.position.Y,this.position.Z]);
	mat4.rotate(modelMatrix,rad(45),[0,1,0]);
	mat4.rotate(modelMatrix,rad(190),[-1,0,0]);
	mat4.scale(modelMatrix,[250,250,25]);
	
	gl.uniform4f(shaderProgram.materialAmbientColorUniform, 0.25, 0.25, 0.25, 0.5);
	gl.uniform4f(shaderProgram.materialDiffuseColorUniform, 0.5, 0.5, 0.5, 0.5);
	gl.uniform4f(shaderProgram.materialSpecularColorUniform, 0, 0, 0, 0.5);
	gl.uniform1f(shaderProgram.materialShininessUniform, 20.0);
	gl.uniform1i(shaderProgram.texMode_uniformId,1);
	
	gl.uniform1i(shaderProgram.materialTexCount, 7);
	gl.activeTexture(gl.TEXTURE7);
	gl.bindTexture(gl.TEXTURE_2D, portalTex);
	gl.uniform1i(shaderProgram.tex_loc7, 7);
	
	this.sendPortalGeometry();
	popModelMatrix();

}

Portal.prototype.fillStencil = function(){
	pushModelMatrix();
	mat4.translate(modelMatrix,[this.position.X,this.position.Y,this.position.Z]);
	mat4.rotate(modelMatrix,rad(45),[0,1,0]);
	mat4.rotate(modelMatrix,rad(190),[-1,0,0]);
	mat4.scale(modelMatrix,[250,250,25]);
	
	gl.uniform4f(shaderProgram.materialAmbientColorUniform, 0, 0, 0, 1);
	gl.uniform4f(shaderProgram.materialDiffuseColorUniform, 0, 0, 0, 1);
	gl.uniform4f(shaderProgram.materialSpecularColorUniform, 0, 0, 0, 1);
	gl.uniform1f(shaderProgram.materialShininessUniform, 20.0);
	gl.uniform1i(shaderProgram.texMode_uniformId,4);
	
	gl.uniform1i(shaderProgram.materialTexCount, 9);
	gl.activeTexture(gl.TEXTURE9);
	gl.bindTexture(gl.TEXTURE_2D, cloudTex);
	gl.uniform1i(shaderProgram.tex_loc9, 9);
	
	this.sendPortalGeometry();
	popModelMatrix();

}

Portal.prototype.sendPortalGeometry = function(){
	gl.bindBuffer(gl.ARRAY_BUFFER, portalVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexposAttribute, portalVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, portalVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.texcoordAttribute, portalVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, portalVertexNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.normalAttribute, portalVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, portalVertexIndexBuffer);
	
	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, portalVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function handleLoadedPortal(portalData) {
	
	portalVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, portalVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(portalData.vertexNormals), gl.STATIC_DRAW);
	portalVertexNormalBuffer.itemSize = 3;
	portalVertexNormalBuffer.numItems = portalData.vertexNormals.length / 3;

	portalVertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, portalVertexTextureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(portalData.vertexTextureCoords), gl.STATIC_DRAW);
	portalVertexTextureCoordBuffer.itemSize = 2;
	portalVertexTextureCoordBuffer.numItems = portalData.vertexTextureCoords.length / 2;

	portalVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, portalVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(portalData.vertexPositions), gl.STATIC_DRAW);
	portalVertexPositionBuffer.itemSize = 3;
	portalVertexPositionBuffer.numItems = portalData.vertexPositions.length / 3;

	portalVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, portalVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(portalData.indices), gl.STREAM_DRAW);
	portalVertexIndexBuffer.itemSize = 1;
	portalVertexIndexBuffer.numItems = portalData.indices.length;
}


function loadPortal() {
	var request = new XMLHttpRequest();
	request.open("GET", "OBJsphere.json");
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			handleLoadedPortal(JSON.parse(request.responseText));
		}
	}
	request.send();
}