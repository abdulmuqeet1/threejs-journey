varying vec3 vColor;

void main(){
    vec3 color = vec3(1.0, 0.5, 0.5);

    // gl_FragColor = vec4(color, 1.0);
    // Disc
    // float strength = distance(gl_PointCoord, vec2(0.5, 0.5));
    // strength = 1.0 - step(0.5, strength);

    // Diffuse
    // float strength = distance(gl_PointCoord, vec2(0.5, 0.5));
    // strength *= 2.0;
    // strength = 1.0 - strength;

    // Light Point
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength;
    strength = pow(strength, 10.0);

    // final color
    vec3 f_color = mix(vec3(0.0), vColor, strength);

    // gl_FragColor = vec4(gl_PointCoord, 1.0, 1.0);
    gl_FragColor = vec4(f_color, 1.0);

}