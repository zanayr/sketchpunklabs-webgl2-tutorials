export const grid = (size=1.8, count=10.0) => {
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
    const vao = gl.creatVertexArray();
    let stride = Float32Array.BYTES_PER_ELEMENT * 4; // matches the # of vertices per point (x, y, z) + color

    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(POSITION_LOCATION);
    gl.enableVertexAttribArray(colorLocation);

    gl.vertexAttribPointer(
        POSITION_LOCATION,
        3,
        gl.FLOAT,
        false,
        stride,
        0
    );
    gl.vertexAttribPointer(
        colorLocation,
        1,
        gl.FLOAT,
        false,
        stride,
        Float32Array.BYTES_PER_ELEMENT * 3
    );

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
};