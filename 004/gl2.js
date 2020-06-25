// const POSITION_LOCATION = 0;
// const NORMAL_LOCATION = 1;
// const UV_LOCATION = 2;
// const POSITION_NAME = 'a_position';
// const NORMAL_NAME = 'a_normal';
// const UV_NAME = 'a_uv';

// let gl; // The WebGL 2.0 context

// Shader Functions
// function compile(type, source) {
//     const shader = gl.createShader(gl[type]);
//     gl.shaderSource(shader, source);
//     gl.compileShader(shader);

//     if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
//         gl.deleteShader(shader);
//         throw new Error(`[ERROR] The ${type == 0 ? 'vertex' : 'fragment'} shader could not be compiled: ${gl.getShaderInfoLog(shader)}`);
//     }
//     return shader;
// }
// function link(vertex, fragment, validate=false) {
//     const program = gl.createProgram();
//     gl.attachShader(program, vertex);
//     gl.attachShader(program, fragment);

//     gl.bindAttribLocation(program, POSITION_LOCATION, POSITION_NAME);
//     gl.bindAttribLocation(program, NORMAL_LOCATION, NORMAL_NAME);
//     gl.bindAttribLocation(program, UV_LOCATION, UV_NAME);

//     gl.linkProgram(program);

//     if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
//         gl.deleteProgram(program);
//         throw new Error(`[ERROR] A program could not be linked: ${gl.getProgramInfoLog(program)}`);
//     }

//     if (validate) {
//         gl.validateProgram(program);
//         if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
//             gl.deleteProgram(program);
//             throw new Error(`[ERROR] A program could not be validated: ${gl.getProgramInfoLog(program)}`);
//         }
//     }

//     gl.deleteShader(vertex);
//     gl.deleteShader(fragment);
    
//     return program;
// }
// function load(path) {
//     return fetch(path, {method: 'GET'})
//         .then(response => {return response.text()})
//         .catch(_ => {throw new Error(`[ERROR] Could not load the resource at ${path}`)});
// }

// GL Functions
// export async function build(path='./004/shaders') { // change to `./shaders` eventually
//     const vertex = await load(`${path}/vertext.glsl`);
//     const fragment = await load(`${path}/fragment.glsl`);

//     return link(compile(gl.VERTEX_SHADER, vertex), compile(gl.FRAGMENT_SHADER, fragment));
// }
// export const create = (id, options={}) => {
//     gl = document.getElementById(id).getContext('webgl2');
//     options = {clearColor: [1.0, 1.0, 1.0, 1.0], height: 300, width: 400, ...options};

//     if (!gl) throw new Error(`[ERROR] Your browser does not support WebGL 2.0`);

//     gl.canvas.style.height = options.height + 'px';
//     gl.canvas.style.width = options.width = 'px';
//     gl.canvas.height = options.height;
//     gl.canvas.width = options.width;

//     gl.viewport(0, 0, options.width, options.height);

//     gl.clearColor(...options.clearColor);
//     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
// };

// Utility Functions
// export const attributes = program => {
//     return {
//         position: gl.getAttribLocation(program, POSITION_NAME),
//         normal: gl.getAttribLocation(program, NORMAL_NAME),
//         uv: gl.getAttribLocation(program, UV_NAME)
//     };
// };
// export const before = () => {};
// export const buffer = (array, static=true) => {
//     const buffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
//     gl.bufferData(gl.ARRAY_BUFFER, array, static ? gl.STATIC_DRAW : gl.DYNAMIC_DRAW);
//     gl.bindBuffer(gl,ARRAY_BUFFER, null);

//     return buffer;
// }
// export const clear = () => {
//     resize(true);
//     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
// };
// export const dispose = program => {
//     if (gl.getParameter(gl.CURRENT_PROGRAM) === program) gl.useProgram(null);
//     gl.deleteProgram(program);
// };
// export const render = (vao, mode, count=0, indices=false) => {
//     gl.bindVertexArray(vao);
//     // if (index) gl.drawElements(gl[mode], count, gl.UNSIGNED_SHORT, 0);
//     // else gl.drawArrays(gl[mode], 0, count);
//     gl.drawArrays(gl[mode], 0, count);
//     gl.bindVertexArray(null);
// };
// export const resize = (update=false) => {
//     const ratio = update ? (window.devicePixelRatio || 1) : 1;
//     const height = Math.floor(gl.canvas.clientHeight * ratio);
//     const width = Math.floor(gl.canvas.clientWidth * ratio);

//     if (gl.canvas.height != height || gl.canvas.width != width) {
//         gl.canvas.width = width;
//         gl.canvas.height = height;
//     }

//     gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
// };
// export const run = program => {
//     gl.useProgram(program);
// };
// export const stop = () => {
//     gl.useProgram(null);
// };
// export const vao = (name, vertices, normals=[], uvs=[], indices=[]) => {
//     const vao = gl.createVertexArray();

//     if ((!Array.isArray(vertices) && vertices.length) || !Array.isArray(normals) || !Array.isArray(uvs) || !Array.isArray(indices)) throw new Error(`[Error] There was an error creating the VAO ${name}`);

//     gl.bindVertexArray(vao);
//     gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
//     gl.enableVertexAttribArray(POSITION_LOCATION);
//     gl.vertexAttribPointer(POSITION_LOCATION, 3, gl.FLOAT, false, 0, 0);

//     if (Array.isArray(normals) && normals.length) {
//         gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
//         gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
//         gl.enableVertexAttribArray(NORMAL_LOCATION);
//         gl.vertexAttribPointer(NORMAL_LOCATION, 3, gl.FLOAT, false, 0, 0);
//     }

//     if (Array.isArray(uvs) && uvs.length) {
//         gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
//         gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
//         gl.enableVertexAttribArray(UV_LOCATION);
//         gl.vertexAttribPointer(UV_LOCATION, 2, gl.FLOAT, false, 0, 0);
//     }

//     if (Array.isArray(indices) && indices.length) {
//         gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
//         gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
//         gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
//     }

//     gl.bindVertexArray(null);
//     gl.bindBuffer(gl.ARRAY_BUFFER, null);

//     return vao;
// };