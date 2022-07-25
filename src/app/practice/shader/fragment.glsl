uniform float uTime;
uniform vec3 iResolution;

varying vec2 vuv;

void main(){
	// vec2 p = gl_FragCoord.xy / iResolution.xy;
	vec2 p = vuv;
	vec2 q = p - vec2(0.2, 0.4);
    
	vec3 color = vec3(1.0, 0.4, 0.1);
	color = mix(color, vec3(1.0, 0.8, 0.3), sqrt(p.y));

	float r = 0.051 + 0.1 * cos(atan(q.y, q.x) * 8.0 + 30.0 * q.x + 2.0);

	color *= smoothstep(r, r + 0.05, length(q));

	r = 0.0051;
	r += 0.0015 * cos(q.y * 120.0);
	r += exp(-10.1 * q.y) * 0.00041;
	color *= 1.0 - (1.0 - smoothstep(r, r+0.01, abs(q.x - 0.1 * sin(q.y * 3.5)))) * (1.0 - smoothstep(0.0, 0.02, q.y));

    gl_FragColor = vec4(color, 1.0);
}