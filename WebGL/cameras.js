var currentCamera = 0;
var cameras = [0,0,0];
var ratio;

function TopOrthoCamera(_left, _right, _down, _up, _near, _far,
		_x, _y, _z){
	this.position = v3(_x,_y,_z);
	this.left = _left;
	this.right = _right;
	this.up = _up;
	this.down = _down;
	this.nearPlane = _near;
	this.farPlane = _far;

	this.setRatio = function(r){
		var currentRatio = (right-left) / (up - down);
		left = left*_ratio / currentRatio;
		right = right*_ratio / currentRatio;
	}
	this.doProjection = function(){
		mat4.ortho(this.left, this.right, this.down, this.up, this.nearPlane,this.farPlane, projectionMatrix);
	}
	this.doView = function(){
		mat4.lookAt([this.position.X,this.position.Y,this.position.Z],[this.position.X,this.position.Y-1.0,this.position.Z],[0, 0, 1],viewMatrix);
	}
}