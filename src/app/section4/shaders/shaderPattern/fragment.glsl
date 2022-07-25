#define PI 3.14159265358979323846;

precision mediump float;

varying vec2 vUv;

float random(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

// uv points rotation function
vec2 rotate(vec2 p, float a){
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, -s, s, c);
    return m * p;
}

vec2 UVrotation(vec2 uv, float angle, vec2 mid){
    return vec2(
        cos(angle) * (uv.x - mid.x) + sin(angle) * (uv.y - mid.y) + mid.x,
        cos(angle) * (uv.y - mid.y) - sin(angle) * (uv.x - mid.x) + mid.y
    );
}

// classic perlin noise

vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

vec4 permute(vec4 x ){
    return mod(((x*34.0)+1.0)*x, 289.0);
}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

void main(){
    // vec3 color = vec3(vUv.x* 255, vUv.y* 255, 1.0);
    // vec3 color = vec3(vUv.x, vUv.x, vUv.x);

    // pattern# 1
    // use uv as color for normal color to identify related problems
    // vec3 color = vec3(vUv, 0.0);

    // pattern# 2
    // vec3 color = vec3(vUv, 1.0);

    // pattern# 3
    // black & white (black at left side and white at right side)
    // vec3 color = vec3(0.80 * vUv.x, 0.80 * vUv.x, 0.80 * vUv.x);

    // pattern# 4
    // black & white (black at bottom and white at top)
    // float strength = vUv.y;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // pattern# 5
    // black & white (white at bottom and black at top)
    // float strength = 1.0 - vUv.y;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // pattern# 6
    // black & white 
    // float strength = vUv.y * 8.0;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // pattern# 7
    // black & white stripes
    // float strength = mod(vUv.y * 10.0 , 1.0);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // pattern# 8
    // black & white stripes (solid)
    // float strength = mod(vUv.y * 10.0 , 1.0);
    // strength = strength < 0.5 ? 0.0 : 1.0; // or
    // strength = step(0.5, strength);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // pattern# 9
    // black & white stripes (solid)
    // float strength = mod(vUv.y * 10.0 , 1.0);
    // strength = step(0.8, strength);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // pattern# 10
    // black & white stripes (solid)
    // float strength = mod(vUv.x * 10.0 , 1.0);
    // strength = step(0.8, strength);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);
    
    // pattern# 11
    // black & white box
    // float strength = step(0.8, mod(vUv.x * 10.0 , 1.0));
    // strength += step(0.8, mod(vUv.y * 10.0 , 1.0));
    
    // gl_FragColor = vec4(strength, strength, strength, 1.0);
    
    // pattern# 12
    // black & white dots
    // float strength = step(0.8, mod(vUv.x * 10.0 , 1.0));
    // strength *= step(0.8, mod(vUv.y * 10.0 , 1.0));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);
    
    // pattern# mine
    // black & white dots
    // float strength = step(0.2, mod(vUv.x * 10.0 , 1.0)) == step(0.2, mod(vUv.y * 10.0 , 1.0)) ? 1.0 : 0.0;
    // strength += step(0.8, mod(vUv.y * 10.0 , 1.0));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);
    
    // // pattern# 13
    // // black & white tiles(along x axis)
    // float strength = step(0.8, mod(vUv.y * 10.0 , 1.0));
    // strength -= step(0.8, mod(vUv.x * 10.0 , 1.0));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // pattern# 14
    // black & white(idk some shape)
    // float barX = step(0.4, mod(vUv.x * 10.0 , 1.0));
    // barX *= step(0.8, mod(vUv.y * 10.0 , 1.0));

    // float barY = step(0.8, mod(vUv.x * 10.0 , 1.0));
    // barY *= step(0.4, mod(vUv.y * 10.0 , 1.0));
    
    // float strength = barX + barY;
    
    // gl_FragColor = vec4(strength, strength, strength, 1.0);
    
    
    // // pattern# 15
    // // plus shape
    // float barX = step(0.4, mod(vUv.x * 10.0  , 1.0));
    // barX *= step(0.8, mod(vUv.y * 10.0 + 0.2, 1.0));

    // float barY = step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0));
    // barY *= step(0.4, mod(vUv.y * 10.0 , 1.0));
    
    // float strength = barX + barY;
    
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // pattern# 16
    // // some  shape
    // float strength = abs(vUv.x - 0.5);    
    // gl_FragColor = vec4(strength, strength, strength, 1.0);
    
    // // pattern# 17 
    // float lineX = abs(vUv.x - 0.5);
    // float lineY = abs(vUv.y - 0.5);
    // float strength = min(lineX, lineY);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);
    
    // // pattern# 18 
    // float lineX = abs(vUv.x - 0.5);
    // float lineY = abs(vUv.y - 0.5);
    // float strength = max(lineX, lineY);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);
    
    // // pattern# 19 
    // float lineX = abs(vUv.x - 0.5);
    // float lineY = abs(vUv.y - 0.5);
    // float strength = step(0.2, max(lineX, lineY));
    
    // pattern# 20 
    // float lineX = abs(vUv.x - 0.5);
    // float lineY = abs(vUv.y - 0.5);
    // float strength = step(0.4, max(lineX, lineY));
    // or
    // // pattern# 20 
    // float square1 = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // float square2 = 1.0 - step(0.25, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // float strength = square2 * square1;

    // // pattern# 21 
    // float strength = floor(vUv.x * 10.0) / 10.0;
    
    // // pattern# 22 
    // float lineX = floor(vUv.x * 10.0) / 10.0;
    // float lineY = floor(vUv.y * 10.0) / 10.0;
    // float strength = lineX * lineY;

    // // pattern# 23
    // vec2 vals = vec2(vUv.x * 10.0, vUv.y * 10.0);
    // float strength = random(vUv);
    
    // // pattern# 23
    // vec2 grid = vec2(floor(vUv.x * 10.0) / 10.0, floor((vUv.y + vUv.x) * 10.0 + 0.5) / 10.0);
    // float strength = random(grid);

    // // pattern# 24
    // float strength = length(vUv);
 
    // // pattern# 25
    // // float strength = length(vUv - 0.5); // or
    // float strength = distance(vUv, vec2(0.5, 0.5));
 
    // // pattern# 26
    // float strength = 0.02 / distance(vUv, vec2(0.5));
 
    // // pattern# 27
    // vec2 lightUV = vec2(vUv.x * 0.1 + 0.45, vUv.y * 0.5 + 0.25);
    // float strength = 0.02 / distance(lightUV, vec2(0.5));
 
    // // pattern# 28
    // vec2 lightUvX = vec2(vUv.x * 0.1 + 0.45, vUv.y * 0.5 + 0.25);
    // float lightX = 0.015 / distance(lightUvX, vec2(0.5));
    // vec2 lightUvY = vec2(vUv.y * 0.1 + 0.45, vUv.x * 0.5 + 0.25);
    // float lightY = 0.015 / distance(lightUvY, vec2(0.5));
    // float strength = lightX * lightY;
 
    // pattern# 28 // ! not working
    // rotate the star (1/8th of circle)
    // vec2 someUvValues = UVrotation(vUv, PI * 0.25,  vec(0.5));

    // vec2 rotatedUv = rotate(vUv, 0.02);
    // vec2 lightUvX = vec2(rotatedUv.x * 0.1 + 0.45, rotatedUv.y * 0.5 + 0.25);
    // float lightX = 0.015 / distance(lightUvX, vec2(0.5));

    // vec2 lightUvY = vec2(rotatedUv.y * 0.1 + 0.45, rotatedUv.x * 0.5 + 0.25);
    // float lightY = 0.015 / distance(lightUvY, vec2(0.5));

    // float strength = lightX * lightY;

     
    // // pattern# 30
    // // circle
    // float strength = distance(vUv, vec2(0.5));
    // strength = step(0.25, strength);
    
    // // pattern# 31
    // // some circle
    // float strength = abs(distance(vUv, vec2(0.5)) - 0.25);

    // // pattern# 32
    // // some circle
    // float strength = step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));
    
    // // pattern# 33
    // // some circle
    // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));
 
    // // pattern# 34
    // // a strange circle
    // vec2 waveUv = vec2(vUv.x, vUv.y + sin(vUv * 30.0) * 0.1);
    // float strength = step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));
 
    // // pattern# 35
    // // some shape
    // vec2 waveUv = vec2(vUv.x + sin(vUv.y * 30.0) * 0.1, 
    //                     vUv.y + sin(vUv.x * 30.0) * 0.1
    //                 );
    // float strength = step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));
 
    // // pattern# 36
    // // some shape
    // vec2 waveUv = vec2(
    //     vUv.x + sin(vUv.y * 100.0) * 0.1, 
    //     vUv.y + sin(vUv.x * 100.0) * 0.1
    //         );
    // float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));
 
    // // pattern# 37
    // // some shape
    // float angle = atan(vUv.x, vUv.y);
    // float strength = angle;
 
    // // pattern# 38
    // // some shape
    // float angle = atan(vUv.x - 0.5, vUv.y);
    // float strength = angle;
    
    // // pattern# 39
    // // some shape
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI;
    // angle += 0.5;
    // float strength = angle;
 
    // // pattern# 40
    // // some shape
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // // angle /= PI * 2.0;
    // angle += 50.0;
    // angle = mod(angle, 0.5);
    // float strength = angle;
    
    // // pattern# 41
    // // some shape
    float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    angle += 100.0;
    angle = mod(angle, 0.5);
    float strength = sin(angle * 1000000.0);

    //   // pattern# 42
    // // a fancy circle?
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle += 0.5;
    // float sinusoid = sin(angle * 15.0);
    
    // float radius = 0.25 + sinusoid * 0.02;
    // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - radius));

    //  // pattern# 43
    // // perlin noise
    // float strength = cnoise(vUv * 10.0);
    
    // // pattern# 44
    // // perlin noise
    // float strength = cnoise(vUv * 10.0);
    
    // // pattern# 45
    // // perlin noise
    // float strength = 1.0 - abs(cnoise(vUv * 10.0));
    
    // // pattern# 46
    // // perlin noise
    // float strength = sin(cnoise(vUv * 10.0) * 20.0);
    
    // // pattern# 47
    // // perlin noise
    // float strength = step(0.9, sin(cnoise(vUv * 10.0) * 20.0));


    // perlin noise - color version
    vec3 blackColor = vec3(0.0);
    vec3 uvColor = vec3(vUv, 1.0);
    vec3 mixedColor = mix(blackColor, uvColor, strength);

    gl_FragColor = vec4(mixedColor, 1.0);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);
    

}

