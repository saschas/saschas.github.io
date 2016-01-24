#extension GL_OES_standard_derivatives : enable

uniform float opacity;

varying vec3 vLightFront;
varying vec3 vNormal;

uniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];

uniform sampler2D shadowMap[ MAX_SHADOWS ];
uniform vec2 shadowMapSize[ MAX_SHADOWS ];

uniform float shadowDarkness[ MAX_SHADOWS ];
uniform float shadowBias[ MAX_SHADOWS ];

varying vec4 vShadowCoord[ MAX_SHADOWS ];

float unpackDepth( const in vec4 rgba_depth ) {

	const vec4 bit_shift = vec4( 1.0 / ( 256.0 * 256.0 * 256.0 ), 1.0 / ( 256.0 * 256.0 ), 1.0 / 256.0, 1.0 );
	float depth = dot( rgba_depth, bit_shift );
	return depth;

}

uniform vec3 fogColor;

uniform float fogNear;
uniform float fogFar;

float stepmix(float edge0, float edge1, float E, float x){

    float T = clamp(0.5 * (x - edge0 + E) / E, 0.0, 1.0);
    return mix(edge0, edge1, T);

}

void main(){


	vec3 lightDir = normalize(vec3(spotLightPosition[0]));
	
	vec3 Eye = vec3(0, 0, 1);
    vec3 H = normalize(lightDir + Eye);

	float df = (max(0.0, dot(vNormal, lightDir))*0.5)+0.5;
	df *= df;

	const float A = 0.3;
	const float B = 0.2;
	const float C = 0.7;
	const float D = 1.0;

	float E = fwidth(df)*3.0;

	if      (df > A - E && df < A + E) df = stepmix(A, B, E, df);
	else if (df > B - E && df < B + E) df = stepmix(B, C, E, df);
	else if (df > C - E && df < C + E) df = stepmix(C, D, E, df);
	else if (df < A) df = 0.3;
	else if (df < B) df = B;
	else if (df < C) df = C;
	else df = D;

	float sf = max(0.0, dot(vNormal, H));
    sf = pow(sf, 8.0);

    E = fwidth(sf);
	if (sf > 0.5 - E && sf < 0.5 + E){
	    sf = smoothstep(0.5 - E, 0.5 + E, sf);
	}
	else{
	   sf = step(0.5, sf);
	}

	vec3 color = df * vec3 ( 0.8, 0.83, 0.85 ) + sf * vec3( 1.0 );

    gl_FragColor = vec4(color, 1.0);



	float fDepth;
	vec3 shadowColor = vec3( 1.0 );

	for( int i = 0; i < MAX_SHADOWS; i ++ ) {

		vec3 shadowCoord = vShadowCoord[ i ].xyz / vShadowCoord[ i ].w;

		// if ( something && something ) 		 breaks ATI OpenGL shader compiler
		// if ( all( something, something ) )  using this instead

		bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );
		bool inFrustum = all( inFrustumVec );

		// don't shadow pixels outside of light frustum
		// use just first frustum (for cascades)
		// don't shadow pixels behind far plane of light frustum

		bvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );

		bool frustumTest = all( frustumTestVec );

		if ( frustumTest ) {

			shadowCoord.z += shadowBias[ i ];

			vec4 rgbaDepth = texture2D( shadowMap[ i ], shadowCoord.xy );
			float fDepth = unpackDepth( rgbaDepth );

			if ( fDepth < shadowCoord.z )

				// spot with multiple shadows is darker

				shadowColor = shadowColor * vec3( 1.0 - shadowDarkness[ i ] );

				// spot with multiple shadows has the same color as single shadow spot

				//shadowColor = min( shadowColor, vec3( shadowDarkness[ i ] ) );


		}

	}


	gl_FragColor.xyz = gl_FragColor.xyz * shadowColor;

	// Fog
	float depth = gl_FragCoord.z / gl_FragCoord.w;
	float fogFactor = smoothstep( fogNear, fogFar, depth );

	gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );

}