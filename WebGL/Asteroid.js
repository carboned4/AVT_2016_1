function Asteroid(_x, _y,_z){
	this.postion = v3(_x, _y, _z);
}

Asteroid.prototype.draw = function() {
	mvPushMatrix(mvMatrix);
	mat4.translate(mvMatrix, this.position.X, this.position.Y, this.position.Z);
/*	GLint loc;

	glUniform1i(texMode_uniformId, 1);
	
	float modelview[16];  //To be used in "Cheating" Matrix reset Billboard technique

	//SPHERE
	// send the material
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.ambient");
	glUniform4fv(loc, 1, mesh[objectId].mat.ambient);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.diffuse");
	glUniform4fv(loc, 1, mesh[objectId].mat.diffuse);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.specular");
	glUniform4fv(loc, 1, mesh[objectId].mat.specular);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.shininess");
	glUniform1f(loc, mesh[objectId].mat.shininess);
	loc = glGetUniformLocation(shader.getProgramIndex(), "mat.texCount");
	glUniform1i(loc, mesh[objectId].mat.texCount);
	// send matrices to OGL
	
	computeDerivedMatrix(VIEW_MODEL);
	memcpy(modelview, mCompMatrix[VIEW_MODEL], sizeof(float) * 16);
	// spherical cheating
	for (int i = 0; i < 3; i++) {
		for (int j = 0; j < 3; j++) {
			if (i == j)
				mCompMatrix[VIEW_MODEL][i * 4 + j] = 1.0;
			else
				mCompMatrix[VIEW_MODEL][i * 4 + j] = 0.0;
		}
	}
	computeDerivedMatrix_PVM();

	
	glUniformMatrix4fv(vm_uniformId, 1, GL_FALSE, mCompMatrix[VIEW_MODEL]);
	glUniformMatrix4fv(pvm_uniformId, 1, GL_FALSE, mCompMatrix[PROJ_VIEW_MODEL]);
	computeNormalMatrix3x3();
	glUniformMatrix3fv(normal_uniformId, 1, GL_FALSE, mNormal3x3);
	// Render mesh
	glBindVertexArray(mesh[objectId].vao);
	glDrawElements(mesh[objectId].type, mesh[objectId].numIndexes, GL_UNSIGNED_INT, 0);
	glBindVertexArray(0);
*/
	mvPopMatrix(mvMatrix);
}
