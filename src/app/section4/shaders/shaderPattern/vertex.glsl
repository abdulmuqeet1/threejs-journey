uniform mat4 projectionMatrix; // transform the coordinates into the clip space
uniform mat4 viewMatrix; // apply transformations relative to the camera(position, rotation, FOV, near, far)
uniform mat4 modelMatrix; // apply transformations relative to the mesh(position, rotation, scale)

attribute vec3 position; // position of geometry vertices
attribute vec2 uv;

varying vec2 vUv;

void main() {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

    vUv = uv;

}