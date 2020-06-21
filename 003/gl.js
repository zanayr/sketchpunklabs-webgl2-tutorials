const POSITION_LOCATION = 0;
const NORMAL_LOCATION = 1;
const UV_LOCATION = 2;
const POSITION_NAME = 'a_position';
const NORMAL_NAME = 'a_normal';
const UV_NAME = 'a_uv';

// Shader Functions
/**
 * The `compile` function should compile and return a shader when passed a WebGL
 * context, type and shader code
 * @param {WebGLObject} context is a `WebGLObject`
 * @param {Number} type is a shader type identifier
 * @param {String} source is a string of shader source code
 * @returns a valid WebGL compiled shader
 */
function compile(context, type, source) {
    const shader = context.createShader(type);
    //  Load the shader source and compile the shader
    context.shaderSource(shader, source);
    context.compileShader(shader);
    // Check and return the shader if the it compiled correctly
    if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
        context.deleteShader(shader);
        throw new Error(`Error: The shader ${type} ${context.getShaderInfoLog(shader)} could not be compiled`);
    }
    return shader;
}
/**
 * The `load` function should return a `Promise` containing shader source code when
 * passed a path
 * @param {String} path is the path to the shader directory
 * @returns a promise with the shader text
 */
function load(path) {
    // Send a GET request to the passed path returning its source text or and error
    return fetch(path, {method: 'GET'})
        .then(response => {
            return response.text();
        })
        .catch(error => {
            console.error(error);
            throw new Error(`Error: The shader located at "${path}" was not found`);
        });
}
/**
 * The `resize` function should resize the WebGL context when passed a WebGL context
 * and an update flag
 * @param {WebGLObject} context is a `WebGLObject`
 * @param {Boolean} update is a flag to update the context's aspect ratio
 * @returns undefined
 */
function resize(context, update=false) {
    const ratio = update ? (window.devicePixelRatio || 1) : 1;
    const width = Math.floor(context.canvas.clientWidth * ratio);
    const height = Math.floor(context.canvas.clientHeight * ratio);

    if (context.canvas.width != width || context.canvas.height != height) {
        context.canvas.width = width;
        context.canvas.height = height;
    }
    context.viewport(0, 0, context.canvas.width, context.canvas.height);
}


// Program Function
/**
 * The `link` function should return a linked program when passed a WebGL context,
 * shaders and an optional validation flag
 * @param {WebGLObject} context is a `WebGLObject`
 * @param {*} vertex is a compiled WebGL vertex shader
 * @param {*} fragment is a compiled WebGL fragment shader
 * @param {Boolean} validate is a Boolean flag\
 * @returns a linked WebGL program
 */
function link(context, vertex, fragment, validate=false) {
    const program = context.createProgram();
    context.attachShader(program, vertex);
    context.attachShader(program, fragment);

    // Force predefined locations for specific attributes
    // NOTE: If the attribute isn't used in the shader its location will default to -1
    context.bindAttribLocation(program, POSITION_LOCATION, POSITION_NAME);
    context.bindAttribLocation(program, NORMAL_LOCATION, NORMAL_NAME);
    context.bindAttribLocation(program, UV_LOCATION, UV_NAME);

    context.linkProgram(program);

    // Check if the program was successfully linked
    if (!context.getProgramParameter(program, context.LINK_STATUS)) {
        context.deleteProgram(program);
        throw new Error(`Error: The program ${context.getProgramInfoLog(program)} could not be linked`);
    }

    // Check if the validation flag was passed
    if (validate) {
        context.validateProgram(program);
        if (!context.getProgramParameter(program, context.VALIDATE_STATUS)) {
            context.deleteProgram(program);
            throw new Error(`Error: The program ${context.getProgramInfoLog(program)} could not be validated`);
        }
    }

    // Detatch and delete the shaders and return the final linked program
    // NOTE: Detaching might cause issues on some browsers, only deleting is required
    // context.detachShader(program, vertex);
    // context.detachShader(program, fragment);
    context.deleteShader(vertex);
    context.deleteShader(fragment);
    return program;
};


// GL Functions
/**
 * The `build` function should return a WebGL program when passed a WebGL context
 * @param {WebGLObject} context is a `WebGLObject`
 * @param {String} path is a path to the shader directory
 * @returns a WebGL program
 */
export async function build(context, path='./003/shaders') {
    const vertex = await load(`${path}/vertex.glsl`);
    const fragment = await load(`${path}/fragment.glsl`);
    console.log(vertex, fragment);
    return link(context, compile(context, context.VERTEX_SHADER, vertex), compile(context, context.FRAGMENT_SHADER, fragment));
};
/**
 * The `init` function should return a WebGL context when passed an id string and
 * optional `options` object
 * @param {String} id is a canvas DOM element's id
 * @param {Object} options is an optional object
 * @returns a WebGL context
 */
export const init = (id, options={}) => {
    const context = document.getElementById(id).getContext('webgl2');
    options = {...{clearColor: [1.0, 1.0, 1.0, 1.0], height: 300, width: 400}, ...options};
    // Check if the id was valid
    if (!context) throw new Error(`Error: Your browser does not support WebGL 2.0`);

    // Build the DOM canvas element
    context.canvas.style.width = options.width + 'px';
    context.canvas.style.height = options.height + 'px';
    context.canvas.width = options.width;
    context.canvas.height = options.height;
    // Reset the context's viewport
    context.viewport(0, 0, options.width, options.height);
    // Set the `clearColor` property, and return the context after clearing the canvas
    context.clearColor(...options.clearColor);
    context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
    return context;
};
/**
 * The `run` function should run a WebGL program given a WebGL context and program to
 * execute
 * @param {WebGLObject} context is a `WebGLObject`
 * @param {Function} program is a WebGL program
 * @returns undefined
 */
