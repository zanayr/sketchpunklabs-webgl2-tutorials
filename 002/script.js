import {init, load, createArrayBuffer} from './gl.js';

let count = 0,
    uPointSizeLocation = -1,
    uAngleLocation = 0,
    then = 0,
    gPointSize = 0,
    gAngle = 0;

// Auxillary Functions
function resize(gl, bool=false) {
    const ratio = bool ? (window.devicePixelRatio || 1) : 1;
    const width = Math.floor(gl.canvas.clientWidth * ratio);
    const height = Math.floor(gl.canvas.clientHeight * ratio);

    if (gl.canvas.width != width || gl.canvas.height != height) {
        gl.canvas.width = width;
        gl.canvas.height = height;
    }
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}
function clear(gl) {
    resize(gl, true);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}
function draw(gl, ts) {
    let now = ts * 0.001,
        dt = now - then;
    then = now;
    gPointSize += 3 * dt;
    gl.uniform1f(uPointSizeLocation, (Math.sin(gPointSize) * 10.0) + 30.0);

    gAngle += (Math.PI / 180) * 90 * dt;
    gl.uniform1f(uAngleLocation, gAngle);

    clear(gl);
    gl.drawArrays(gl.POINTS, 0, count);
}
function render(gl, timestamp) {
    draw(gl, timestamp);
    requestAnimationFrame(ts => {
        render(gl, ts);
    });
}

// Run Program Function
function run(gl, program) {
    gl.useProgram(program);
    let aPositionLocation = gl.getAttribLocation(program, 'a_position');
    uAngleLocation = gl.getUniformLocation(program, 'u_angle');
    uPointSizeLocation = gl.getUniformLocation(program, 'u_point_size');
    gl.useProgram(null);

    let vertices = new Float32Array([0, 0, 0]),
        buffer = createArrayBuffer(gl, vertices);
    
    count = vertices.length / 3;
    
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(aPositionLocation);
    gl.vertexAttribPointer(aPositionLocation, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    requestAnimationFrame(ts => {
        render(gl, ts);
    });
}

window.addEventListener('load', e => {
    const gl = init('canvas', 400, 300);
    load(gl, './002/shaders').then(program => run(gl, program));
});