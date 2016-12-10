function LensFlare() {
	this.numberCoronas = 6;
this.relativePositions = [ 0.3, 0.4, 0.5, 0.55, 0.7, 0.8 ];
	this.fsizes = [ 0.2, 0.4, 0.8, 1.4, 0.6, 0.2 ];
	this.falphas = [ 0.6, 0.4, 0.8, 0.6, 0.4, 0.6 ];
	this.ftexcounts = [ 14, 11, 13, 11, 14, 11 ]; //14 13 11

}

var lensFlareVertexPositionBuffer;
var lensFlareVertexNormalBuffer;
var lensFlareVertexTextureCoordBuffer;
var lensFlareVertexIndexBuffer;



LensFlare.prototype.draw = function(_lx, _ly, _lz, _winw, _winh){
	if (_lx > _winw*1.1
		|| _lx < -_winw*0.1
		|| _ly > _winh*1.1
		|| _ly < -_winh*0.1
		|| _lz < 0.1
		|| _lz > 1000.0) {
		//console.log("no lensflare\n");
		return;
	}
	
	var fScale = 0.2;
	var fMaxSize = 0.5;

	var startx = _lx;
	var starty = _ly;
	var centerx = _winw / 2.0;
	var centery = _winh / 2.0;
	var destx = centerx + (centerx - _lx);
	var desty = centery + (centery - _ly);
	var flaredist, flaremaxsize, flarescale;
	var maxflaredist;
	var side, falpha;

	maxflaredist = 1.1*(Math.sqrt(centerx*centerx + centery*centery));
	flaredist = Math.sqrt((_lx - centerx)*(_lx - centerx) + (_ly - centery)*(_ly - centery));
	flaremaxsize = _winw * fMaxSize;
	flarescale = _winw * fScale;

	var px, py;
	
	
	//gl.uniform4f(shaderProgram.materialAmbientColorUniform, 1.0, 1.0, 1.0, 1.0);
	gl.uniform4f(shaderProgram.materialDiffuseColorUniform, 1.0, 1.0, 1.0, 1.0);
	gl.uniform4f(shaderProgram.materialSpecularColorUniform, 0, 0, 0, 0.0);
	gl.uniform1f(shaderProgram.materialShininessUniform, 69.0);
	gl.uniform1i(shaderProgram.texMode_uniformId,6);
	
	var flaredict = {11: flare2Tex, 13: flare4Tex, 14: flare5Tex};
	
	for(var i = 0; i<this.numberCoronas; i++){
		
		px = (1-this.relativePositions[i])*startx + this.relativePositions[i]*destx;
		py = (1 - this.relativePositions[i])*starty + this.relativePositions[i] * desty;
		side = (maxflaredist-flaredist)*flarescale*this.fsizes[i]/maxflaredist;
		if (side > flaremaxsize) side = flaremaxsize;
		falpha = ((maxflaredist-flaredist)*this.falphas[i]) / maxflaredist;
		gl.uniform4f(shaderProgram.materialAmbientColorUniform, 1.0, 1.0, 1.0, falpha);
		pushModelMatrix();
		mat4.translate(modelMatrix,[px,py,0]);
		mat4.scale(modelMatrix, [side,side,1]);
		
		
		gl.uniform1i(shaderProgram.materialTexCount, 11);
		gl.activeTexture(gl.TEXTURE11);
		gl.bindTexture(gl.TEXTURE_2D, flaredict[this.ftexcounts[i]]);
		gl.uniform1i(shaderProgram.tex_loc11, 11);
		
		this.sendGeometry();
		popModelMatrix();
	}
}

LensFlare.prototype.sendGeometry = function(){
	gl.bindBuffer(gl.ARRAY_BUFFER, lensFlareVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexposAttribute, lensFlareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, lensFlareVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.texcoordAttribute, lensFlareVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, lensFlareVertexNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.normalAttribute, lensFlareVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, lensFlareVertexIndexBuffer);
	
	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, lensFlareVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}



function loadLensFlare() {
	var quadindices = createQuad(1.0, 1.0);
	lensFlareVertexPositionBuffer = quadindices[0];
	lensFlareVertexNormalBuffer = quadindices[1];
	lensFlareVertexTextureCoordBuffer = quadindices[2];
	lensFlareVertexIndexBuffer = quadindices[3];
}