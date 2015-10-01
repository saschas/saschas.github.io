    var container;

    var camera, scene,controls, composer;
    var raycaster = new THREE.Raycaster();

    var renderer;
	
	var clock = new THREE.Clock();
	var time = 0;
    var duration = 100;
	var keyframes = 4;
	var interpolation = duration / keyframes;
	var currentKeyframe = 0;
	var lastKeyframe = 0;
	var animOffset = 1;
	var radius = 600;
	var theta = 0;
	var effect;
	var prevTime = Date.now();
    
    // custom global variables
    var particleSystem;
	var mirrorSphere, mirrorCamera; // for mirror material
	var baseball,bat,cam_helper,c,plane;
	var dirt = [];
	var stroker;




	var base_url = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/61062/';

var smoke_image = document.getElementById( 'texture_smoke' );
var smoke_texture = new THREE.Texture( smoke_image );
smoke_texture.minFilter = THREE.NearestFilter;
    smoke_texture.needsUpdate = true;

var flare0_image = document.getElementById( 'texture_flare0' );
var textureFlare0 = new THREE.Texture( flare0_image );
    textureFlare0.needsUpdate = true;
textureFlare0.minFilter = THREE.NearestFilter;

var flare2_image = document.getElementById( 'texture_flare2' );
var textureFlare2 = new THREE.Texture( flare2_image );
    textureFlare2.needsUpdate = true;
    textureFlare2.minFilter = THREE.NearestFilter;


var flare3_image = document.getElementById( 'texture_flare3' );
var textureFlare3 = new THREE.Texture( flare3_image );
    textureFlare3.needsUpdate = true;
    textureFlare3.minFilter = THREE.NearestFilter;


var bat_image = document.getElementById( 'texture_bat_diffuse' );
var bat_map_texture = new THREE.Texture( bat_image );
    bat_map_texture.needsUpdate = true;
bat_map_texture.minFilter = THREE.NearestFilter;

var bat_bump_image = document.getElementById( 'texture_bat_bump' );
var bat_spec_texture = new THREE.Texture( bat_bump_image );
    bat_spec_texture.needsUpdate = true;
bat_spec_texture.minFilter = THREE.NearestFilter;
var bat_bump_texture = new THREE.Texture( bat_bump_image );
    bat_bump_texture.needsUpdate = true;
bat_bump_texture.minFilter = THREE.NearestFilter;


var ball_image = document.getElementById( 'texture_ball_diffuse' );
var ball_map_texture = new THREE.Texture( ball_image );
    ball_map_texture.needsUpdate = true;
ball_map_texture.minFilter = THREE.NearestFilter;

var ball_spec_image = document.getElementById( 'texture_ball_spec' );
var ball_spec_texture = new THREE.Texture( ball_spec_image );
    ball_spec_texture.needsUpdate = true;
ball_spec_texture.minFilter = THREE.NearestFilter;

var ball_bump_image = document.getElementById( 'texture_ball_bump' );
var ball_bump_texture = new THREE.Texture( ball_bump_image );
    ball_bump_texture.needsUpdate = true;
ball_bump_texture.minFilter = THREE.NearestFilter;

var dirt_image = document.getElementById( 'texture_dirt_diffuse' );
var dirt_texture = new THREE.Texture( dirt_image );
    dirt_texture.needsUpdate = true;
dirt_texture.minFilter = THREE.NearestFilter;

var bump_texture = new THREE.Texture( dirt_image );
    bump_texture.needsUpdate = true;
