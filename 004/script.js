import * as gl from './gl.js';

let vao, then = 0, _context;
let angle = 0, size = 0;
let angleLocation = -1, sizeLocation = -1;

// Draw Function
function draw() {
    gl.clear(_context);
    gl.render(_context, vao, _context.POINTS, 5);
}

// Update Function
function update(delta) {
    size += 3 * delta;
    angle += Math.PI / 180 * 90 * delta;
    then += + delta;

    _context.uniform1f(sizeLocation, Math.sin(size) * 10 + 30);
    _context.uniform1f(angleLocation, angle);
}

// Loop Function
function loop(timestamp) {
    update(timestamp * 0.001 - then);
    draw();

    requestAnimationFrame(loop);
}

// Main Function
function run(program) {
    gl.activate(_context, program);

    sizeLocation = _context.getUniformLocation(program, 'u_size');
    angleLocation = _context.getUniformLocation(program, 'u_angle');

    vao = gl.vao(_context, 'dot', [0,0,0, 0.1,0.1,0, 0.1,-0.1,0, -0.1,-0.1,0, -0.1,0.1,0]);

    gl.clear(_context);

    requestAnimationFrame(loop);
}

window.addEventListener('load', e => {
    _context = gl.init('canvas', {height: 500, width: 500});
    gl.build(_context).then(program => run(program));
});
/*
import * as gl from 'gl.js';

let context;

function main(program) {

}

window.addEventListener('load', e => {
    context = gl.create('canvas', {height: 500, width: 500});
    shader.build(context).then(program => main(program));
});
*/