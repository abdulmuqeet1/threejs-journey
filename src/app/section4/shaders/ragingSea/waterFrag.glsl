#include <fog_pars_fragment>

uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform vec3 uSeaColorOffset;
uniform vec3 uSeaColorMultiplier;

varying float vElevation;

void main(){

    vec3 color = mix(uDepthColor, uSurfaceColor, vElevation + 0.45);

    gl_FragColor = vec4(color, 1.0);

    #include <fog_fragment>
}

