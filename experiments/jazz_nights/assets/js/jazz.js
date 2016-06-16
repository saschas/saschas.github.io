
    var container;

    var camera, scene,controls;
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
	var prevTime = Date.now();
	var piano_animation,drum_animation,trumpet_animation,saxo_animation,kontrabass_animation;


	var lamp_light,light,fake_light,rim_light,back_light;

    var video, videoImage, videoImageContext, videoTexture,topTexture;
	var c;
    var mouseX = 0, mouseY = 0;	
    
	var trumpet_helper,
		piano_helper,
		saxo_helper,
		drum_helper,
		kontrabass_helper;

   
	var trumpet_camera,
		piano_camera,
		saxo_camera,
		drum_camera,
		kontrabass_camera;

	var audio_canvas_visualizer,audio_canvas_visualizer_top;
	var analyser,frequencyData;

	var renderTarget,kontrabass_camera,trumpet_camera;
	var scene_renderTarget;
    var mesh,circle,controller_animation, helper;	
	var morph_logic;
	
	var master_ground;

var texture_man = document.getElementById('texture_man');
var texture_stage = document.getElementById('texture_stage');
var texture_piano = document.getElementById('texture_piano');
var texture_drum = document.getElementById('texture_drum');
var texture_trumpet = document.getElementById('texture_trumpet');
var texture_kontrabass = document.getElementById('texture_kontrabass');
var texture_saxo =texture_trumpet;



	var url_base = "assets/model/export_mesh/jazz/";
	var tv_screen,tv_context;
    var å = {
      animate : false,
      play : false,
    	ready : {
    		count:0
    	},
    	mouse : {
    		x : 0,
    		y : 0,
    		z : 0.5
    	},
      touch:Modernizr.touch,
      complete:{
        percentage : 0,
        texture : false,
        models : false,
        audio : false
      },
    	models :{
    		stage : url_base+"stage.json",
    		piano : url_base+"piano.json",
			man_piano:url_base+"man_piano.json",
			man_drum:url_base+"man_drum.json",
			man_trumpet:url_base+"man_trumpet.json",
			man_kontrabass:url_base+"man_kontrabass.json",
			man_saxo:url_base+"man_saxo.json",
    	},
    	loaded:{
    		stage:{geometry:null,material:null},
    		piano:{geometry:null,material:null},
    		man_piano:{geometry:null,material:null},
    		man_drum:{geometry:null,material:null},
    		man_trumpet:{geometry:null,material:null},
    		man_kontrabass:{geometry:null,material:null},
    		man_saxo:{geometry:null,material:null},
    	},
    	texture:{
    		man :new THREE.Texture(texture_man),
    		stage : new THREE.Texture(texture_stage),
    		piano : new THREE.Texture(texture_piano),
    		drum : new THREE.Texture(texture_drum),
    		kontrabass : new THREE.Texture(texture_kontrabass),
    		trumpet : new THREE.Texture(texture_trumpet),
        saxo : new THREE.Texture(texture_saxo)
    	},
    	targetList : [],
    	light :{
    		piano : {
    			intensity : 2,
    			color : new THREE.Color(0xffffff)
    		},
    		drum : {
    			intensity : 2,
    			color : new THREE.Color(0xffffff)
    		},
    		kontrabass : {
    			intensity : 2,
    			color : new THREE.Color(0xffffff)
    		},
    		trumpet : {
    			intensity : 2,
    			color : new THREE.Color(0xffffff)
    		}
    	},
    	active_camera : 'piano_camera',
    	timestamps : [
			{time:0   , type: 'piano'},
			{time:7   , type: 'drum'},
			{time:13  , type: 'piano'},
			{time:23  , type: 'kontrabass'},
			{time:33  , type: 'piano'},
			{time:42  , type: 'trumpet'},
			{time:50  , type: 'piano '},
			{time:80 , type: 'drum'},
			{time:90, type: 'trumpet'},
			{time:118, type: 'drum'},
			{time:124, type: 'piano'},
			{time:140, type: 'drum'},
			{time:145, type: 'piano'},
			{time:160, type: 'trumpet'},
			{time:174, type: 'piano'},
			{time:195, type: 'trumpet'},
			{time:200, type: 'drum'},
			{time:215, type: 'trumpet'},
			{time:240, type: 'kontrabass'},
			{time:250, type: 'trumpet'},
			{time:266, type: 'drum'},
			{time:280, type: 'piano'},
			{time:290, type: 'kontrabass'},
			{time:305, type: 'trumpet'},
			{time:325, type: 'piano'},
			{time:340, type: 'trumppet'},
			{time:360, type: 'drum'},
			{time:370, type: 'trumpet'},
			{time:390, type: 'piano'},
			{time:401, type: 'drum'},
			{time:420, type: 'piano'},
			{time:440 , type: 'trumpet'},
			{time:450, type: 'drum'},
			{time:470, type: 'drum'},
			{time:485 , type: 'piano'},
			{time:490, type: 'trumpet'},
			{time:495, type: 'stop'}	
		]
}
    
    


