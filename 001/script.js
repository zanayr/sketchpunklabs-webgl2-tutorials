import {init, load, createArrayBuffer} from './gl.js';

// Run Program Function
function run(gl, program) {
    gl.useProgram(program);
    let aPositionLocation = gl.getAttribLocation(program, 'a_position'),
        uPointSizeLocation = gl.getUniformLocation(program, 'u_point_size');
    gl.useProgram(null);

    let verticies = new Float32Array([0, 0, 0, 0.5, 0.5, 0]),
        buffer = createArrayBuffer(gl, verticies);
    
    gl.useProgram(program);
    gl.uniform1f(uPointSizeLocation, 50.0);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(aPositionLocation);
    gl.vertexAttribPointer(aPositionLocation, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.drawArrays(gl, 0, 2);
}

window.addEventListener('load', e => {
    const gl = init('canvas', 400, 300);
    load(gl, './001/shaders').then(program => run(gl, program));
});