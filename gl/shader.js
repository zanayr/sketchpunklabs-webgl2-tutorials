const POSITION_LOCATION = 0;
const NORMAL_LOCATION = 1;
const UV_LOCATION = 2;
const POSITION_NAME = 'a_position';
const NORMAL_NAME = 'a_normal';
const UV_NAME = 'a_uv';

// export const renderVao = (vao, mode, count=0, indices=false) => {
//     context.bindVertexArray(vao);
//     // if (indices) gl.drawElements(gl[mode], count, gl.UNSIGNED_SHORT, 0);
//     // else gl.drawArrays(gl[mode], 0, count);
//     context.drawArrays(mode, 0, count);
//     context.bindVertexArray(null);
// };

function compile(context, type, source) {
    const shader = context.createShader(type);
    context.shaderSource(shader, source);
    context.compileShader(shader);

    if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
        context.deleteShader(shader);
        throw new Error(`Unable to compile shader: ${context.getShaderInfoLog(shader)}`);
    }

    return shader;
}
function link(context, vertex, fragment) {
    const program = context.createProgram();
    console.log(vertex);
    context.attachShader(program, vertex);
    context.attachShader(program, fragment);

    context.bindAttribLocation(program, POSITION_LOCATION, POSITION_NAME);
    context.bindAttribLocation(program, NORMAL_LOCATION, NORMAL_NAME);
    context.bindAttribLocation(program, UV_LOCATION, UV_NAME);

    context.linkProgram(program);

    if (!context.getProgramParameter(program, context.LINK_STATUS)) {
        context.deleteProgram(program);
        throw new Error(`Unable to link program: ${context.getProgramInfoLog(program)}`);
    }

    if (validate) {
        context.validateProgram(program);
        if (!context.getProgramParameter(program, context.VALIDATE_STATUS)) {
            context.deleteProgram(program);
            throw new Error(`Unable to validate program: ${context.getProgramInfoLog(program)}`);
        }
    }

    context.deleteShader(vertex);
    context.deleteShader(fragment);
    
    return program;
}
async function load(path) {
    fetch(path, {method: 'GET'})
        .then(response => response.text());
};


export const attributes = (context, program) => ({
    position: context.getAttribLocation(program, POSITION_NAME),
    normal: context.getAttribLocation(program, NORMAL_NAME),
    uv: context.getAttribLocation(program, UV_NAME)
});
export const create = (context, path) => {
    const vertex = await load(path).then(source => compile(context, context.VERTEX, source));
    const fragment = await load(path).then(source => compile(context, context.FRAGMENT, source));

    return link(context, vertex, fragment);
}