var body_el = document.getElementsByTagName('body');
var load_holder = document.getElementById('loader');
var loading_icon = document.getElementById('loader_bar');
var loading_audio_icon = document.getElementById('loader_audio_bar');

var play_button = document.getElementById('play_button');

play_button.addEventListener('click',function(){
  if(this.hasClass('ready_to_play')){
   // å.animate = true;
    jazz_song.play();
    jazz_song.pause();
    
    jazz_song.onprogress = function(){
      var loadedPercentage = this.buffered.end(0) / this.duration;
      load_audio_indication(loadedPercentage * 100)
    }
    jazz_song.oncanplaythrough = function(){
      å.animate = true;
      jazz_song.play();
    
    for (t in å.texture) {
      å.texture[t].needsUpdate = true;
    }
    load_holder.setAttribute('class','playing');
    }
  }
});
    
function load_indication(percentage){
  loading_icon.style.width = percentage * 100 / 14 + '%';
  
  if((percentage * 100 / 14)==100){
    load_complete();
  }  
}

function load_audio_indication(percentage){
  loading_audio_icon.style.width = percentage * 100 / 100 + '%';
}

function load_complete(){
   load_holder.className = 'complete';
   play_button.className = 'ready_to_play';  
  å.complete.audio = true;
}



//___________________________________________
    
var imgLoad = imagesLoaded('#texture_holder');
imgLoad.on( 'always', function() {
  
  // detect which image is broken
  for ( var i = 0, len = imgLoad.images.length; i < len; i++ ) {
    var image = imgLoad.images[i];
    var result = image.isLoaded ? 'loaded' : 'broken';
    å.complete.percentage++;    
  }
});
imgLoad.on( 'done', function( instance ) {
  for (t in å.texture) {
      //å.texture[t].crossOrigin = "Anonymous";
      å.texture[t].minFilter = THREE.NearestFilter;
      å.texture[t].needsUpdate = true;
    }
  å.complete.texture = true;
});
//

start_scene();
init();
animate();

var manager = new THREE.LoadingManager();
manager.onProgress = function ( item, loaded, total ) {
	å.complete.percentage++;
	if(loaded == total){
    å.complete.models =true;
	}
};


var loader = new THREE.JSONLoader(manager);

for(asset in å.models){

	loader.load(å.models[asset],function(geometry,material){
		var name;
		switch(geometry.vertices.length){
			case 232:
				name = "stage";
				init_stage(geometry);
			break;
			case 224:
				name ="piano";
				init_piano(geometry);
			break;
			case 1658:
				name = "man_trumpet";
				init_man_trumpet(geometry);
			break;
			case 1782:
				name = "man_saxo";
				init_man_saxo(geometry);
			break;
			case 2068:
				name = "man_drum";
       			init_man_drum(geometry);
			break;
			case 1299:
				name ="man_kontrabass";
				init_man_kontrabass(geometry);
			break;
			case 1378:
				name ="man_piano";
				init_man_piano(geometry);
			break;
		}
		å.loaded[name].geometry = geometry;
		å.loaded[name].material = material;

	});

}

