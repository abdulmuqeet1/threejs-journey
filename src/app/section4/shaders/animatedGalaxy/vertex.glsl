uniform float uSize;
uniform float uTime;

attribute float aScale;
// attribute vec3 randomness;

varying vec3 vColor;

void main() {

    vec4 modelPostion = modelMatrix * vec4(position, 1.0);

    // spin
    float angle = atan(modelPostion.x, modelPostion.z);
    float distanceToCenter = length(modelPostion.xz);
    float angleOffset = (1.0/ distanceToCenter) * uTime * 0.2;
    angle += angleOffset;

    modelPostion.x = cos(angle) * distanceToCenter;
    modelPostion.z = sin(angle) * distanceToCenter;

    // randomness
    // modelPostion.xyz += randomness;

    vec4 viewPostion = viewMatrix * modelPostion;
    vec4 projectionPostion = projectionMatrix * viewPostion;

    gl_Position = projectionPostion;
    gl_PointSize = uSize;
    gl_PointSize *= ( 1.0 / - viewPostion.z );

    vColor = color;
} 