bump_texture.minFilter = THREE.NearestFilter;

	var paths = {
		baseball : base_url+'baseball.json',
		bat : base_url+'bat.json'
	}


	var gras;
    var fake_light;
	var å = {
		center : {
			x : 500,
			y : 500
		},
		paused : false,
		state : {
			camera : 'air',
			baseball : 'default',
			bat : 'default'
		},
		scene : {
			current : 'ball_in_air_slow'
		}
	}

	var materialDepth;
	var sunPosition = new THREE.Vector3( 100, 0, -100 );
	var screenSpacePosition = new THREE.Vector3();

	var bgColor = 0x000000;
	var sunColor = 0x222222;
	var orbitRadius = 20;

	var postprocessing = { enabled : true };

    //___________________________________________ HELPER
	function randNum(min,max,bool){

	var num = Math.random()*max + min;
	if(bool || bool === "undefined"){
		num *= Math.floor(Math.random()*2) == 1 ? 1 : -1; 
	}
	return num;
	}
		  //___________________________________________ KICK IT OFF
      init();
      animate();

      //___________________________________________ INIT
      function init() {
      console.log('init')
        container = document.getElementById( 'container' );

        camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, .1, 100000 );
        camera.position.x = 78;
        camera.position.y = -15;
        camera.position.z = 35;
        camera.move_direction = 1;
        camera.posSpeed = 0.02;
        scene = new THREE.Scene();
		//scene.fog = new THREE.FogExp2( 0x000000, 0.015 );

		camera.update = function(time){	
			
			switch(å.scene.current){
				case 'ball_in_air_slow': 

					this.posSpeed =.05;
				
				if(this.position.x >= 95){			
					// BREAK
					this.posSpeed = 0;
					å.scene.current = 'ball_in_air_fast';
				}
				
				this.position.x += this.posSpeed;

				break;
				case 'ball_in_air_fast':
					
					this.position.x = 35;
					this.position.z = 15;
					this.position.y = 20;
				break;
				case 'hit_the_ball':
					this.position.x = 0;
					this.position.y = -5;
					this.position.z = 20;


				break;
				case 'explosion':
					//cam_helper.add(camera);
					this.position = cam_helper.geometry.vertices[10];
				break;
				case 'ball_fly_away':
					//this.position.set(-10,0,0);
					scene.add(camera);
				break;
				default:
				break;
			}
		}
		
        scene.add( camera );

		//___________________________________________ CONTROLS

		
           controls = new THREE.OrbitControls( camera );
           controls.damping = 0.2;
           controls.autoRotate = false;
           controls.addEventListener( 'change', render );
           //controls.maxPolarAngle = Math.PI/2;
           controls.maxDistance = 25;
           camera.lookAt(new THREE.Vector3(0,0,0));
           controls.target =  new THREE.Vector3(0,0,0);

            controls.updater = function(time){
			controls.doller = 0.002;
			controls.direction = -1;
           	switch(å.scene.current){
           		case 'ball_in_air_slow':
           		break;
           	}
           	this.target = baseball.position;
           }


	//___________________________________________ FAKE LIGHT

	var ambient = new THREE.AmbientLight(0x1D4A64);
		scene.add(ambient);

    		
    		//___________________________________________ Light

			light = new THREE.SpotLight( 0xF5A96B, 10,200,Math.PI/2 );
			light.position.set( 0,0,0 ).multiplyScalar( 1 );
			

			light.castShadow = true;

			light.shadowMapWidth = 1024 * 2;
			light.shadowMapHeight = 1024 * 2;
			

			var d = 350;
			light.shadowCameraLeft = -d;
			light.shadowCameraRight = d;
			light.shadowCameraTop = d * 2.8;
			light.shadowCameraBottom = -d;
			light.shadowCameraNear = 0.01;

        //    scene.add( light );

            //___________________________________________ Fake Light

            fake_light = new THREE.SpotLight( 0x45D2EA, 1,200,Math.PI/2 );
			fake_light.position.set( 0,-100,0 ).multiplyScalar( 1 );
			

			fake_light.castShadow = true;

			fake_light.shadowMapWidth = 1024 * 2;
			fake_light.shadowMapHeight = 1024 * 2;
			

			var d = 350;
			fake_light.shadowCameraLeft = -d;
			fake_light.shadowCameraRight = d;
			fake_light.shadowCameraTop = d * 2.8;
			fake_light.shadowCameraBottom = -d;
			fake_light.shadowCameraNear = 0.01;

			camera.add(fake_light);
