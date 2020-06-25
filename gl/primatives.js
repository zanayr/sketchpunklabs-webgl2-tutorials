const collection = [];
function uniqueId () {
    return ('xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx').replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
function add(mesh) {
    const id = uniqueId();
    if (!mesh) return;
    collection.push({id: id, ...mesh});
    return id;
}
export const get = id => {
    return collection.find(mesh => mesh.id === id);
};
export const remove = id => {
    collection = collection.filter(mesh => mesh.id != id);
};


export const grid = (context, size=1.8, count=10.0) => {
    const vertices = [];
    const step = size / count;
    const half = size / 2;
    let t;

    for (let i = 0; i < count; i++) {
        
        // vertical line
        t = -half + (i * step);
        //               x, y,    z, c
        vertices.concat([p, half, 0, 0]); // first point
        vertices.concat([p, -half, 0, 1]); // second point
        // horiz. line
        t = half - (i * step);
        vertices.concat([-half, t, 0, 0]);
        vertices.concat([half, p, 0, 1]);
    }

    const colorLocation = 4;
    const vao = context.creatVertexArray();
    let stride = Float32Array.BYTES_PER_ELEMENT * 4; // matches the # of vertices per point (x, y, z) + color

    context.bindVertexArray(vao);
    context.bindBuffer(context.ARRAY_BUFFER, context.createBuffer());
    context.bufferData(context.ARRAY_BUFFER, new Float32Array(vertices), context.STATIC_DRAW);
    context.enableVertexAttribArray(POSITION_LOCATION);
    context.enableVertexAttribArray(colorLocation);

    context.vertexAttribPointer(
        POSITION_LOCATION,
        3,
        context.FLOAT,
        false,
        stride,
        0
    );
    context.vertexAttribPointer(
        colorLocation,
        1,
        context.FLOAT,
        false,
        stride,
        Float32Array.BYTES_PER_ELEMENT * 3
    );

    context.bindVertexArray(null);
    context.bindBuffer(context.ARRAY_BUFFER, null);

    return add({mode: context.LINES, vao: vao});
};