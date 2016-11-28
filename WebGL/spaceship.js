function Spaceship(limitL, limitR) {
	this.position = vec3(0.0, 0.0, 0.0);
    this.speed = vec3(0.0, 0.0, 0.0);
	this.limitLeft = limitL;
	this.limitRight = limitR;
	this.accelerationModulus = vec3(6.0, 0.0, 0.0);
	this.maxSpeed = vec3(4.0, 0.0, 0.0);
	this.speedAngleEffectVec = vec3(0.0, 0.0, 0.0);
	
}





Spaceship.prototype.draw = function(){
	       
            mvPushMatrix(mvMatrix);
            gl.uniform4f(shaderProgram.materialDiffuseColorUniform, 0, 0, 0,1.0);
            gl.uniform4f(shaderProgram.materialSpecularColorUniform, 0, 0, 0,1.0);
            gl.uniform1f(shaderProgram.materialShininessUniform, 5);
            gl.uniform1i(shaderProgram.texting_mode,1);
            gl.activeTexture(gl.TEXTURE9);
            gl.bindTexture(gl.TEXTURE_2D, candleTex);
            gl.uniform1i(shaderProgram.samplerUniform, 9);
                 mat4.translate(mvMatrix,[this.posX,this.posY-3,this.posZ]);
                 mat4.rotate(mvMatrix,degToRad(180),[0,0,1]);
                 mat4.scale(mvMatrix, [0.2,0.2,0.2]);
            gl.bindBuffer(gl.ARRAY_BUFFER, candleVertexPositionBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, candleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, candleVertexTextureCoordBuffer);
            gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, candleVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, candleVertexNormalBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, candleVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, candleVertexIndexBuffer);
            setMatrixUniforms();
            gl.drawElements(gl.TRIANGLES, candleVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            mvPopMatrix(mvMatrix);


}

