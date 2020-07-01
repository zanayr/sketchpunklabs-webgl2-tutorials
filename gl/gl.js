import * as shader from './shader.js';

let context;

//  Context Functions
function resize(update=false) {
    const ratio = update ? (window.devicePixelRatio || 1) : 1;
    const height = Math.floor(context.canvas.clientHeight * ratio);
    const width = Math.floor(context.canvas.clientWidth * ratio);

    if (context.canvas.height != height || context.canvas.width != width) {
        context.canvas.width = width;
        context.canvas.height = height;
    }

    context.viewport(0, 0, context.canvas.width, context.canvas.height);
}
function clear() {
    resize(true);
    context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
}

// Vertex Array Object
function vao(name, mode, vertices, normals=[], uvs=[], indices=[]) {
    const vao = context.createVertexArray();

    if ((!Array.isArray(vertices) && vertices.length) || !Array.isArray(normals) || !Array.isArray(uvs) || !Array.isArray(indices)) throw new Error(`There was an error creating the VAO ${name}`);

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

    return {vao: vao, mode: context[mode.toUpperCase()], count: vertices.length};
}

export const program = path => shader.create(context, path).then(program => program);
export const build = (ctx, id, options={}) => {
    options = {width: 400, height: 300, clearColor: [1.0, 1.0, 1.0, 1.0], ...options};
    context = ctx = document.getElementById(id).getContext('webgl2');
    if (!context) throw new Error(`Your browser does not support WebGL 2.0`);

    context.canvas.style.width = options.width + 'px';
    context.canvas.style.height = options.height + 'px';
    context.canvas.width = options.width;
    context.canvas.height = options.height;

    context.viewport(0, 0, options.width, options.height);

    context.clearColor(...options.clearColor);
    context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BUT);
    
    return {
        clear: clear,
        getUniform: (program, name) => context.getUniformLocation(program, name),
        run: program => context.useProgram(program),
        setUniform: (location, value) => context.uniform1f(location, value),
        stop: () => context.useProgram(null),
        vao: vao,
    }
};