
var modelMatrix = mat4.create();
var modelMatrixStack = [];
var viewMatrix = mat4.create();
var viewMatrixStack = [];
var projectionMatrix = mat4.create();
var projectionMatrixStack = [];

var modelviewMatrix = mat4.create();
var pvmMatrix = mat4.create();
var normalMatrix = mat3.create();


function pushModelMatrix() {
	var copy = mat4.create();
	mat4.set(modelMatrix, copy);
	modelMatrixStack.push(copy);
}
function popModelMatrix() {
	if (modelMatrixStack.length == 0) {
		throw "Invalid popMatrix!";
	}
	modelMatrix = modelMatrixStack.pop();
}

function pushViewMatrix() {
	var copy = mat4.create();
	mat4.set(viewMatrix, copy);
	viewMatrixStack.push(copy);
}
function popViewMatrix() {
	if (viewMatrixStack.length == 0) {
		throw "Invalid popMatrix!";
	}
	viewMatrix = viewMatrixStack.pop();
}

function pushProjectionMatrix() {
	var copy = mat4.create();
	mat4.set(projectionMatrix, copy);
	projectionMatrixStack.push(copy);
}
function popProjectionMatrix() {
	if (projectionMatrixStack.length == 0) {
		throw "Invalid popMatrix!";
	}
	projectionMatrix = projectionMatrixStack.pop();
}


/*function setMatrixUniforms() {
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
	 var normalMatrix = mat3.create();
	mat4.toInverseMat3(mvMatrix, normalMatrix);
	mat3.transpose(normalMatrix);
	gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
}*/

function setMatrixUniforms() {
	calculateDerivedMatrices();
	gl.uniformMatrix4fv(shaderProgram.vm_uniformId, false, modelviewMatrix);
	gl.uniformMatrix4fv(shaderProgram.pvm_uniformId, false, pvmMatrix);
	gl.uniformMatrix3fv(shaderProgram.normal_uniformId, false, normalMatrix);
}

function calculateDerivedMatrices(){
	//mat4.multiply(modelMatrix,viewMatrix,modelviewMatrix);
	//mat4.multiply(modelviewMatrix,projectionMatrix,pvmMatrix);
	mat4.multiply(viewMatrix,modelMatrix,modelviewMatrix);
	mat4.multiply(projectionMatrix,modelviewMatrix,pvmMatrix);
	mat4.toInverseMat3(modelviewMatrix, normalMatrix);
	mat3.transpose(normalMatrix);
}

function rad(degrees) {
	return degrees * Math.PI / 180;
}


function createQuad(sidex,sidey){
	var squareVertexPositionBuffer;
	var squareNormalsBuffer;
	var squareTexCoordBuffer;
	var squareVertexIndexBuffer;
		
	squareVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
	var vertices = [
		-0.5*sidex, -0.5*sidey, 0.0, 1.0,
		0.5*sidex, -0.5*sidey, 0.0, 1.0,
		0.5*sidex, 0.5*sidey, 0.0, 1.0,
		-0.5*sidex, 0.5*sidey, 0.0, 1.0
		
	];


   /* vertices = [-0.5*20,0.5*20,-0.5*20*Math.sin(degToRad(90)),1,
	-0.5*20,-0.5*20,-0.5*20*Math.sin(degToRad(90)),1,
	0.5*20*Math.cos(degToRad(90)),-0.5*20,0.5*20*Math.sin(degToRad(90)),1,
	0.5*20*Math.cos(degToRad(90)),0.5*20,0.5*20*Math.sin(degToRad(90)),1,


	];*/

  

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	squareVertexPositionBuffer.itemSize = 4;
	squareVertexPositionBuffer.numItems = 4;

	squareTexCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, squareTexCoordBuffer);
	
	var textureCoords = [
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0
	];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
	squareTexCoordBuffer.itemSize = 2;
	squareTexCoordBuffer.numItems = 2;

	squareNormalsBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, squareNormalsBuffer);
	var normals = [
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0
	];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	squareNormalsBuffer.itemSize = 3;
	squareNormalsBuffer.numItems = 4;

	squareVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareVertexIndexBuffer);
	var squareVertexIndices = [
		0,1,2,2,3,0, // Front face
	];
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(squareVertexIndices), gl.STATIC_DRAW);
	squareVertexIndexBuffer.itemSize = 1;
	squareVertexIndexBuffer.numItems = 6;

	return [squareVertexPositionBuffer, squareNormalsBuffer, squareTexCoordBuffer, squareVertexIndexBuffer];
	
     // initialization ended
    /*
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexposAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, squareTexCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.texcoordAttribute, squareTexCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, squareNormalsBuffer);
    gl.vertexAttribPointer(shaderProgram.normalAttribute, squareNormalsBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareVertexIndexBuffer);
    //setMatrixUniforms();
	
	
	*/
}