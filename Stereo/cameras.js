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
	
	
	this.setRatio = function(_r){
		this.ratio = _r;
	}
	
	this.updatePosition = function(_x, _y, _z) {
		this.center.set(_x, _y+1.0, _z-2.0);
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
		
		var rotatedUp = [0,0,0];
		var rotatedDirection = [0,0,0];

		if(this.alpha != null) {
			var rMat = getRotationMatrix(this.alpha, this.beta < 0 ? 90 : (90-this.beta), this.gamma);
			//console.log(rMat);
			/*oriented_pos = vec3.create([this.center.X,this.center.Y,this.center.Z]);
			oriented_up = vec3.create(this.upVector);
			oriented_at = vec3.create(this.atVector);
			var shippos = vec3.create([spaceship.position.X, spaceship.position.Y, spaceship.position.Z]);
			vec3.subtract(oriented_pos, shippos, oriented_pos);
			vec3.subtract(oriented_at, shippos, oriented_pos);
			vec3.transformMat3(oriented_pos, rMat, oriented_pos);
			vec3.transformMat3(oriented_up, rMat, oriented_up);
			vec3.transformMat3(oriented_at, rMat, oriented_at);
			*/
			vec3.transformMat3(rotatedUp, this.upVector, rMat);
			vec3.transformMat3(rotatedDirection, this.directionVector, rMat);
			
			
			//vec3.add(oriented_pos, shippos, oriented_pos);
			//vec3.add(oriented_at, shippos, oriented_pos);
		} else {
			oriented_pos = this.center;
			oriented_up = this.upVector;
			oriented_at = this.atVector;
			rotatedUp = vec3.create(this.upVector);
			rotatedDirection = vec3.create(this.directionVector);
		}
		console.log(rotatedUp);
		console.log(rotatedDirection);
		console.log("_\n");
		
		vec3.cross(this.directionVector,this.upVector, this.rightVector);         // Each unit vectors 
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
		[this.center.X-this.vEye[0]+this.directionVector[0],
		this.center.Y-this.vEye[1]+this.directionVector[1],
		this.center.Z-this.vEye[2]+this.directionVector[2]],
		[this.upVector[0],this.upVector[1],this.upVector[2]],
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
		[this.center.X+this.vEye[0]+this.directionVector[0],
		this.center.Y+this.vEye[1]+this.directionVector[1],
		this.center.Z+this.vEye[2]+this.directionVector[2]],
		[this.upVector[0],this.upVector[1],this.upVector[2]],
		viewMatrix);
	}
	
	var HOEisInit = false;
	this.handleOrientationEvent = function(e) {
		var TOLERANCE = 10;
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
	
	/*this.doProjectionLeft = function(){
		mat4.perspective(this.fov, this.ratio, this.nearPlane,this.farPlane, projectionMatrix);
	}
	this.doViewLeft = function(){
		mat4.lookAt([this.center.X+this.cameraPos.X+1,this.center.Y+this.cameraPos.Y,this.center.Z+this.cameraPos.Z],[this.center.X+1,this.center.Y,this.center.Z],[0+shakeShift, 1, 0],viewMatrix);
	}
	this.doProjectionRight = function(){
		mat4.perspective(this.fov, this.ratio, this.nearPlane,this.farPlane, projectionMatrix);
	}
	this.doViewRight = function(){
		mat4.lookAt([this.center.X+this.cameraPos.X,this.center.Y+this.cameraPos.Y,this.center.Z+this.cameraPos.Z],[this.center.X,this.center.Y,this.center.Z],[0+shakeShift, 1, 0],viewMatrix);
	}*/
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
	
	
//utilidade do vec3.js
vec3.transformMat3 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2];
    out[0] = x * m[0] + y * m[3] + z * m[6];
    out[1] = x * m[1] + y * m[4] + z * m[7];
    out[2] = x * m[2] + y * m[5] + z * m[8];
    return out;
};
	
	
	
	
	
	
	
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