//            scene.add( fake_light );


    var pointLight = new THREE.PointLight(0xffffff,.1);

		//pointLight.position.set(0,20,50);
		//scene.add(pointLight);

			
		
        // RENDERER

        renderer = new THREE.WebGLRenderer( { antialias: true,transparent:true,alpha: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        container.appendChild( renderer.domElement );
		renderer.autoClear = false;
        //renderer.gammaInput = true;
        //renderer.gammaOutput = true;
		renderer.sortObjects = false;
        renderer.shadowMapEnabled = true;

		//___________________________________________ BASEBALL

		mirrorCamera = new THREE.CubeCamera( 0.1, 5000, 512 );
        mirrorCamera.renderTarget.minFilter = THREE.LinearMipMapLinearFilter;
        scene.add( mirrorCamera );
       
        var loader = new THREE.JSONLoader();

        
        //___________________________________________ Lens Flare

		// THANKs to threejs for more info:
		// http://threejs.org/examples/webgl_lensflares.html

		
		addLight( 0.08, 0.8, 0.5,    0, 0, -1000 );
		//addLight( 0.995, 0.5, 0.9, 5000, 5000, -1000 );

		function addLight( h, s, l, x, y, z ) {

			var light = new THREE.PointLight( 0xffffff, 1.5, 4500 );
			light.color.setHSL( h, s, l );
			light.position.set( x, y, z );
			scene.add( light );

			var flareColor = new THREE.Color( 0xffffff );
			flareColor.setHSL( h, s, l + 0.5 );

			var lensFlare = new THREE.LensFlare( textureFlare0, 270, 0.0, THREE.AdditiveBlending, flareColor );

			lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
			lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
			lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );

			lensFlare.customUpdateCallback = lensFlareUpdateCallback;
			lensFlare.position.copy( light.position );

			scene.add( lensFlare );

		}

		function lensFlareUpdateCallback( object ) {

				var f, fl = object.lensFlares.length;
				var flare;
				var vecX = -object.positionScreen.x * 2;
				var vecY = -object.positionScreen.y * 2;


				for( f = 0; f < fl; f++ ) {

					   flare = object.lensFlares[ f ];

					   flare.x = object.positionScreen.x + vecX * flare.distance;
					   flare.y = object.positionScreen.y + vecY * flare.distance;

					   flare.rotation = 0;

				}

				object.lensFlares[ 2 ].y += 0.025;
				object.lensFlares[ 3 ].rotation = object.positionScreen.x * 0.5 + THREE.Math.degToRad( 45 );

			}
		//___________________________________________ BALL

			ball_bump_texture.repeat.set( 1, 1 );

		//___________________________________________ Plane

		

			function randNum(min,max,bool){
				var num = Math.random()*max + min;
				if(bool || bool == "undefined"){
					num *= Math.floor(Math.random()*2) == 1 ? 1 : -1; 
				}
				return num;
			}
   
		//___________________________________________

        loader.load(paths.baseball,function(geometry){
		var ball_m = new THREE.MeshPhongMaterial({
        	color : 0xffffff,
        	morphTargets : true,
        	map: ball_map_texture,
        	shininess: 15,
        	envMap: mirrorCamera.renderTarget,
        	specularMap : ball_spec_texture,
        	bumpMap: ball_bump_texture, 
			bumpScale: .005  
        })
          baseball = new THREE.SkinnedMesh(geometry,ball_m);
		  baseball.position.x = 80;
		  baseball.position.y = -0.4;
		  baseball.posSpeed = 0.005;
		  baseball.rotSpeed = 0.003;
		  baseball.direction = -1;
		  baseball.fallSpeed = .0218;
			
		  //baseball.rotation.x = 125*Math.PI/180
		  baseball.rotation.x = 125*Math.PI/180;
		  baseball.morphDirection = 0;
		  animation = new THREE.MorphAnimation(baseball);

		  //baseball.add(featurePlane);
		  
          baseball.update = function(time){

          	switch(å.scene.current){
          		case 'ball_in_air_slow':
                this.morphTargetInfluences[1] = 0;
					this.rotSpeed = -0.003;
					this.rotation.x += this.rotSpeed * 2;
					this.rotation.y += this.rotSpeed;
					this.rotation.z += this.rotSpeed;
          		break;
          		case 'ball_in_air_fast':
          			if(this.position.y >= 0){
						this.position.y -= this.fallSpeed;
					}
					
          			if(this.position.x <= 1.05){
						å.state.baseball = 'airtime';
						this.posSpeed = 0;
						this.rotSpeed = 0;
					}

					if(this.posSpeed <= 0.5){
						this.posSpeed += 0.01;
					}
					this.position.x += this.posSpeed * this.direction;

					if(this.position.x <= 15 && this.position.x > 1){
						å.scene.current = 'hit_the_ball';
					}
	
          		break;
          		case 'hit_the_ball':
          			this.position.x -= 0.1;
          			if(this.position.x<1){
						å.scene.current = 'explosion';
					}
          		break;
          		case 'explosion':
					this.position.x += 0.005;
					//if(this.position.x <= 0.95 && this.position.x > 0.70){
					//	
					//}
					if(this.morphDirection <= 1){						
						this.morphDirection += .002;						
					}
					baseball.morphTargetInfluences[1] = this.morphDirection;
          		break;
          		case 'ball_fly_away':
          			if(this.posSpeed < 0.05){
          				this.posSpeed += 0.01;
          			}
          			if(baseball.morphTargetInfluences[1]>0){
      					 baseball.morphTargetInfluences[1]  = this.morphDirection;
          			}
          			
					this.position.x += this.posSpeed;
					this.position.y += this.posSpeed;

					if(this.position.x >100){
						reset();
					}
					
          		break;
          	}
          		
          }

          scene.add(baseball);
        });
		
		

		//___________________________________________ BAT
		var bat_m = new THREE.MeshPhongMaterial({
		  color: 0xffffff, 
		  specular: 0xFFFBE6, 
		  shininess: 50,
		  reflectivity:15, 
		  map: bat_map_texture,
		  specularMap : bat_spec_texture,
		});

        loader.load(paths.bat,function(geometry,material){
          bat = new THREE.Mesh(geometry,bat_m);
          bat.rotation.x = 120 * Math.PI/ 180;
          bat.rotation.z = 80 * Math.PI/ 180;
          bat.position.z = -18;
          bat.position.y = 10;
          bat.rotSpeed = 0;
			
          bat.update = function(time){    
			switch(å.scene.current){
				case 'ball_in_air_fast':
					this.rotSpeed = 0;
				break;
				case 'hit_the_ball':
					this.rotSpeed = .01;
					if(this.rotation.z<= .033){
						å.state.baseball = 'airtime';

							this.rotSpeed = 0;
							this.rotation.z = 0.033;
					}

				break;
				case 'explosion':
					this.rotSpeed = 0.0001;
				break;
          		case 'ball_fly_away':
					this.rotSpeed = 0.01;
					if(this.rotation.z<= -2.8){
						this.rotSpeed = 0;
					}
          		break;
          	}
          	this.rotation.z -= this.rotSpeed;
          }
          scene.add(bat);
        });

		//___________________________________________  Particles

		var dirt_geometry;
			dirt_texture.minFilter = THREE.LinearFilter;
        	bump_texture.minFilter = THREE.LinearFilter;
		var dirt_material = new THREE.MeshPhongMaterial({
			shininess : 1,
			color : 0x793216,
			map: dirt_texture,
			bumpMap : bump_texture,
			bumpScale: .00005
		});
		var dirt_p = new THREE.Mesh(dirt_geometry,dirt_material);
		dirt = [];
		for(var p =0;p<260;p++){
			dirt_geometry = new THREE.BoxGeometry(.15,.15,.15);
			for(var v=0;v<dirt_geometry.vertices.length;v++){
				dirt_geometry.vertices[v].x += randNum(0,2.0,true);
				dirt_geometry.vertices[v].y += randNum(0,1.0,true);
				dirt_geometry.vertices[v].z += randNum(0,1.0,true);
			}
		
			dirt[p] = new THREE.Mesh(dirt_geometry,dirt_material);
			dirt[p].speedPos = randNum(0,2.2) * .1;

			dirt[p].position.x = 80 + Math.sin(p) * randNum(0,10);
			dirt[p].position.y = 0 + Math.cos(p) *  randNum(0,5,true);
			dirt[p].position.z = 0 + Math.sin(p) *  randNum(0,5,true)+ randNum(0,p * 0.1,true);


			dirt[p].rotSpeed = randNum(0,0.005,true);
			dirt[p].posSpeed = randNum(0,0.05,true);
			dirt[p].fallSpeed = .0018;
			var individual_scale = .1;
			dirt[p].scale.set(individual_scale,individual_scale,individual_scale);

			dirt[p].update = function(time){
				

				if(å.state.baseball == 'airtime'){
					this.posSpeed = 0;
					this.rotSpeed = 0;
					this.fallSpeed = 0;
				}
				this.position.x -= this.posSpeed;

				if(this.position.y >= Math.cos(p) *  randNum(0,15,true)){
					this.position.y -= this.fallSpeed;
				}

				if(å.state.baseball == 'default'){
					this.rotation.x += this.rotSpeed;
					this.rotation.y += this.rotSpeed;
					this.rotation.z += this.rotSpeed * 2;
				}
				

			}
			scene.add(dirt[p]);
		}//end of dirt

		//___________________________________________ Particles
		var particles = new THREE.Geometry();
			particles.random = [];
			particles.radius = 2;
		var particle_texture =  smoke_texture
		var pMaterial = new THREE.PointCloudMaterial({
			  color: 0xffffff,
			  size: 1,
			  transparent:true,
			  opacity:.1,
			  blending: THREE.AdditiveBlending,
			  sizeAttenuation : true,
			  depthTest: true,
			  depthWrite: true,
			  alphaTest: 0.06,
			  map : particle_texture,
			  vertexColors:true
			});


		for(var i=0;i<500;i++){
		  var x = 1+Math.sin(i) * randNum(0,0.75,true);
		  var y = Math.cos(i) * randNum(0,0.75,true);
		  var z = Math.sin(i) * randNum(0,0.75,true);
		  particles.vertices.push(new THREE.Vector3(x,y,z));
		  var color_fac = randNum(0,200,false);
		  particles.colors.push(new THREE.Color(color_fac,color_fac,color_fac));
		  particles.random.push({
		  	x : randNum(0,0.0001,true),
		  	y : randNum(0,0.002,true),
		  	z : randNum(0,0.002,true),
		  	fac : 1
		  });

		}

		particleSystem = new THREE.PointCloud(particles,pMaterial);
		particleSystem.visible = false;

		particleSystem.update = function(time){
			var that = this;
			if(å.scene.current == "explosion"){
				this.visible = true;
			this.geometry.vertices.forEach(function(p,index){
				p.x += particles.random[index].x * particles.random[index].fac;
				p.y += particles.random[index].y * particles.random[index].fac;
				p.z += particles.random[index].z * particles.random[index].fac;

				if(Math.abs(p.x) >= particles.radius||
					Math.abs(p.y) >= particles.radius||
					Math.abs(p.z) >= particles.radius){

						p.x = -100000;
						p.y = -100000;
				}
			});

			this.geometry.verticesNeedUpdate = true;
			}

		}

		scene.add(particleSystem);

		//___________________________________________ Camera HELPER


		var cam_helper_radius = 20;
		var cam_helper_segments = 32;

		var cam_helper_geometry = new THREE.CircleGeometry(cam_helper_radius,cam_helper_segments,Math.PI/2);
		cam_helper = new THREE.Mesh(cam_helper_geometry);
		cam_helper.rotSpeed = 0;
		cam_helper.direction = 1;
		cam_helper.visible = false;
			cam_helper.update = function(time){
				switch (å.scene.current){
					case 'explosion':
						if(this.rotSpeed >= 0.0255 && this.direction > 0){
							this.direction *=  (-1);
						}
						this.rotSpeed += 0.0001 * this.direction;
						if(this.rotSpeed <=0.005 && this.direction <0){
							this.rotSpeed = 0;

							å.scene.current = 'ball_fly_away';
						}
						this.rotation.y -= this.rotSpeed;
						this.position.y -= 0.001;
					break;
				}
			}
		scene.add(cam_helper);


	//___________________________________________ Strokes

		
		function reset(){
			å.scene.current = 'ball_in_air_slow';

			å.state.camera = 'air';
			å.state.baseball = 'default';
			å.state.bat = 'default';

			camera.position.x = 83;
			camera.position.y = -.4;
			camera.position.z = 5;
			camera.move_direction = 1;
			camera.posSpeed = 0.005;

			// CAMHelper
			cam_helper.rotSpeed = 0;
			cam_helper.direction = 1;

			particleSystem.visible = false;

			//BAseball
			  
			  baseball.position.x = 80;
			  baseball.position.y = -0.4;
			  baseball.posSpeed = 0.01;
			  baseball.rotSpeed = 0.003;
			  baseball.direction = -1;
			  baseball.fallSpeed = .0218;

			  //baseball.rotation.x = 125*Math.PI/180
			  baseball.rotation.x = 125*Math.PI/180;
			  baseball.morphDirection = 0;

			  //BAT

			  bat.rotation.x = 120 * Math.PI/ 180;
			  bat.rotation.z = 80 * Math.PI/ 180;
			  bat.position.z = -18;
			  bat.position.y = 10;
			  bat.rotSpeed = 0;

			particleSystem.geometry.vertices.forEach(function(p,index){
				  var x = 1+Math.sin(index) * randNum(0,0.75,true);
				  var y = Math.cos(index) * randNum(0,0.75,true);
				  var z = Math.sin(index) * randNum(0,0.75,true);
				  particles.vertices[index] = new THREE.Vector3(x,y,z);
				  var color_fac = randNum(0,200,false);
				  particles.colors.push(new THREE.Color(color_fac,color_fac,color_fac));
				  particles.random.push({
					x : randNum(0,0.0001,true),
					y : randNum(0,0.002,true),
					z : randNum(0,0.002,true),
					fac : 1
				  });

			});

			dirt.forEach(function(p,index){
				p.position.x = 80 + Math.sin(index) * randNum(0,10);
				p.position.y = 0 + Math.cos(index) *  randNum(0,5,true);
				p.position.z = 0 + Math.sin(index) *  randNum(0,5,true)+ randNum(0,index * 0.1,true);
			})
		}


	
		initPostprocessing();


      }// end of init


