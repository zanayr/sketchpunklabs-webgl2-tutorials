import * as utility from './utility.js';

const POSITION_LOCATION = 0;
const NORMAL_LOCATION = 1;
const UV_LOCATION = 2;
const POSITION_NAME = 'a_position';
const NORMAL_NAME = 'a_normal';
const UV_NAME = 'a_uv';
const meshCollection = [];
let context;

// Mesh Collection
function add(mesh) {
    const id = utility.getId();
    if (!mesh) return;
    meshCollection.push({id: id, ...mesh});
    return id;
}
export function get(id) {
    return meshCollection.find(mesh => mesh.id === id);
}
export function remove(id) {
    meshCollection = meshCollection.filter(mesh => mesh.id != id);
}

// Shader
function compile(type, source) {
    const shader = context.createShader(type);
    context.shaderSource(shader, source);
    context.compileShader(shader);
    // Check if the shader compiled correctly
    if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
        context.deleteShader(shader);
        throw new Error(`[ERROR] Unable to compile shader: ${context.getShaderInfoLog(shader)}`);
    }
    // Return shader
    return shader;
}


// Program Functions
function link(vertex, fragment) {
    const program = gl.createProgram();
    context.attachShader(program, vertex);
    context.attachShader(program, fragment);

    context.bindAttribLocation(program, POSITION_LOCATION, POSITION_NAME);
    context.bindAttribLocation(program, NORMAL_LOCATION, NORMAL_NAME);
    context.bindAttribLocation(program, UV_LOCATION, UV_NAME);

    context.linkProgram(program);

    if (!context.getProgramParameter(program, context.LINK_STATUS)) {
        context.deleteProgram(program);
        throw new Error(`[ERROR] Unable to link program: ${context.getProgramInfoLog(program)}`);
    }

    if (validate) {
        context.validateProgram(program);
        if (!context.getProgramParameter(program, context.VALIDATE_STATUS)) {
            context.deleteProgram(program);
            throw new Error(`[ERROR] Unable to validate program: ${context.getProgramInfoLog(program)}`);
        }
    }

    context.deleteShader(vertex);
    context.deleteShader(fragment);
    
    return program;
}
export async function create(context, path='./shaders') {
    const vertex = await load(`${path}/vertex.glsl`);
    const fragment = await load(`${path}/fragment.glsl`);

    return link(context, compile(context, context.VERTEX_SHADER, vertex), compile(context, context.FRAGMENT_SHADER, fragment));;
}

// Auxillary Shader Functions
export function attributes(program) {
    return {
        position: context.getAttribLocation(program, POSITION_NAME),
        normal: context.getAttribLocation(program, NORMAL_NAME),
        uv: context.getAttribLocation(program, UV_NAME)
    };
}
export function render(vao, mode, count=0, indices=false) {
    context.bindVertexArray(vao);
    // if (indices) gl.drawElements(gl[mode], count, gl.UNSIGNED_SHORT, 0);
    // else gl.drawArrays(gl[mode], 0, count);
    context.drawArrays(mode, 0, count);
    context.bindVertexArray(null);
}

// Crete GL Context
export function before() {};
export function resize(update=false) {
    const ratio = update ? (window.devicePixelRatio || 1) : 1;
    const height = Math.floor(context.canvas.clientHeight * ratio);
    const width = Math.floor(context.canvas.clientWidth * ratio);

    if (context.canvas.height != height || context.canvas.width != width) {
        context.canvas.width = width;
        context.canvas.height = height;
    }

    context.viewport(0, 0, context.canvas.width, context.canvas.height);
}
export function clear() {
    resize(true);
    context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
}
export function create(id, options={}) {
    context = document.getElementById(id).getContext('webgl2');
    if (!context) throw new Error(`[ERROR] Your browser does not support WebGL 2.0`);

    options = {clearColor: [1.0, 1.0, 1.0, 1.0], width: 400, height: 300, ...options};

    context.canvas.style.width = options.width + 'px';
    context.canvas.style.height = options.height + 'px';
    context.canvas.width = options.width;
    context.canvas.height = options.height;

    context.viewport(0, 0, options.width, options.height);
    
    context.clearColor(...options.clearColor);
    context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);

    return context;
}
export function dispose(program) {
    if (context.getParameter(context.CURRENT_PROGRAM) === program) context.useProgram(null);
    context.deleteProgram(program);
}

export function run(program) {
    context.useProgram(program);
}
export function stop() {
    context.useProgram(null);
}

export function createBuffer(array, static=true) {
    const buffer = context.createBuffer();
    context.bindBuffer(context.ARRAY_BUFFER, buffer);
    context.bufferData(context.ARRAY_BUFFER, array, static ? context.STATIC_DRAW : context.DYNAMIC_DRAW);
    context.bindBuffer(context,ARRAY_BUFFER, null);

    return buffer;
}
export function createVao(name, vertices, normals=[], uvs=[], indices=[]) {
    const vao = context.createVertexArray();

    if ((!Array.isArray(vertices) && vertices.length) || !Array.isArray(normals) || !Array.isArray(uvs) || !Array.isArray(indices)) throw new Error(`[Error] There was an error creating the VAO ${name}`);

    context.bindVertexArray(vao);
    context.bindBuffer(context.ARRAY_BUFFER, context.createBuffer());
    context.bufferData(context.ARRAY_BUFFER, new Float32Array(vertices), context.STATIC_DRAW);
    context.enableVertexAttribArray(POSITION_LOCATION);
    context.vertexAttribPointer(POSITION_LOCATION, 3, context.FLOAT, false, 0, 0);

    if (Array.isArray(normals) && normals.length) {
        context.bindBuffer(context.ARRAY_BUFFER, context.createBuffer());
        context.bufferData(context.ARRAY_BUFFER, new Float32Array(normals), context.STATIC_DRAW);
        context.enableVertexAttribArray(NORMAL_LOCATION);
        context.vertexAttribPointer(NORMAL_LOCATION, 3, context.FLOAT, false, 0, 0);
    }

    if (Array.isArray(uvs) && uvs.length) {
        context.bindBuffer(context.ARRAY_BUFFER, context.createBuffer());
        context.bufferData(context.ARRAY_BUFFER, new Float32Array(uvs), context.STATIC_DRAW);
        context.enableVertexAttribArray(UV_LOCATION);
        context.vertexAttribPointer(UV_LOCATION, 2, context.FLOAT, false, 0, 0);
    }

    if (Array.isArray(indices) && indices.length) {
        context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, context.createBuffer());
        context.bufferData(context.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), context.STATIC_DRAW);
        context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, null);
    }

    context.bindVertexArray(null);
    context.bindBuffer(context.ARRAY_BUFFER, null);

    return vao;
}