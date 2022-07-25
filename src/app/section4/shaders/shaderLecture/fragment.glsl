precision mediump float;

uniform vec3 uColor;
uniform sampler2D uTexture;

varying float vRandom;
varying vec2 vUv;
varying float vElevation;


void main(){
    // vec3 color = vec3(1.0, 0.0, 0.0);
    // gl_FragColor = vec4(color, 1.0);
    
    // gl_FragColor = vec4(0.5, 0.0, 0.5, 1.0);
    
    // gl_FragColor = vec4(vRandom, vRandom * 0.65, 1.0, 1.0);
    
    // gl_FragColor = vec4(colorX, colorY, colorZ, 1.0);

    // gl_FragColor = color;


    vec4 textureColor = texture2D(uTexture, vUv);

    textureColor.rgb *= vElevation * 1.5;

    // vec4 texture_color = texture2D(uTexture, gl_PointCoord);

    gl_FragColor = textureColor;

    gl_FragColor = vec4(vUv, 1.0, 1.0);
}