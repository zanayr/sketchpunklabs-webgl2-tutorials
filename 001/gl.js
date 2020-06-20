function get(path) {
    return fetch(path)
        .then(response => {
            return response.text();
        });
}
function compile(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(`Error compiling shader: ${type} ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}
function link(gl, vertex, fragment, validate=false) {
    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(`Error linking program: ${gl.getProgramInfoLog(program)}`);
        gl.deleteProgram(program);
        return null;
    }
    if (validate) {
        gl.validateProgram(progarm);
        if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
            console.error(`Error validating program: ${gl.getProgramInfoLog(program)}`);
            gl.deleteProgram(program);
            return null;
        }
    }

    // gl.detachShader(program, vertex);
    // gl.getachShader(program, fragment);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);

    return program;
}
export const init = (id, width, height) => {
    const context = document.getElementById(id).getContext('webgl2');
    if (!context) throw `Your browser does not support WebGL 2.0, exiting...`;

    context.canvas.style.width = width + 'px';
    context.canvas.style.height = height + 'px';
    context.canvas.width = width;
    context.canvas.height = height;
    context.viewport(0, 0, width, height);

    context.clearColor(1.0, 1.0, 1.0, 1.0);
    context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);

    return context;
};
export const createArrayBuffer = (gl, array, isStatic=true) => {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, array, isStatic ? gl.STATIC_DRAW : gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return buffer;
}

async function loadResource(gl, path) {
    const vertex = await get(`${path}/vertex.glsl`);
    const fragment = await get(`${path}/fragment.glsl`);

    return link(gl, compile(gl, gl.VERTEX_SHADER, vertex), compile(gl, gl.FRAGMENT_SHADER, fragment));
}
export const load = (gl, path) => {
    return loadResource(gl, path);
};