export const run = (context, program) => {
    if (!program) throw new Error(`Error: A valid program was not passed to the \`run\` function`);
    try {
        context.useProgram(program);
        // setAttribLocations(context, program);
    } catch (error) {
        throw new Error(`Error: There was a problem running the program`);
    }
};


// GL Utility Functions
/**
 * The `activate` function should activate a WebGL program when passed a WebGL context
 * and program
 * @param {WebGLObject} context is a `WebGLObject`
 * @param {Function} program is a WebGL program
 * @returns undefined
 */
export const activate = (context, program) => {
    context.useProgram(program);
};
export const attributes = (context, program) => {
    return {
        position: context.getAttribLocation(program, POSITION_NAME),
        normal: context.getAttribLocation(program, NORMAL_NAME),
        uv: context.getAttribLocation(program, UV_NAME),
    }
};
/**
 * The `before` function will be used later...
 */
export const before = () => {};
/**
 * The `clear` function should resize the WebGL context before clearing it
 * @param {WebGLObject} context is a `WebGLObject`
 * @returns undefined
 */
export const clear = context => {
    resize(context, true);
    context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
};
/**
 * The `deactivate` function should deactivate the current WebGL program when passed a
 * WebGL context
 * @param {WebGLObject} context is a `WebGLObject`
 * @returns undefined
 */
export const deactivate = context => {
    context.useProgram(null);
};
/**
 * The `dispose` function should deactivate the current program and then delete it when
 * passed a WebGL context and program
 * @param {WebGLObject} context is a `WebGLObject`
 * @param {Function} program is a WebGL program
 * @returns undefined
 */
export const dispose = (context, program) => {
    if (context.getParameter(context.CURRENT_PROGRAM) === program) context.useProgram(null);
    context.deleteProgram(program);
};
/**
 * The `render` function should bind and draw a vao when passed valid WebGL context,
 * vao, mode, and an index count or vertex flag
 * @param {WebGLObject} context is a `WebGLObject`
 * @param {*} vao is a VertexArrayObject
 * @param {Number} mode is a drawing mode identifier
 * @param {Number} count is the number of indices or vertices
 * @param {Boolean} vertex is a boolean flag indicating if `count` is the number of indices or vertices
 * @retuns undefined
 */
export const render = (context, vao, mode, count=0, vertex=false) => {
    context.bindVertexArray(vao);
    // if (vertex) context.drawElements(mode, count, context.UNSIGNED_SHORT, 0);
    // else context.drawArrays(mode, 0, count);
    context.drawArrays(mode, 0, count);
    context.bindVertexArray(null);
};
/**
 * The `vao` function should return a `VertexArrayObject` when passed a WebGL context,
 * name, and an array of vertices and optional arrays of indices, normals and uvs
 * @param {WebGLObject} context is a `WebGLObject`
 * @param {String} name is a string
 * @param {Array} vertices is an array of vertices triplets
 * @param {Array} normals is an array of normals triplets
 * @param {Array} uvs is an array of UV pairs
 * @param {Array} indices is an array of indices triplets
 * @returns a `VertexArrayObject`
 */
export const vao = (context, name, vertices, normals=[], uvs=[], indices=[]) => {
    const vao = context.createVertexArray();
    //  Check if the arrays are valid and bind the vertex array object
    if ((!Array.isArray(vertices) && vertices.length) || !Array.isArray(normals) || !Array.isArray(uvs) || !Array.isArray(indices)) throw new Error(`Error: There was an error creating the VAO for ${name}`);
    context.bindVertexArray(vao);
    //  Bind the vertices buffer, load the data, enable the VAO and set its pointer
    context.bindBuffer(context.ARRAY_BUFFER, context.createBuffer());
    context.bufferData(context.ARRAY_BUFFER, new Float32Array(vertices), context.STATIC_DRAW);
    context.enableVertexAttribArray(POSITION_LOCATION);
    context.vertexAttribPointer(POSITION_LOCATION, 3, context.FLOAT, false, 0, 0);
    // Bind the normals buffer, load the data, enable the VAO and set its pointer, if
    // there is a normals array 
    if (Array.isArray(normals) && normals.length) {
        context.bindBuffer(context.ARRAY_BUFFER, context.createBuffer());
        context.bufferData(context.ARRAY_BUFFER, new Float32Array(normals), context.STATIC_DRAW);
        context.enableVertexAttribArray(NORMAL_LOCATION);
        context.vertexAttribPointer(NORMAL_LOCATION, 3, context.FLOAT, false, 0, 0);
    }
    // Bind the uvs buffer, load the data, enable the VAO and set its pointer, if there
    // is a uvs array
    if (Array.isArray(uvs) && uvs.length) {
        context.bindBuffer(context.ARRAY_BUFFER, context.createBuffer());
        context.bufferData(context.ARRAY_BUFFER, new Float32Array(uvs), context.STATIC_DRAW);
        context.enableVertexAttribArray(UV_LOCATION);
        context.vertexAttribPointer(UV_LOCATION, 2, context.FLOAT, false, 0, 0);
    }
    // Bind the indices buffer, load the data, enable the VAO and set its pointer, if
    // there is a indices array 
    if (Array.isArray(indices) && indices.length) {
        context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, context.createBuffer());
        context.bufferData(context.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), context.STATIC_DRAW);
        context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, null);
    }
    // Clear the bindings and return the VAO
    context.bindVertexArray(null);
    context.bindBuffer(context.ARRAY_BUFFER, null);
    return vao;
};