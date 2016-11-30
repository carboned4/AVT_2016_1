function Vec3(x, y, z) {
	this.X = x;
    this.Y = y;
    this.Z = z;
}

function v3(x, y, z){
	return new Vec3(x, y, z);
}

Vec3.prototype.set = function(x, y, z){
	this.X = x;
    this.Y = y;
    this.Z = z;
}

Vec3.prototype.len = function(){
	return Math.sqrt(this.X * this.X, this.Y * this.Y, this.Z * this.Z);
}

function mul(m, vec){
	return vec3(vec.X * m, vec.Y * m, vec.Z * m);
}

function div(m, vec){
	return vec3(vec.X / m, vec.Y / m, vec.Z / m);
}

function add(vec1, vec2){
	return vec3(vec1.X + vec2.X, vec1.Y + vec2.Y, vec1.Z + vec2.Z);
}

function sub(vec1, vec2){
	return vec3(vec1.X - vec2.X, vec1.Y - vec2.Y, vec1.Z - vec2.Z);
}

function neg(vec){
	return vec3(-vec.X, -vec.Y, -vec.Z);
}

function norm(vec){
	var mcdonald = this.len();
	return vec3(vec.X / mcdonald, vec.Y / mcdonald, vec.Z / mcdonald);
}