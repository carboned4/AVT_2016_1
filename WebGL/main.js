var gl;
var shaderProgram;
var vertexShader;
var fragmentShader;

function getShader(gl, id) {
	var shaderScript = document.getElementById(id);
	if (!shaderScript)
	return null;
	var str = "";

	var k = shaderScript.firstChild;
	while (k) {
	if (k.nodeType == 3)
		str += k.textContent;
		k = k.nextSibling;
	}
	var shader;
	if (shaderScript.type == "x-shader/x-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}
	gl.shaderSource(shader, str);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		return null;
	}
	return shader;
}

function initShaders() {
	fragmentShader = getShader(gl, "shader-fs");
	vertexShader = getShader(gl, "shader-vs");
	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
		console.log(gl.getProgramInfoLog(shaderProgram));
		alert("Could not initialise shaders");
	}
	gl.useProgram(shaderProgram);
	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "position");
	shaderProgram.normalAttribute = gl.getAttribLocation(shaderProgram, "normal");
	shaderProgram.texAttribute = gl.getAttribLocation(shaderProgram, "texCoord");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
	gl.enableVertexAttribArray(shaderProgram.normalAttribute);
	gl.enableVertexAttribArray(shaderProgram.texAttribute);
	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

function webGLStart() {
	var canvas = document.createElement('canvas');
	canvas.id = "myCanvas";
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	document.body.appendChild(canvas);
	
	try {
		gl = canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry :-(");
	}
	
	initShaders();
	//initBuffers();

}