// float f(float x){
//     return 1.0 - pow(cos(3.141 * x), 3.0);
// }

// float circ(float x, float y, float r){
//     return f(clamp(1.0 - pow(pow(mod(x, 2.0*r)/r-1.0, 2.0) + pow(mod(y,2.0*r)/r-1.0, 2.0), 0.5), 0.0, 1.0));
// }

// float distorted(float x, float y, float r, float cx ,float cy, float intensity){
//     return circ(
//                (x - cx) * intensity + cx,
//                (y - cy) * intensity + cy,
//                r
//            );
// }

// void mainImage( out vec4 fragColor, in vec2 fragCoord )
// {
//     float r = iResolution.x / 20.0;
//     float x = fragCoord.x + iTime * r;
//     float y = fragCoord.y;
//     float cx = iResolution.x / 2.0 + iTime * r;
//     float cy = iResolution.y / 2.0;
    
//     fragColor.r = distorted(x, y, r, cx, cy, 1.05);
//     fragColor.g = distorted(x, y, r, cx, cy, 1.10);
//     fragColor.b = distorted(x, y, r, cx, cy, 1.15);
// }

// uniform mat4 modelMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 projectionMatrix;


varying vec2 vuv;

void main() {

    vec4 modelPostion = modelMatrix * vec4(position, 1.0);
    vec4 viewPostion = viewMatrix * modelPostion;
    vec4 projectionPostion = projectionMatrix * viewPostion;

    gl_Position = projectionPostion;

    vuv = uv;

} 