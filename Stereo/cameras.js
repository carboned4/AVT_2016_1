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
	this.upVector = [0,1,0];
	this.rightVector = [-1,0,0];
	this.ratio = _ratio;
	this.fov = _fov;
	this.nearPlane = _near;
	this.farPlane = _far;
	this.focusPlane = 5;
	this.D;
	this.hdiv2;
	this.vEye = [-0.5,0,0];
	this.eyeSeparation = 0.06;
	
	this.setRatio = function(_r){
		this.ratio = _r;
	}
	
	this.updatePosition = function(_x, _y, _z) {
		this.center.set(_x, _y+1.0, _z-2.0);
	}
	
	this.setCamXYZ = function(_x, _y, _z) {
		this.cameraPos.set(_x, _y, _z);
	}
	
	this.prepareVR = function(){
		this.D = 0.5 * this.eyeSeparation * this.nearPlane / this.focusPlane;  //Frustum assymetry – next slides 
		this.hdiv2   = this.nearPlane * Math.tan(rad(this.fov / 2)); // aperture in radians 
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

