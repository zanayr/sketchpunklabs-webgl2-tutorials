import { build, program } from './gl.js';

const DIMENSIONS = {width: 500, height: 500};
const SHADER_LOCATION = './004/shaders/';
let gl, size, angle, last, sizeLocation, angleLocation;

function draw() {
    gl.clear();
    gl.render(vao);
}
function update(delta) {
    size += 3 * delta;
    angle += Math.PI / 180 * 90 * delta;
    last += delta;

    gl.setUniform(sizeLocation, Math.sin(size) * 10 + 30);
    gl.setUniform(angleLocation, angle);
}
function loop(timestamp) {
    update(timestamp * 0.001 - last);
    draw();

    requestAnimationFrame(loop);
}
function main(program) {
    gl.run(program);

    sizeLocation = gl.getUnifrom(program, 'u_size');
    angleLocation = gl.getUniform(program, 'u_angle');

    vao = gl.vao('dot', 'points', [0, 0, 0, 0.1, 0.1, 0, 0, 1, -0.1, 0, -0.1, -0.1, 0, -0.1, 0.1, 0]);

    gl.clear();
    requestAnimationFrame(loop);
}

build(gl, 'canvas', DIMENSIONS);
main(program(SHADER_LOCATION));
