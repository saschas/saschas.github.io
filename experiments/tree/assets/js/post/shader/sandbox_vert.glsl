varying vec3 vLightFront;
varying vec3 vNormal;

uniform vec3 ambient;
uniform vec3 diffuse;
uniform vec3 emissive;

uniform vec3 ambientLightColor;

uniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];
uniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];
uniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];
uniform float spotLightDistance[ MAX_SPOT_LIGHTS ];
uniform float spotLightAngle[ MAX_SPOT_LIGHTS ];
uniform float spotLightExponent[ MAX_SPOT_LIGHTS ];

uniform float morphTargetInfluences[ 4 ];

varying vec4 vShadowCoord[ MAX_SHADOWS ];
uniform mat4 shadowMatrix[ MAX_SHADOWS ];

void main(){

	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

	vec3 morphedNormal = vec3( 0.0 );

	morphedNormal +=  ( morphNormal0 - normal ) * morphTargetInfluences[ 0 ];
	morphedNormal +=  ( morphNormal1 - normal ) * morphTargetInfluences[ 1 ];
	morphedNormal +=  ( morphNormal2 - normal ) * morphTargetInfluences[ 2 ];
	morphedNormal +=  ( morphNormal3 - normal ) * morphTargetInfluences[ 3 ];

	morphedNormal += normal;

	vec3 transformedNormal = normalMatrix * morphedNormal;

	vec4 mPosition = objectMatrix * vec4( position, 1.0 );

	vLightFront = vec3( 0.0 );

	transformedNormal = normalize( transformedNormal );
	vNormal = transformedNormal;

	for( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {

		vec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );
		vec3 lVector = lPosition.xyz - mvPosition.xyz;

		lVector = normalize( lVector );

		float spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - mPosition.xyz ) );

		if ( spotEffect > spotLightAngle[ i ] ) {

			spotEffect = pow( spotEffect, spotLightExponent[ i ] );

			float lDistance = 1.0;
			if ( spotLightDistance[ i ] > 0.0 )
				lDistance = 1.0 - min( ( length( lVector ) / spotLightDistance[ i ] ), 1.0 );

			float dotProduct = dot( transformedNormal, lVector );
			vec3 spotLightWeighting = vec3( max( dotProduct, 0.0 ) );

			vLightFront += spotLightColor[ i ] * spotLightWeighting * lDistance * spotEffect;

		}

	}

	vLightFront = vLightFront * diffuse + ambient * ambientLightColor + emissive;

	vec3 morphed = vec3( 0.0 );
	morphed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];
	morphed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];
	morphed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];
	morphed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];

	morphed += position;

	gl_Position = projectionMatrix * modelViewMatrix * vec4( morphed, 1.0 );


	for( int i = 0; i < MAX_SHADOWS; i ++ ) {

			vShadowCoord[ i ] = shadowMatrix[ i ] * objectMatrix * vec4( morphed, 1.0 );

	}


}