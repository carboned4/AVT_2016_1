var currentCamera = 2;
var cameras = [0,0,0];
var ratio;
var camX= 0;
var camY= 1;
var camZ = -1;

var shakeLeft = 0.0;
var shakeFade = 1.0;
var shakeShift = 0;

//VR

//end of VR


function updateCamera(elapsed, delta){
	//shakeLeft -= shakeFade*(delta/1000);
	//if(shakeLeft < 0) shakeLeft = 0;
	//shakeShift = 0.0625*shakeLeft * Math.sin(40*elapsed/1000);
}

function startShake(){
	//shakeLeft = 1.0;
}


function FollowPerspCamera(_fov, _ratio, _near, _far, _x, _y, _z){
	this.cameraPos = v3(0,0,0);
	this.center = v3(_x,_y,_z);
	this.directionVector = [0,0,1];
	this.atVector = [this.center.X + this.directionVector[0], this.center.Y + this.directionVector[1], this.center.Z + this.directionVector[2]]; //DEFINE
	//https://w3c.github.io/deviceorientation/spec-source-orientation.html#usecases
	//
	
	this.upVector = [0,1,0];
	this.rightVector = [-1,0,0];
	this.ratio = _ratio;
	this.fov = _fov;
	this.nearPlane = _near;
	this.farPlane = _far;
	this.focusPlane = 5;
	this.eyeSeparation = 0.06;
	this.alpha = 0;
	this.beta = 0;
	this.gamma = 0;
	this.D = 0.5 * this.eyeSeparation * this.nearPlane / this.focusPlane;  //Frustum assymetry – next slides 
	this.hdiv2   = this.nearPlane * Math.tan(rad(this.fov / 2)); // aperture in radians 
	this.vEye = [-0.5,0,0];
	this.rotatedUp = [0,0,0];
	this.rotatedDirection = [0,0,0];
	
	
	this.setRatio = function(_r){
		this.ratio = _r;
	}
	
	this.updatePosition = function(_x, _y, _z) {
		this.center.set(_x, _y+2.0, _z-3.0);
		this.atVector = [this.center.X + this.directionVector[0], this.center.Y + this.directionVector[1], this.center.Z + this.directionVector[2]];
	}
	
	this.updateDirection = function(_alpha, _beta){
		this.directionAlpha = _alpha;
		this.directionBeta = _beta;
	}
	
	this.setCamXYZ = function(_x, _y, _z) {
		//this.cameraPos.set(_x, _y, _z);
	}
	
	this.prepareVR = function(){
		var oriented_pos;
		var oriented_up;
		var oriented_at;
		
		this.rotatedUp = [0,0,0];
		this.rotatedDirection = [0,0,0];

		if(this.alpha != null) {
			//var rMat = getRotationMatrix(this.alpha, this.beta, this.gamma);
			//var rMat = getRotationMatrix(this.alpha, -this.gamma, -this.beta);
			var rMat = getRotationMatrix(180+this.alpha, 180-this.gamma, this.beta+180);
			var sMat = getScreenTransformationMatrix(90);
			var rsMat = matrixMultiply(rMat, sMat);
			
			var wMat = getWorldTransformationMatrix();
			
			var rswMat = matrixMultiply(rsMat, wMat);
			
			
			vec3.transformMat3(this.rotatedUp, this.upVector, rMat);
			vec3.transformMat3(this.rotatedDirection, this.directionVector, rMat);
			
		} else {
			this.rotatedUp = vec3.create(this.upVector);
			this.rotatedDirection = vec3.create(this.directionVector);
		}
		//document.getElementById("mousepos").innerHTML = this.alpha + " " + this.beta + " " + this.gamma + "<br>"+this.rotatedUp + "<br>"+ this.rotatedDirection;
		
		vec3.cross(this.rotatedDirection,this.rotatedUp, this.rightVector);         // Each unit vectors 
		this.rightVector = vec3.normalize(this.rightVector);
		this.vEye[0] = this.rightVector[0] * this.eyeSeparation / 2.0; // half eye separa+on vector 
		this.vEye[1] = this.rightVector[1] * this.eyeSeparation / 2.0; // half eye separa+on vector 
		this.vEye[2] = this.rightVector[2] * this.eyeSeparation / 2.0; // half eye separa+on vector 
	}
	
	this.doProjectionLeft = function(){
		var dvltop = this.hdiv2;
		var dvlbottom = -this.hdiv2;
		var dvlleft = -this.ratio/2 * this.hdiv2 + 0.5* this.eyeSeparation * this.nearPlane/this.focusPlane;
		var dvlright = this.ratio/2 * this.hdiv2 + 0.5* this.eyeSeparation * this.nearPlane/this.focusPlane;
		
		mat4.frustum(dvlleft, dvlright, dvlbottom, dvltop, this.nearPlane, this.farPlane, projectionMatrix);
	}
	this.doViewLeft = function(){
		mat4.lookAt(
		[this.center.X-this.vEye[0],this.center.Y-this.vEye[1],this.center.Z-this.vEye[2]],
		[this.center.X-this.vEye[0]+this.rotatedDirection[0],
		this.center.Y-this.vEye[1]+this.rotatedDirection[1],
		this.center.Z-this.vEye[2]+this.rotatedDirection[2]],
		[this.rotatedUp[0],this.rotatedUp[1],this.rotatedUp[2]],
		viewMatrix);
	}
	this.doProjectionRight = function(){
		var dvltop = this.hdiv2;
		var dvlbottom = -this.hdiv2;
		var dvlleft = -this.ratio/2 * this.hdiv2 - 0.5* this.eyeSeparation * this.nearPlane/this.focusPlane;
		var dvlright = this.ratio/2 * this.hdiv2 - 0.5* this.eyeSeparation * this.nearPlane/this.focusPlane;
		
		mat4.frustum(dvlleft, dvlright, dvlbottom, dvltop, this.nearPlane, this.farPlane, projectionMatrix);
	}
	this.doViewRight = function(){
		mat4.lookAt(
		[this.center.X+this.vEye[0],this.center.Y+this.vEye[1],this.center.Z+this.vEye[2]],
		[this.center.X+this.vEye[0]+this.rotatedDirection[0],
		this.center.Y+this.vEye[1]+this.rotatedDirection[1],
		this.center.Z+this.vEye[2]+this.rotatedDirection[2]],
		[this.rotatedUp[0],this.rotatedUp[1],this.rotatedUp[2]],
		viewMatrix);
	}
	
	var HOEisInit = false;
	this.handleOrientationEvent = function(e) {
		var TOLERANCE = 0.5;
		this.alpha = e.alpha;
		this.beta = e.beta;
		this.gamma = e.gamma;

		if(HOEisInit) {
			if(this.prev_alpha - this.alpha <= -TOLERANCE || this.prev_alpha - this.alpha >= TOLERANCE)
				this.prev_alpha = this.alpha;
			if(this.prev_beta - this.beta <= -TOLERANCE || this.prev_beta - this.beta >= TOLERANCE)
				this.prev_beta = this.beta;
			if(this.prev_gamma - this.gamma <= -TOLERANCE || this.prev_gamma - this.gamma >= TOLERANCE)
				this.prev_gamma = this.gamma;
		} else {
			HOEisInit = true;
			this.prev_alpha = this.alpha;
			this.prev_beta = this.beta;
			this.prev_gamma = this.gamma;
		}

		this.alpha = this.prev_alpha;
		this.beta = this.prev_beta;
		this.gamma = this.prev_gamma;

	}
	
	
}
	
	
function getWorldTransformationMatrix() {
	var x = rad(-90);

	var cA = Math.cos( x );
	var sA = Math.sin( x );

	// Construct our world transformation matrix
	var r_w = [
		1,     0,    0,
		0,     cA,   -sA,
		0,     sA,   cA
	];

	return r_w;
}


	
function getRotationMatrix( _alpha, _beta, _gamma ) {

  var _x = _beta  ? rad(_beta) : 0;
  var _y = _gamma ? rad(_gamma) : 0;
  var _z = _alpha ? rad(_alpha) : 0;

  var cX = Math.cos( _x );
  var cY = Math.cos( _y );
  var cZ = Math.cos( _z );
  var sX = Math.sin( _x );
  var sY = Math.sin( _y );
  var sZ = Math.sin( _z );

  var m11 = cZ * cY - sZ * sX * sY;
  var m12 = - cX * sZ;
  var m13 = cY * sZ * sX + cZ * sY;

  var m21 = cY * sZ + cZ * sX * sY;
  var m22 = cZ * cX;
  var m23 = sZ * sY - cZ * cY * sX;

  var m31 = - cX * sY;
  var m32 = sX;
  var m33 = cX * cY;

  return [
    m11,    m12,    m13,
    m21,    m22,    m23,
    m31,    m32,    m33
  ];
};
	
	
	
