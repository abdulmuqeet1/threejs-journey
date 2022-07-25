// uniform mat4 projectionMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 modelMatrix;

// attribute vec3 position;
// // position of geometry vertices

// float loremIpsum() {
//   return 1.0;
// }

// int sumFn(int a, int b) {
//   return a + b;
// }

// // int val = sumFn(1, 2);

// void main() {
//     // float foo = 123.12;
//     // int bar = -1;
//     // int baz = int(foo) + bar;

//     vec3 pos = vec3(0.0);
//     vec3 bar = vec3(0.0, 1.0, 0.0);

//     bar.z = 1.0;

//     vec2 baz = vec2(2.0, 1.0);

//     vec3 baz2 = vec3(baz, 0.0);

//     vec2 something = baz2.xz;
//     vec2 something2 = baz2.yz;

//     // vec4 = (x, y, z, w) 
//     vec4 wow = vec4(baz2, 0.0);

//     // purple color in rgb
//     vec3 purple = vec3(0.5, 0.0, 0.5);

//     gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
// } 

uniform mat4 projectionMatrix; // transform the coordinates into the clip space
uniform mat4 viewMatrix; // apply transformations relative to the camera(position, rotation, FOV, near, far)
uniform mat4 modelMatrix; // apply transformations relative to the mesh(position, rotation, scale)
uniform vec2 uFrequency;
uniform float uTime;

attribute vec2 uv;
attribute vec3 position; // position of geometry vertices
attribute float aRandom;
varying float vRandom;
varying vec2 vUv;
varying float vElevation;

void main() {
    // vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    // modelPosition.z += aRandom * 0.051;
    // modelPosition.z += sin(modelPosition.x * 10.0) * 0.1;

    // vec4 viewPosition = viewMatrix * modelPosition;
    // vec4 projectionPostion = projectionMatrix * viewPosition;

    // gl_Position = projectionPostion;

    // vRandom = aRandom;

    // * from 1:35:00 ==> uniform

    // having same shader but with dif results
    // being able to tweak values
    // animating the value

    // can be used in bith vertex and fragment shader

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.151;
    elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.151;
    modelPosition.z += elevation;

    // modelPosition.z += cos(modelPosition.x * uFrequency.x - uTime) * 0.1;
    // modelPosition.z += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPostion = projectionMatrix * viewPosition;

    gl_Position = projectionPostion;

    vUv = uv;
    vElevation = elevation;

}