//___________________________________________

function getRandomColor() {
    var letters = '0123433333000ccc'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
}

function randomNumber(min, max, bool) {

  var num = Math.floor(Math.random() * max) + min; // this will get a number between 1 and 99;
  if (bool || typeof bool == "undefined") {
    num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
  }
  return num;
}
function get_intensity(n){
	return 100 * n / 255;
}

function clamp(num,min,max){
	if(num<min){
		num = min;
	}
	if(num > max){
		num = max;
	}

	return num;
}
Element.prototype.hasClass = function(className) {
    return this.className && new RegExp("(^|\\s)" + className + "(\\s|$)").test(this.className);
};
//___________________________________________

 //__________________________________ LOAD MODEL

       	
		
		function init_stage( geometry ) {
			renderTarget = new THREE.WebGLRenderTarget( 512, 512, { 
				format: THREE.RGBFormat 
			});
			
			// MAIN STAGE TEXTURE
			videoTexture = new THREE.Texture( audio_canvas_visualizer );
			videoTexture.crossOrigin = "Anonymous";
			videoTexture.minFilter = THREE.LinearFilter;
			videoTexture.magFilter = THREE.LinearFilter;

			videoTexture.wrapS = videoTexture.wrapT = THREE.ClampToEdgeWrapping;
			
			// TOP MAIN STAGE TEXTURE
			topTexture = new THREE.Texture( audio_canvas_visualizer_top );
			topTexture.crossOrigin = "Anonymous";
			topTexture.minFilter = THREE.LinearFilter;
			topTexture.magFilter = THREE.LinearFilter;

			topTexture.wrapS = topTexture.wrapT = THREE.ClampToEdgeWrapping;
 
		
			//flip texture
			renderTarget.wrapS = renderTarget.wrapT = THREE.RepeatWrapping;
			renderTarget.repeat.y = - 1;
			renderTarget.repeat.x = - 1;

			var stage_base = new THREE.MeshLambertMaterial({ 
				color : 0xffffff,
				side: THREE.DoubleSide,
				map: videoTexture,
				overdraw: true,
			});
			var screen_mat = new THREE.MeshBasicMaterial({ 
				color : 0xffffff,
				//emissive : 0xffffff,
				side: THREE.DoubleSide,
				map: renderTarget 
			});
			var top_mat = new THREE.MeshLambertMaterial({ 
				color : 0xffffff,
				side: THREE.DoubleSide,
				map: topTexture,
				overdraw:true 
			});

			var stage_material = new THREE.MeshFaceMaterial([
				stage_base,
				screen_mat,
				top_mat
			])
			stage = new THREE.Mesh( geometry,stage_material);

			//stage.scale.set( 20,20,20 );

			stage.receiveShadow = true;
			stage.castShadow = true;
			scene.add( stage );
		
		}

		function init_piano( geometry ) {

			piano = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({ 
				
				//shading: THREE.FlatShading,
				side: THREE.DoubleSide,
				map: å.texture.piano,
				shininess : 500
			}));

			//piano.scale.set( 20,20,20 );

			piano.receiveShadow = true;
			piano.castShadow = true;
			scene.add( piano );
		
		}
		
		
		//___________________________________________ PianoMan


		function init_man_piano( geometry ) {

        man_piano = new THREE.SkinnedMesh( geometry, new THREE.MeshPhongMaterial({				
        //shading: THREE.FlatShading,
        side: THREE.DoubleSide,
        map: å.texture.man,
        bumpMap :å.texture.man,
        shininess : 0,
        skinning : true
    }));

			//piano.scale.set( 20,20,20 );

			man_piano.receiveShadow = true;
			man_piano.castShadow = true;

				piano_animation = new THREE.Animation( man_piano, geometry.animation );
                piano_animation.play();
                piano_animation.loop = true;
                piano_animation.timeScale = 200;

				piano_helper = new THREE.SkeletonHelper( man_piano );
				piano_helper.material.linewidth = 1;
				piano_helper.visible = false;
				scene.add( piano_helper );
				scene.add( man_piano );

			}


		//___________________________________________ DrumMan


		function init_man_drum( geometry ) {
      var player_material = new THREE.MeshPhongMaterial({				
          //shading: THREE.FlatShading,
          side: THREE.DoubleSide,
          map: å.texture.man,
          bumpMap :å.texture.man,
          shininess : 0,
          skinning : true
      });
			var drum_mat = new THREE.MeshPhongMaterial({ 
				
				//shading: THREE.FlatShading,
				side: THREE.DoubleSide,
				map: å.texture.drum,
				//bumpMap : drum_texture,
				shininess : 0,
				skinning : true
			});

			var mat = new THREE.MeshFaceMaterial([
				player_material,
				drum_mat
			])

			man_drum = new THREE.SkinnedMesh( geometry,mat);

			//piano.scale.set( 20,20,20 );

			man_drum.receiveShadow = true;
			man_drum.castShadow = true;


			drum_animation = new THREE.Animation( man_drum, geometry.animation );
            drum_animation.play();
            drum_animation.loop = true;
            drum_animation.timeScale = 200;

			drum_helper = new THREE.SkeletonHelper( man_drum );
			drum_helper.material.linewidth = 1;
			drum_helper.visible = false;
			scene.add( drum_helper );

			scene.add( man_drum );
		
		}

		//___________________________________________ kontrabassMan


		function init_man_kontrabass( geometry ) {
      var player_material = new THREE.MeshPhongMaterial({				
      //shading: THREE.FlatShading,
      side: THREE.DoubleSide,
      map: å.texture.man,
      bumpMap :å.texture.man,
      shininess : 0,
      skinning : true
  });
			
			var kontrabass_mat = new THREE.MeshPhongMaterial({ 
				
				//shading: THREE.FlatShading,
				side: THREE.DoubleSide,
				map: å.texture.kontrabass,
				skinning : true
			});
			var man_material= new THREE.MeshFaceMaterial([
				player_material,
				kontrabass_mat
			]);

			man_kontrabass = new THREE.SkinnedMesh( geometry,man_material );

			man_kontrabass.position.set( -4,0,-8 );

			man_kontrabass.receiveShadow = true;
			man_kontrabass.castShadow = true;

			kontrabass_animation = new THREE.Animation( man_kontrabass, geometry.animation );
            kontrabass_animation.play();
            kontrabass_animation.loop = true;
            kontrabass_animation.timeScale = 150;

			kontrabass_helper = new THREE.SkeletonHelper( man_kontrabass );
			kontrabass_helper.material.linewidth = 1;
			kontrabass_helper.visible = false;
			scene.add( kontrabass_helper );
			scene.add( man_kontrabass );
		
		}


		//___________________________________________ TRUMPETMan


		function init_man_trumpet( geometry ) {
			
			var player_material = new THREE.MeshPhongMaterial({				
      //shading: THREE.FlatShading,
      side: THREE.DoubleSide,
      map: å.texture.man,
      bumpMap :å.texture.man,
      shininess : 0,
      skinning : true
  });

			var trumpet_mat = new THREE.MeshPhongMaterial({ 
				
				//shading: THREE.FlatShading,
				side: THREE.DoubleSide,
				map: å.texture.saxo,
				skinning:true
			});

			var man_material = new THREE.MeshFaceMaterial([
				player_material,
				trumpet_mat
			])
			man_trumpet = new THREE.SkinnedMesh( geometry, man_material);

			//piano.scale.set( 20,20,20 );

			man_trumpet.receiveShadow = true;
			man_trumpet.castShadow = true;

			trumpet_animation = new THREE.Animation( man_trumpet, geometry.animation );
            trumpet_animation.play();
            trumpet_animation.loop = true;
            trumpet_animation.timeScale = 100;

			trumpet_helper = new THREE.SkeletonHelper( man_trumpet );
			trumpet_helper.material.linewidth = 1;
			trumpet_helper.visible = false;
			scene.add( trumpet_helper );

			scene.add( man_trumpet );
		
		}

		//___________________________________________ TRUMPETMan


		function init_man_saxo( geometry ) {
			var player_material = new THREE.MeshPhongMaterial({				
      //shading: THREE.FlatShading,
      side: THREE.DoubleSide,
      map: å.texture.man,
      bumpMap :å.texture.man,
      shininess : 0,
      skinning : true
  });
			var saxo_mat = new THREE.MeshPhongMaterial({ 
				
				side: THREE.DoubleSide,
				map: å.texture.trumpet,
				skinning:true
			})
			var man_material = new THREE.MeshFaceMaterial([
				player_material,
				saxo_mat
			]);
			man_saxo = new THREE.SkinnedMesh( geometry, man_material);

			//piano.scale.set( 20,20,20 );

			man_saxo.receiveShadow = true;
			man_saxo.castShadow = true;

			saxo_animation = new THREE.Animation( man_saxo, geometry.animation );
            saxo_animation.play();
            saxo_animation.loop = true;
            saxo_animation.timeScale = 100;

			saxo_helper = new THREE.SkeletonHelper( man_saxo );
			saxo_helper.material.linewidth = 1;
			saxo_helper.visible = false;
			scene.add( saxo_helper );
			scene.add( man_saxo );
		
		}


	  //___________________________________________ KICK IT OFF
      
      function start_scene(){
      	container = document.getElementById( 'container' );
      	// _____________________ Renderer

        renderer = new THREE.WebGLRenderer( { antialias: true,transparent:true,alpha: true  });
        //renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        container.appendChild( renderer.domElement );
        //renderer.shadowMap.enabled = true;

      	//_____________________ Main Scene
        scene = new THREE.Scene();
        scene_renderTarget = new THREE.Scene();
		//scene.fog = new THREE.FogExp2( 0x542437, 0.008 );

		//_____________________ Camera
        camera = new THREE.PerspectiveCamera( 85, window.innerWidth / window.innerHeight, .1, 10000 );
        camera.position.x = 99;
        camera.position.y = 40;
        camera.position.z = -16;
        scene.add( camera );

       // init();
      }

      //___________________________________________ INIT
      function init() {
		

		//___________________________________________ AUDIO
			var audio_context;
			if (typeof AudioContext !== "undefined") {
			  audio_context = new AudioContext();
			} else if (typeof webkitAudioContext !== "undefined") {
			  audio_context = new webkitAudioContext();
			} else {
			  //return;
			}

		  var jazz_song = document.getElementById('jazz_song');
		  
      jazz_song.onprogress = function() {
        var loadedPercentage = this.buffered.end(0) / this.duration;
       // load_audio_indication(loadedPercentage);
        if(loadedPercentage == 1){
          å.complete.audio = true;
        }
      };
		  var audioSrc = audio_context.createMediaElementSource(jazz_song);
		  	  analyser = audio_context.createAnalyser();
		  	  analyser.fftSize = 32;
		  	audioSrc.connect(analyser);
  			analyser.connect(audio_context.destination);
		  	frequencyData = new Uint8Array(analyser.frequencyBinCount);

		 // jazz_song.start();

		//Main STAGE TEXTURE
		 	audio_canvas_visualizer = document.createElement('canvas');
            audio_canvas_visualizer.setAttribute('class','texture_canvas');
		 	 audio_canvas_visualizer.width = 300;
			 audio_canvas_visualizer.height = 300;			

		 document.body.appendChild(audio_canvas_visualizer);
	

		//___________________________________________ First Canvas Texture - videoTexture
		c = audio_canvas_visualizer.getContext('2d');
		c.fillStyle =  '#ff0000';
		 c.fillRect(0,0,600,600);
		var points =[];
		 for(var p = 0;p<32;p++){
		 	points.push({
		 		x :randomNumber(0,300,false),
		 		y : randomNumber(0,300,false)
		 	});
		 }

		 c.update = function(time){
		 	this.clearRect(0,0,300,300);
		 	this.fillStyle =  '#000000';
		 	this.fillRect(0,0,300,300);

			this.fillStyle =  '#C02942';

			for(f = 0;f<frequencyData.length;f++){
				this.fillRect((600 / frequencyData.length) * f,0,600 / frequencyData.length ,frequencyData[f]);
			
				  this.beginPath();
				  this.arc(points[f].x,points[f].y, frequencyData[f] * .5, 0, 2 * Math.PI, false);
				  
				  this.lineWidth = 6;
				  this.fillStyle = '#542437';
				  this.fill();

				  this.strokeStyle = '#C02942';
				  this.stroke();
			}
		 	
		 }
		
		// ___________________________________________ Second Texture Canvas - topTexture
		 	audio_canvas_visualizer_top = document.createElement('canvas');
		 	 audio_canvas_visualizer_top.width = 200;
			 audio_canvas_visualizer_top.height = 200;
        audio_canvas_visualizer_top.setAttribute('class','texture_canvas');
		 document.body.appendChild(audio_canvas_visualizer_top);

		c_top = audio_canvas_visualizer_top.getContext('2d');
		c_top.fillStyle =  '#542437';

		 c_top.update = function(time){
			this.clearRect(0,0,200,200);
			for(var f = 0; f< frequencyData.length;f++){
		 	  this.beginPath();
			  this.arc(100,100, frequencyData[f] * .5, 0, 2 * Math.PI, false);
			  //this.fillStyle = '#E73A3E';
			  this.fill();
			  this.lineWidth = 5;
			  this.strokeStyle = '#F79D60';
			  this.stroke();
		 	}
		}
		 
      	//___________________________________________ Main Scene
      	
		//_____________________ KontrabassCamera
		kontrabass_camera = new THREE.PerspectiveCamera( 55, 700 / 300, .1, 10000 );
        kontrabass_camera.position.x = 30;
        kontrabass_camera.position.y = 15;
        kontrabass_camera.position.z = -30;
        
        kontrabass_camera.lookAt(new THREE.Vector3(22,7,-14));
        scene.add( kontrabass_camera );

		//_____________________TrumpetCamera
        trumpet_camera = new THREE.PerspectiveCamera( 35, 700 / 300, .1, 10000 );
        trumpet_camera.position.x = 40;
        trumpet_camera.position.y = 25;
        trumpet_camera.position.z = 20;
        
        trumpet_camera.lookAt(new THREE.Vector3(20,20,14));
        scene.add( trumpet_camera );

		//_____________________pianoCamera
        piano_camera = new THREE.PerspectiveCamera( 55, 700 / 300, .1, 10000 );
        piano_camera.position.x = 12;
        piano_camera.position.y = 25;
        piano_camera.position.z = -20;
        
        piano_camera.lookAt(new THREE.Vector3(0,18,-24));
        scene.add( piano_camera );

        //_____________________drumCamera
        drum_camera = new THREE.PerspectiveCamera( 55, 700 / 300, .1, 10000 );
        drum_camera.position.x = 12;
        drum_camera.position.y = 25;
        drum_camera.position.z = 0;
        
        drum_camera.lookAt(new THREE.Vector3(0,18,0));
        scene.add( drum_camera );

		//___________________________________________ CONTROLS
        controls = new THREE.OrbitControls( camera );
        controls.damping = 0.2;
        controls.addEventListener( 'change', render );
        controls.maxPolarAngle = Math.PI/2;
        controls.maxDistance = 110;
        
          
         //___________________________________________ LIGHTs 

		var ambient = new THREE.AmbientLight(0xffffff,1);
		///scene.add(ambient);

		//_____________________ PointLight
		var pointLight = new THREE.PointLight(0xffffff,2, 250);			
			scene.add(pointLight);

		//_____________________RIM LIGHT
			rim_light = new THREE.SpotLight( 0x542437, 10,150,Math.PI/2 );
			rim_light.position.set( 70, 50,-20 ).multiplyScalar( 1 );
			
			rim_light.castShadow = true;

			rim_light.shadowMapWidth = 1024 / 5 ;
			rim_light.shadowMapHeight = 1024 / 5 ;
			rim_light.exponent = .5;

			var d = 35;
		
			rim_light.shadowCameraLeft = -d;
			rim_light.shadowCameraRight = d;
			rim_light.shadowCameraTop = d ;
			rim_light.shadowCameraBottom = -d;
			rim_light.shadowCameraNear = 0.01;

			scene.add(rim_light)

		//_____________________back_LIGHT
			back_light = new THREE.SpotLight( 0x53777A, 5,150,Math.PI/2 );
			back_light.position.set( -70, 50,-20 ).multiplyScalar( 1 );
			
			

			scene.add(back_light);

		//_____________________TrumpetLight
			trumpet_light = new THREE.SpotLight( å.light.trumpet.color, å.light.trumpet.intensity,150,Math.PI/2 );
			trumpet_light.position.set( 70, 50,-20 ).multiplyScalar( 1 );
			
			trumpet_light.castShadow = true;

			trumpet_light.shadowMapWidth = 1024 ;
			trumpet_light.shadowMapHeight = 1024 ;
			trumpet_light.exponent = 100;
			trumpet_light.target.position.set( 0, 0,25);
			trumpet_light.target.updateMatrixWorld();

			var d = 35;
		
			trumpet_light.shadowCameraLeft = -d;
			trumpet_light.shadowCameraRight = d;
			trumpet_light.shadowCameraTop = d ;
			trumpet_light.shadowCameraBottom = -d;
			trumpet_light.shadowCameraNear = 0.01;

			scene.add( trumpet_light );

			//_____________________KontrabassLight
			kontrabass_light = new THREE.SpotLight( å.light.kontrabass.color, å.light.kontrabass.intensity,150,Math.PI/2 );
			kontrabass_light.position.set( 70, 50,-20 ).multiplyScalar( 1 );
			
			kontrabass_light.exponent = 100;

			
			kontrabass_light.target.position.set( 22,5,-14);
			kontrabass_light.target.updateMatrixWorld();
			scene.add( kontrabass_light );

			//_____________________DrumLight
			drum_light = new THREE.SpotLight(å.light.drum.color, å.light.drum.intensity,150,Math.PI/2 );
			drum_light.position.set( 30, 50,-10 ).multiplyScalar( 1 );
			
			drum_light.exponent = 70;

			
			drum_light.target.position.set( -15, 10,0);
			drum_light.target.updateMatrixWorld();
			scene.add( drum_light );

			//_____________________PianoLight
			piano_light = new THREE.SpotLight( å.light.piano.color, å.light.piano.intensity,150,Math.PI/2 );
			piano_light.position.set( 30, 50,-10 ).multiplyScalar( 1 );
			
			piano_light.castShadow = true;
			piano_light.exponent = 70;

			piano_light.shadowMapWidth = 1024 ;
			piano_light.shadowMapHeight = 1024 ;
			
			piano_light.target.position.set( -5, 15,-25);
			piano_light.target.updateMatrixWorld();

			var d = 35;
		
			piano_light.shadowCameraLeft = -d;
			piano_light.shadowCameraRight = d;
			piano_light.shadowCameraTop = d ;
			piano_light.shadowCameraBottom = -d;
			piano_light.shadowCameraNear = 0.01;
			scene.add( piano_light );
       
			
       
       //___________________________________________
		

		

		var cylinder_geometry = new THREE.CylinderGeometry( 50, 500, 20,8 );
			var ground_material = new THREE.MeshBasicMaterial( {
				color:0x000000
			});

			var cylinder_material = new THREE.MeshLambertMaterial( {
				color:0x542437
			});
			
		var ground_cylinder = new THREE.Mesh(cylinder_geometry, ground_material);
			ground_cylinder.position.set(0,-50,0);
			scene.add(ground_cylinder);
		master_ground = [];
		var c_radius;
		var height_id = 0
			for(var c_count = 0;c_count<100;c_count++){

				if(height_id>32){
					height_id = 0;
				}

				c_radius = randomNumber(5,20,false);
			var c_geometry = new THREE.CylinderGeometry( c_radius,c_radius, 20,10 );
			master_ground[c_count] = new THREE.Mesh(c_geometry, cylinder_material );
			master_ground[c_count].position.set(randomNumber(25,100,true),-30,randomNumber(25,100,true));
			master_ground[c_count].receiveShadow = true;
			master_ground[c_count].castShadow = true;
			master_ground[c_count].master_id= height_id;

			master_ground[c_count].update = function(time){
				this.scale.y = 1 + (frequencyData[this.master_id] * .015);
			}

			height_id++;
			scene.add(master_ground[c_count]);
		}		
}// end of init

	
//___________________________________________ Event in Space
	window.addEventListener( 'resize', onWindowResize, false );