function getScreenTransformationMatrix( screenOrientation ) {
	var orientationAngle = screenOrientation ? rad(screenOrientation) : 0;

	var cA = Math.cos( orientationAngle );
	var sA = Math.sin( orientationAngle );

	// Construct our screen transformation matrix
	var r_s = [
		cA,    -sA,    0,
		sA,    cA,     0,
		0,     0,      1
	];

	return r_s;
}
	
//utilidade do vec3.js
vec3.transformMat3 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2];
    out[0] = x * m[0] + y * m[3] + z * m[6];
    out[1] = x * m[1] + y * m[4] + z * m[7];
    out[2] = x * m[2] + y * m[5] + z * m[8];
    return out;
};
	
	
	
function matrixMultiply( a, b ) {
	var final = [];

	final[0] = a[0] * b[0] + a[1] * b[3] + a[2] * b[6];
	final[1] = a[0] * b[1] + a[1] * b[4] + a[2] * b[7];
	final[2] = a[0] * b[2] + a[1] * b[5] + a[2] * b[8];

	final[3] = a[3] * b[0] + a[4] * b[3] + a[5] * b[6];
	final[4] = a[3] * b[1] + a[4] * b[4] + a[5] * b[7];
	final[5] = a[3] * b[2] + a[4] * b[5] + a[5] * b[8];

	final[6] = a[6] * b[0] + a[7] * b[3] + a[8] * b[6];
	final[7] = a[6] * b[1] + a[7] * b[4] + a[8] * b[7];
	final[8] = a[6] * b[2] + a[7] * b[5] + a[8] * b[8];

	return final;
}
	
	
	
