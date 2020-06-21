#version 300 es
in vec3 a_position;

uniform float u_size;
uniform float u_angle;

void main(void){
    gl_PointSize = u_size;
    gl_Position = vec4(
        cos(u_angle) * 0.8 + a_position.x,
        sin(u_angle) * 0.8 + a_position.y,
        a_position.z, 1.0
    );
}