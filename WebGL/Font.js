_fontSize = 16;

	
var textVertexBuffer;
var textTexCoordBuffer;
var textIndexBuffer;

function initTextureMappedFont() {
	var text_vertices = [
		0.0, 0.0,
		_fontSize, 0.0,
		_fontSize, _fontSize,
		0.0, _fontSize
	];

	textVertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, textVertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(text_vertices), gl.STATIC_DRAW);
	textVertexBuffer.itemSize = 2;
	textVertexBuffer.numItems = text_vertices.length / 2;

	//Just initialize with something for now, the tex coords are updated
	//for each character printed
	var text_texCoords = [
		0.0, 0.0,
		0.0, 0.0,
		0.0, 0.0,
		0.0, 0.0
	];

	textTexCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, textTexCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(text_texCoords), gl.STATIC_DRAW);
	textTexCoordBuffer.itemSize = 2;
	textTexCoordBuffer.numItems = text_texCoords.length / 2;
	
	var text_indices = [0, 1, 2, 0, 2, 3];
	
	textIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, textIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(text_indices), gl.STREAM_DRAW);
	textIndexBuffer.itemSize = 1;
	textIndexBuffer.numItems = text_indices.length;
}
// 0 1 2 0 2 3


function DrawString(x, y, string) {
	gl.enableVertexAttribArray(shaderProgram.fontposAttribute);
	gl.enableVertexAttribArray(shaderProgram.fonttexAttribute);
	
	var text_texCoords = [];

	pushModelMatrix();
	mat4.translate(modelMatrix, [x, y, 0]);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, textVertexBuffer);
	gl.vertexAttribPointer(shaderProgram.fontposAttribute, textVertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	
	for (var stri = 0; stri < string.length; stri++)
	{
		var aux = 1.0 / 16.0;

		var ch = string.charCodeAt(stri);
		var xPos = parseFloat(ch % 16) * aux;
		var yPos = parseFloat(ch / 16) * aux;
		//console.log(xPos + " "+yPos);
		
		text_texCoords[0] = xPos;
		text_texCoords[1] = 1.0 - yPos - aux;

		text_texCoords[2] = xPos + aux;
		text_texCoords[3] = 1.0 - yPos - aux;

		text_texCoords[4] = xPos + aux;
		text_texCoords[5] = 1.0 - yPos - 0.001;

		text_texCoords[6] = xPos;
		text_texCoords[7] = 1.0 - yPos - 0.001;

		textTexCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, textTexCoordBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(text_texCoords), gl.STATIC_DRAW);
		textTexCoordBuffer.itemSize = 2;
		textTexCoordBuffer.numItems = text_texCoords.length / 2;
		gl.bindBuffer(gl.ARRAY_BUFFER, textTexCoordBuffer);
		gl.vertexAttribPointer(shaderProgram.fonttexAttribute, textTexCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
		
		gl.bindBuffer(gl.ARRAY_BUFFER, textVertexBuffer);
		gl.vertexAttribPointer(shaderProgram.fontposAttribute, textVertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, textIndexBuffer);
		setMatrixUniforms();
		gl.drawElements(gl.TRIANGLES, textIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		
		
		mat4.translate(modelMatrix, [_fontSize * 0.8, 0.0, 0.0]);
	}
	popModelMatrix();
	
	gl.disableVertexAttribArray(shaderProgram.fontposAttribute);
	gl.disableVertexAttribArray(shaderProgram.fonttexAttribute);
	
	gl.enable(gl.DEPTH_TEST);
}