function TopOrthoCamera(_left, _right, _down, _up, _near, _far,
		_x, _y, _z){
	this.position = v3(_x,_y,_z);
	this.left = _left;
	this.right = _right;
	this.up = _up;
	this.down = _down;
	this.nearPlane = _near;
	this.farPlane = _far;

	this.setRatio = function(_r){
		var currentRatio = (this.right-this.left) / (this.up - this.down);
		this.left = this.left*_r / currentRatio;
		this.right = this.right*_r / currentRatio;
	}
	this.doProjection = function(){
		mat4.ortho(this.left, this.right, this.down, this.up, this.nearPlane,this.farPlane, projectionMatrix);
	}
	this.doView = function(){
		mat4.lookAt([this.position.X,this.position.Y,this.position.Z],[this.position.X,this.position.Y-1.0,this.position.Z],[0+shakeShift, 0, 1],viewMatrix);
	}
}

function FixedPerspCamera(_fov, _ratio, _near, _far, _x, _y, _z, _tx, _ty, _tz){
	this.position = v3(_x,_y,_z);
	this.target = v3(_tx,_ty,_tz);
	this.ratio = _ratio;
	this.fov = _fov;
	this.nearPlane = _near;
	this.farPlane = _far;

	this.setRatio = function(_r){
		this.ratio = _r;
	}
	this.doProjection = function(){
		mat4.perspective(this.fov, this.ratio, this.nearPlane,this.farPlane, projectionMatrix);
	}
	this.doView = function(){
		mat4.lookAt([this.position.X,this.position.Y,this.position.Z],[this.target.X,this.target.Y,this.target.Z],[0+shakeShift, 1, 0],viewMatrix);
	}
}

