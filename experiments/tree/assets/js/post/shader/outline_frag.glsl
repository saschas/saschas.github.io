
uniform sampler2D tDiffuse;

uniform float uScreenWidth;
uniform float uScreenHeight;

varying vec2 vUv;

// RGBA depth

float unpackDepth( const in vec4 rgba_depth ) {

	const vec4 bit_shift = vec4( 1.0 / ( 256.0 * 256.0 * 256.0 ), 1.0 / ( 256.0 * 256.0 ), 1.0 / 256.0, 1.0 );
	float depth = dot( rgba_depth, bit_shift );
	return depth;

}

float lum(vec4 c) {
  return dot(c.xyz, vec3(0.3, 0.59, 0.11));
}

void main() {

	//float depth = 1.0 - unpackDepth( texture2D( tDepth, vUv ) );
	//gl_FragColor = vec4( vec3( depth ), 1.0 );
	float xstep = 1.0/uScreenWidth;
	float ystep = 1.0/uScreenHeight;
	
	vec2 imageCoord = vUv;
	float t00 = unpackDepth(texture2D(tDiffuse, imageCoord + vec2(xstep * -1.0, ystep * -1.0)));
	float t10 = unpackDepth(texture2D(tDiffuse, imageCoord + vec2(xstep *  0.0, ystep * -1.0)));
	float t20 = unpackDepth(texture2D(tDiffuse, imageCoord + vec2(xstep *  1.0, ystep * -1.0)));
	float t01 = unpackDepth(texture2D(tDiffuse, imageCoord + vec2(xstep * -1.0, ystep *  0.0)));
	float t21 = unpackDepth(texture2D(tDiffuse, imageCoord + vec2(xstep *  1.0, ystep *  0.0)));
	float t02 = unpackDepth(texture2D(tDiffuse, imageCoord + vec2(xstep * -1.0, ystep *  1.0)));
	float t12 = unpackDepth(texture2D(tDiffuse, imageCoord + vec2(xstep *  0.0, ystep *  1.0)));
	float t22 = unpackDepth(texture2D(tDiffuse, imageCoord + vec2(xstep *  1.0, ystep *  1.0)));
	vec2 grad;
	float scale = 100.0;
	grad.x = t00 + scale * t01 + t02 - t20 - scale * t21 - t22;
	grad.y = t00 + scale * t10 + t20 - t02 - scale * t12 - t22;
	float len = length(grad);
	vec4 color;
	if(len > 0.1){
		color = vec4(0.0, 0.0, 0.0, 1.0);
	}else{
		color = texture2D( tDiffuse, vUv );
	}
	gl_FragColor = color;
    
}