#version 300 es
in vec3 a_position;

uniform float u_point_size;

void main(void){
    gl_PointSize = u_point_size;
    gl_Position = vec4(a_position, 1.0);
}