function initPostprocessing() {
	var renderPass = new THREE.RenderPass( scene, camera );

	var bokehPass = new THREE.BokehPass( scene, camera, {
		focus: 		1.8,
		aperture:	0.005,
		maxblur:	1.0,
		width: window.innerWidth,
		height: window.innerHeight
	} );

	bokehPass.renderToScreen = true;

	composer = new THREE.EffectComposer( renderer );

	composer.addPass( renderPass );
	composer.addPass( bokehPass );

	postprocessing.composer = composer;
	postprocessing.bokeh = bokehPass;

}

//___________________________________________	
window.addEventListener( 'resize', onWindowResize, false );
//___________________________________________ click

function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        //renderer.setSize( window.innerWidth, window.innerHeight );
		composer.renderer.setSize( window.innerWidth, window.innerHeight );
}


//___________________________________________ RENDER 


function animate() {

  requestAnimationFrame( animate );
  var delta = clock.getDelta();
  controls.update(delta);
  render();

}

function render(time) {
	postprocessing.composer.render(time );
	if(typeof baseball !== "undefined"){
	camera.update(time);
	 controls.updater(time);
	
	if(!å.paused){
	  baseball.update(time);
	//Bat
	  bat.update(time);
	//DIRT
	  dirt.forEach(function(el,index){
  	   	el.update(time);
  	   });
  	 //Dust  
	 particleSystem.update(time);

	//Cam Driver
	 cam_helper.update(time);

	 }  	   
  	}  	 
}