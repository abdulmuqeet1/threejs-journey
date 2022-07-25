void main() {

    vec4 modelPostion = modelMatrix * vec4(position, 1.0);
    vec4 viewPostion = viewMatrix * modelPostion;
    vec4 projectionPostion = projectionMatrix * viewPostion;

    gl_Position = projectionPostion;
} 