//___________________________________________ click

function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

      }

//___________________________________________ RENDER

function animate() {

  requestAnimationFrame( animate );
  
  if(!å.animate){
    load_indication(å.complete.percentage);
    
    if(å.complete.texture && å.complete.models && å.complete.audio){
      
      
      if(!å.touch){
        å.animate = true;
        jazz_song.play();
        load_holder.setAttribute('class','playing');
      }
    }
  }
  
  else{
    analyser.getByteFrequencyData(frequencyData);

    render();
  }

}

var curr_cam = 0;
function render(time) {
	 theta += 0.1;
	 var delta = .75 * clock.getDelta();
	
		c.update(time);
		c_top.update(time);
		videoTexture.needsUpdate = true;
		topTexture.needsUpdate = true;
		master_ground.forEach(function(el,index){
			el.update(time);
		})
	

	if(typeof jazz_song != "undefined"){
		
		if(typeof å.timestamps[curr_cam] != "undefined" &&
			jazz_song.currentTime > å.timestamps[curr_cam].time){
				
				å.active_camera = å.timestamps[curr_cam].type + '_camera';
			curr_cam++;
			if(curr_cam>=å.timestamps.length){
				curr_cam = 0;
			}
		}	
	}
	
	var keyframe = Math.floor( time / interpolation ) + animOffset;
	
	//morph_logic.loop_all_morphs(time);
	
	THREE.AnimationHandler.update( delta/interpolation );
	piano_helper.update();
	drum_helper.update();
	trumpet_helper.update();
	saxo_helper.update();
	kontrabass_helper.update();
	
	
	
	
	switch(å.active_camera){
		case 'drum_camera':
			renderer.render( scene, drum_camera, renderTarget, true );
		break;
		case 'piano_camera':
			renderer.render( scene, piano_camera, renderTarget, true );
		break;
		case 'kontrabass_camera':
			renderer.render( scene, kontrabass_camera, renderTarget, true );
		break;
		case 'trumpet_camera':
			renderer.render( scene, trumpet_camera, renderTarget, true );
		break;
		default:
			renderer.render( scene, piano_camera, renderTarget, true );
		break;
	}
  	renderer.render( scene, camera );

}