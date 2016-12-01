var currentCamera = 0;
var cameras = [0,0,0];
var ratio;
var camX= 0;
var camY= 1;
var camZ = -1;

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
		mat4.lookAt([this.position.X,this.position.Y,this.position.Z],[this.position.X,this.position.Y-1.0,this.position.Z],[0, 0, 1],viewMatrix);
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
		mat4.lookAt([this.position.X,this.position.Y,this.position.Z],[this.target.X,this.target.Y,this.target.Z],[0, 1, 0],viewMatrix);
	}
}

function FollowPerspCamera(_fov, _ratio, _near, _far, _x, _y, _z){
	this.cameraPos = v3(0,0,0);
	this.center = v3(_x,_y,_z);
	this.ratio = _ratio;
	this.fov = _fov;
	this.nearPlane = _near;
	this.farPlane = _far;

	this.setRatio = function(_r){
		this.ratio = _r;
	}
	
	this.updatePosition = function(_x, _y, _z) {
		this.center.set(_x, _y+1.0, _z);
	}
	
	this.setCamXYZ = function(_x, _y, _z) {
		this.cameraPos.set(_x, _y, _z);
	}
	
	this.doProjection = function(){
		mat4.perspective(this.fov, this.ratio, this.nearPlane,this.farPlane, projectionMatrix);
	}
	this.doView = function(){
		mat4.lookAt([this.center.X+this.cameraPos.X,this.center.Y+this.cameraPos.Y,this.center.Z+this.cameraPos.Z],[this.center.X,this.center.Y,this.center.Z],[0, 1, 0],viewMatrix);
	}
}