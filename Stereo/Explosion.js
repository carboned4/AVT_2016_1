var FLAREFADEPERSECOND =0.5;
var FLARE_PLANES =4;
var FLARE_RADIUSES =4;
var INITIALSPEEDMODULUS =1.0;
var ACCELERATIONMODULUS =0.25;

function Explosion(_x, _y, _z, _ivx, _ivy, _ivz, _gx, _gy, _gz) {
	this.position = v3(_x, _y, _z);
    this.speed = v3(_ivx, _ivy, _ivz);
	this.gravityPoint = v3(_gx, _gy, _gz);
	this.lifeLeft = 1.0;
	this.lifeFade = FLAREFADEPERSECOND;
	
	this.positions = [];
	this.speeds = [];
	this.accelerations = [];
	
	for (var iplane = 0; iplane < FLARE_PLANES; iplane++) {
		for (var iradius = 0; iradius < FLARE_RADIUSES; iradius++) {
			var sparsityMult = 1.0;
			if ((iradius % 2) == 0) sparsityMult = 0.5;
			var ipos = v3(_x, _y, _z);
			var theta = 2.0 * 3.1416 * Math.random();
			var phi = 3.1416 * Math.random();
			var vx = INITIALSPEEDMODULUS * Math.cos(theta) * Math.sin(phi);
			var vz = INITIALSPEEDMODULUS * Math.sin(theta) * Math.sin(phi);
			var vy = INITIALSPEEDMODULUS * Math.cos(phi);
			var ispeed = v3add(this.speed,v3mul(sparsityMult,v3(vx, vy, vz)));
			var iaccel = v3sub(this.gravityPoint,this.position);
			iaccel = v3mul(ACCELERATIONMODULUS / iaccel.len(),iaccel);
			this.positions.push(ipos);
			this.speeds.push(ispeed);
			this.accelerations.push(iaccel);
		}
	}
}

Explosion.prototype.update = function(delta){
	for(var iflare = 0; iflare < this.positions.length; iflare++){
		this.positions[iflare] = v3add(this.positions[iflare],v3mul(delta / 1000.0,this.speeds[iflare]));
		var iaccel = v3sub(this.gravityPoint,this.positions[iflare]);
		iaccel = v3mul(ACCELERATIONMODULUS / iaccel.len(),iaccel);
		this.speeds[iflare] = v3add(this.speeds[iflare],v3mul(delta / 1000.0,this.accelerations[iflare]));
		
	}
	this.lifeLeft -= this.lifeFade*(delta / 1000.0);
	if (this.lifeLeft < 0.0) this.lifeLeft = 0.0;
}

var explosionVertexPositionBuffer;
var explosionVertexNormalBuffer;
var explosionVertexTextureCoordBuffer;
var explosionVertexIndexBuffer;

Explosion.prototype.draw = function(){
	//console.log(modelMatrix);
	
	for(var iflare = 0; iflare < this.positions.length; iflare++){
		pushModelMatrix();
		gl.uniform4f(shaderProgram.materialAmbientColorUniform, 0.1, 0.1, 0.2, this.lifeLeft);
		gl.uniform4f(shaderProgram.materialDiffuseColorUniform, 0, 0, 0, 1.0);
		gl.uniform4f(shaderProgram.materialSpecularColorUniform, 0, 0, 0, 1.0);
		gl.uniform1f(shaderProgram.materialShininessUniform, 10.0);
		
		gl.uniform1i(shaderProgram.texMode_uniformId,6);
		gl.uniform1i(shaderProgram.materialTexCount, 10);
		gl.activeTexture(gl.TEXTURE10);
		gl.bindTexture(gl.TEXTURE_2D, explosionTex);
		gl.uniform1i(shaderProgram.tex_loc10, 10);
		
			mat4.translate(modelMatrix,[this.positions[iflare].X,this.positions[iflare].Y,this.positions[iflare].Z]);
		//console.log(modelMatrix);
		this.sendGeometry();
		//drawSquareParticula(1,1);
		popModelMatrix();
		//console.log(modelMatrix);
	}

}

Explosion.prototype.sendGeometry = function(){
	gl.bindBuffer(gl.ARRAY_BUFFER, explosionVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexposAttribute, explosionVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, explosionVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.texcoordAttribute, explosionVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, explosionVertexNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.normalAttribute, explosionVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

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
    
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, explosionVertexIndexBuffer);
	gl.drawElements(gl.TRIANGLES, explosionVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}


function loadExplosion() {
	var quadindices = createQuad(0.5, 0.5);
	explosionVertexPositionBuffer = quadindices[0];
	explosionVertexNormalBuffer = quadindices[1];
	explosionVertexTextureCoordBuffer = quadindices[2];
	explosionVertexIndexBuffer = quadindices[3];

}