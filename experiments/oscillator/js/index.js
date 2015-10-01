//________________________________________
var Audio_Options = function() {
  this.speed = 0.05;
  this.moving = true;
  this.audio = true;
  
  this.cube_1 = 180;
  this.cube_color_1 = 0xDF841C;//Math.random() * 0xffffff;
  
  this.cube_2 = 200;
  this.cube_color_2 = 0xDF1C32;
    
  this.cube_3 = 300;
  this.cube_color_3 = 0x55DF1C;
    
  this.cube_4 = 400;
  this.cube_color_4 = 0xDF841C;
    
  this.cube_5 = 500;
  this.cube_color_5 = 0x1C6064;
    
  this.cube_6 = 600;
  this.cube_color_6 = 0x2C8042;
    
  this.cube_7 = 50;
  this.cube_color_7 = 0x7E2F1A;
  
  this.cube_8 = 80;
  this.cube_color_8 = 0xDF841C;
    
};


var audio_ = new Audio_Options();
var gui = new dat.GUI();

var general = gui.addFolder('General');
var frequency = gui.addFolder('Frequency values');


var gui_speed = general.add(audio_, 'speed', -1, 1);
var gui_moving = general.add(audio_, 'moving');
var gui_audio = general.add(audio_, 'audio');
var colors = gui.addFolder('Colors');
var cube_options = [];
for(var i=1;i<=8;i++){
  cube_options.push({
    value : frequency.add(audio_, 'cube_'+i ,50,600),
    color  : colors.addColor(audio_, 'cube_color_'+i)
  });
}
general.open();

cube_options.forEach(function(el,index){
  el.value.onChange(function(value){
    collision_objects[index].strength = value;
  });
  el.color.onChange(function(value){
    collision_objects[index].material.color = new THREE.Color(value);
  });
})

gui_speed.onChange(function(value) {
   sphere.speed = value;
});

gui_moving.onChange(function(value) {
   sphere.moving = value;
});
gui_audio.onFinishChange(function(value) {
   if(value){
     audio_data.oscillator.custom_start();
   }
  else{
    audio_data.oscillator.custom_stop();
  }
});


//__________________________________________

var $fogColor = 0xcccccc;
//__________________________________________
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var offset = new THREE.Vector3();
var INTERSECTED, SELECTED;
var drag_objects = [];
var collision_objects = [];
var objects_to_update = [];

//__________________________________________


//__________________________________________
var renderer = new THREE.WebGLRenderer({ antialias: true }); /// { alpha: true }
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMapEnabled = true;
    // to antialias the shadow
    renderer.shadowMapType = THREE.PCFSoftShadowMap;
    renderer.setClearColor($fogColor, 1 );

    renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
		renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
		renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );
document.body.appendChild( renderer.domElement );


//__________________________________________

window.onresize = function(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
//__________________________________________

var scene = new THREE.Scene();

//__________________________________________
var camera = new THREE.PerspectiveCamera( 50, window.innerWidth/window.innerHeight, 0.1, 1000 );
    camera.position.y = 40;
    camera.position.x = -26;
    camera.position.z = 26;
  
    camera.rotation.x = -20 * Math.PI / 180;

  var box_geometry = new THREE.BoxGeometry(1,1,1);
  var box_material = new THREE.MeshBasicMaterial();
  var camera_helper = new THREE.Mesh(box_geometry,box_material);
      camera_helper.visible = false;
  camera.add(camera_helper);
  
  //__________________________________________

    controls = new THREE.OrbitControls( camera );
    controls.damping = 0.02;
    controls.target = new THREE.Vector3(0, 10, 0);
    //controls.minPolarAngle = 5*Math.PI/180;
    //controls.maxPolarAngle = 5*Math.PI/180;
    /*controls.maxDistance = 10;
    controls.minDistance = 3;*/

    controls.update();
    controls.addEventListener( 'change', render );

//__________________________________________

var light = new THREE.SpotLight( 0xffffff, 1, 1000 );
    light.shadowDarkness = .5;
   // light.shadowCameraVisible = true;
    light.castShadow = true;
    light.position.set( -500, 500, 0 );

//ridiculous hight shadow map
    light.shadowMapWidth = 1024; // default is 512
    light.shadowMapHeight = 1024;  // default is 512
    light.shadowCameraRight    =  50;
    light.shadowCameraLeft     = -50;
    light.shadowCameraTop      =  50;
    light.shadowCameraBottom   = -50;

var light_bottom = new THREE.SpotLight( 0xffffff, 1, 1000 );
    light_bottom.position.y = -500;
    light_bottom.intensity = .5;
    scene.add( light );
   // scene.add( light_bottom );
  
//___________________________________________ Sphere

var scene_holder = new THREE.Object3D();


var sphere_geometry = new THREE.SphereGeometry( 1, 10, 10 );
var sphere_material = new THREE.MeshLambertMaterial({
  color: 0xeeeeee,
  emissive: 0xffffff,
  shader : THREE.FlatShading
});


var sphere = new THREE.Mesh( sphere_geometry,sphere_material );
    sphere.receiveShadow = true;
    sphere.castShadow = true;
    sphere.position.y = 15;
    sphere.position.z = -5;
    sphere.position.x = -5;
    sphere.moving = audio_.moving;
    sphere.direction = {
      x : 1,
      y : 1,
      z : 1
    }
    sphere.speed = audio_.speed;
    sphere.update = function(time){      
      if(this.position.x > 8.5 || this.position.x < -8.5){
        this.direction.x *= (-1); 
      }
      if(this.position.y > 18.5 || this.position.y < 1.5){
        this.direction.y *= (-1); 
      }
      if(this.position.z > 8.5 || this.position.z < -8.5){
        this.direction.z *= (-1); 
      }
      if(this.moving){
        this.position.x += this.speed * this.direction.x;
        this.position.y += this.speed*.2 * this.direction.y;
        this.position.z += this.speed*.5 * this.direction.z;
      }
    }
    
    scene_holder.add( sphere );
    drag_objects.push( sphere );
//__________________________________________ Floor

var audio_options = {
  name : 'some_type',
  pos : {
    x : -5,
    y : 5,
    z : -5
  },
  strength : 200,
  center : new THREE.Vector3(0,10,0),
  mat : {
    color: audio_.cube_color_8,
    opacity : 0.05,
    side: THREE.DoubleSide,
    transparent : true
  }
}

function cube(options){
  var geometry = new THREE.BoxGeometry( 9.9,9.9, 9.95 );
  var main_material = new THREE.MeshBasicMaterial(options.mat);
  var cube = new THREE.Mesh(geometry,main_material);  
      cube.audio_type = options.name;
      cube.strength = options.strength;
      cube.position.x = options.pos.x;
      cube.position.y = options.pos.y;
      cube.position.z = options.pos.z;
      cube.active = false;
  var start_vector = options.center;
  var end_vector = sphere.position;
  var line = new liner(start_vector,end_vector);
      line.update = function(lookAt){
        
        this.geometry.vertices[1] = sphere.position;
        this.geometry.verticesNeedUpdate = true;
        
      }
      objects_to_update.push(line);
      scene_holder.add(line);
  var edge = new THREE.EdgesHelper( cube, 0xbbbbbb );
      edge.material.linewidth = .5;
      edge.translateX(10);
      scene_holder.add( edge );
      collision_objects.push(cube);
      
  return cube;
  }

var deep_sound = cube(audio_options);
    scene_holder.add(deep_sound);
//____________________________________ Effekt 1
  
  audio_options.mat.color = audio_.cube_color_1;//0xDF841C;
  audio_options.pos.x = 5;
  audio_options.pos.y = 5;
  audio_options.pos.z = -5;
  audio_options.center = new THREE.Vector3(5,5,-5);
  audio_options.strength = 275;
  var effekt_sound_1 = cube(audio_options);

scene_holder.add(effekt_sound_1);
//____________________________________ Effekt 2
  audio_options.name = 'oscillator';
  audio_options.mat.color = audio_.cube_color_2;
  audio_options.pos.x = 5;
  audio_options.pos.y = 5;
  audio_options.pos.z = 5;
  audio_options.strength = 200;
  audio_options.center = new THREE.Vector3(5,5,5);
  audio_options.center = audio_options.pos;
  var effekt_sound_2 = cube(audio_options);

scene_holder.add(effekt_sound_2);
  
  //____________________________________ Effekt 3
  audio_options.name = 'oscillator';
  audio_options.mat.color = audio_.cube_color_3;
  audio_options.pos.x = -5;
  audio_options.pos.y = 5;
  audio_options.pos.z = 5;
  audio_options.strength = 300;
  audio_options.center = new THREE.Vector3(-5,5,5);
  var effekt_sound_3 = cube(audio_options);

scene_holder.add(effekt_sound_3);  
  
  //____________________________________ Effekt 4
  audio_options.name = 'oscillator';
  audio_options.mat.color = audio_.cube_color_4;
  audio_options.pos.x = -5;
  audio_options.pos.y = 15;
  audio_options.pos.z = 5;
  audio_options.strength = 400;
  audio_options.center = new THREE.Vector3(-5,15,5);
  var effekt_sound_4 = cube(audio_options);

scene_holder.add(effekt_sound_4);  


  //____________________________________ Effekt 5
  audio_options.name = 'oscillator';
  audio_options.mat.color = audio_.cube_color_5;
  audio_options.pos.x = 5;
  audio_options.pos.y = 15;
  audio_options.pos.z = 5;
  audio_options.strength = 500;
  audio_options.center = new THREE.Vector3(5,15,5);
  var effekt_sound_5 = cube(audio_options);

scene_holder.add(effekt_sound_5); 
  
   //____________________________________ Effekt 6
  audio_options.name = 'oscillator';
  audio_options.mat.color = audio_.cube_color_6;
  audio_options.pos.x = 5;
  audio_options.pos.y = 15;
  audio_options.pos.z = -5;
  audio_options.strength = 200;
  audio_options.center = new THREE.Vector3(5,15,-5);
  var effekt_sound_6 = cube(audio_options);

scene_holder.add(effekt_sound_6); 
  
     //____________________________________ Effekt 7
  audio_options.name = 'oscillator';
  audio_options.mat.color = audio_.cube_color_7;
  audio_options.pos.x = -5;
  audio_options.pos.y = 15;
  audio_options.pos.z = -5;
  audio_options.strength = 250;
  audio_options.center = new THREE.Vector3(-5,15,-5);
  var effekt_sound_7 = cube(audio_options);
scene_holder.add(effekt_sound_7); 
  
//__________________________________________ Floor

var floor_geometry = new THREE.PlaneGeometry( 20, 20, 32 );
var floor_material = new THREE.MeshPhongMaterial({
  color: 0xcccccc, 
  side: THREE.DoubleSide
});


var bg_1 = new THREE.Mesh( floor_geometry, floor_material );
    bg_1.rotation.z = -Math.PI/2;
    bg_1.rotation.x = Math.PI/2;
    bg_1.position.y = 0;
    bg_1.receiveShadow = true;
    //floor.castShadow = true;
var bg_2 = bg_1.clone();

var bg_2 = bg_1.clone();
    bg_2.position.y = 20;

var bg_3 = bg_2.clone();
    bg_3.position.x = 0;
    bg_3.position.y = 0;
    bg_3.position.z = 0;

    bg_1.rotation.y = -Math.PI/2;
    bg_1.position.x = 10;
    bg_1.position.y = 10;

var bg_4 = bg_1.clone();
    bg_4.rotation.y = 0;
    bg_4.position.z = -10;
    bg_4.position.y = 10;
    bg_4.position.x = 0;

var bg_5 = bg_4.clone();
    bg_5.position.z = 10;

var bg_6 = bg_1.clone();
    bg_6.position.x = -10;

    //scene.add( bg_1 );
    //scene.add( bg_2 );
    //scene.add( bg_3);
    //scene.add( bg_4 );
    //scene.add( bg_5 );
    //scene.add( bg_6 );

//grid xz
 var grid_1 = new THREE.GridHelper(10, 1);
     grid_1.position.set(0,0.1,0);
     grid_1.setColors( new THREE.Color(0x1596DA), new THREE.Color(0x222222) );
  
//grid xz
 var grid_2 = new THREE.GridHelper(10, 1);
     grid_2.position.set(0,19.9,0);
     grid_2.setColors( new THREE.Color(0x1596DA), new THREE.Color(0x222222) );

 //grid xy
 var grid_3 = new THREE.GridHelper(10, 1);
     grid_3.rotation.z = Math.PI/2;
     grid_3.position.set(9.9,10,0);
    grid_3.setColors( new THREE.Color(0x1596DA), new THREE.Color(0x222222) );   

 //grid xy
 var grid_4 = new THREE.GridHelper(10, 1);
     grid_4.rotation.x = 90 * Math.PI/180;
     grid_4.position.set(0,10,9.9);
      grid_4.setColors( new THREE.Color(0x1596DA), new THREE.Color(0x222222) );

//grid xy
 var grid_5 = new THREE.GridHelper(10, 1);
     grid_5.rotation.x = 90 * Math.PI/180;
     grid_5.position.set(0,10,-9.9);
     grid_5.setColors( new THREE.Color(0x1596DA), new THREE.Color(0x222222) );
  
//grid xy
 var grid_6 = new THREE.GridHelper(10, 1)
     grid_6.rotation.x = 90 * Math.PI/180;
     grid_6.rotation.y = 0 * Math.PI/2;
     grid_6.rotation.z = 90 * Math.PI/180;
     grid_6.position.set(-9.9,10,0);
     grid_6.setColors( new THREE.Color(0x1596DA), new THREE.Color(0x222222) );
     

     //scene.add(grid_1);
     //scene.add(grid_2);
     //scene.add(grid_3);
     //scene.add(grid_4);
     //scene.add(grid_5);
     //scene.add(grid_6);
  
function small_grid(){
  var material = new THREE.LineBasicMaterial({
        color: 0xffffff,
        linewidth: 2,
      transparent : true,
      opacity : .25
    });
  var geometry = new THREE.Geometry();
  var st_x = 0;
  var st_y = 0;
  var st_z = 0;
  for(var i = 0; i < 10; i++){
      geometry.vertices.push(st_x+i,st_y+i,st_z+i);
  }  
  var line = new THREE.Line(geometry, material);      
  return line;
}

var small_grid = new small_grid();
    scene_holder.add(small_grid);

//___________________________________________ helper
var plane = new THREE.Mesh(
					new THREE.PlaneBufferGeometry( 2000, 2000, 8, 8 ),
					new THREE.MeshBasicMaterial({ 
            color: 0x000000, 
            opacity: 0.25, 
            transparent: true 
   })
);
		plane.visible = false;
		scene.add( plane );



scene.add(scene_holder);
//___________________________________________ draw line
  function liner(starting_point,end_point){
    var material = new THREE.LineBasicMaterial({
        color: 0xffffff,
        linewidth: 2,
      transparent : true,
      opacity : .25
    });
  var geometry = new THREE.Geometry();
      geometry.vertices.push(starting_point);
      geometry.vertices.push(end_point);  
  var line = new THREE.Line(geometry, material);      
  return line;    
}
/*
  var material = new THREE.LineBasicMaterial({
        color: 0xffffff,
        linewidth: 2 
    });
  var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, 10, 0));
    geometry.vertices.push(new THREE.Vector3(0, 10, 0));  
  var line = new THREE.Line(geometry, material);
      
  scene.add(line);*/
  
//___________________________________________ render

var time = 0;
var render = function (time) { 
  requestAnimationFrame( render ); 
  animation(time); 
 camera.updateProjectionMatrix(); 
  renderer.render(scene, camera);
};

//___________________________________________ collision detection
  function collision_detector(obj,callback){
    var intersecting = [];
    var obj_bounding = new THREE.Box3().setFromObject(obj);
    collision_objects.forEach(function(el,i){
      var bounding_el = new THREE.Box3().setFromObject(el); 
      var boolean_collision;
      if(obj_bounding.isIntersectionBox(bounding_el)){
        boolean_collision = true;
      }
      else{  
        boolean_collision = false;
      }
      callback(boolean_collision,el);
    });
}
//___________________________________________ sound logic
function get_sphere_pos() {
  var x_ = sphere.position.x;
  var y_ = sphere.position.y;
  var z_ = sphere.position.z;
  var sphere_size = 1;
  if( x_ < -10 + sphere_size )  sphere.position.x = -10  + sphere_size ;
  if( x_ > 10 - sphere_size )  sphere.position.x = 10 - sphere_size ;
  
  if( y_ < sphere_size )  sphere.position.y = sphere_size ;
  if( y_ > 20  - sphere_size )  sphere.position.y = 20 - sphere_size ;
  
  if( z_ < -10  + sphere_size )  sphere.position.z = -10 + sphere_size ;
  if( z_ > 10  - sphere_size )  sphere.position.z = 10 - sphere_size ;
}

//___________________________________________ drag & drop

function onDocumentMouseMove( event ) {
	event.preventDefault();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  
	raycaster.setFromCamera( mouse, camera );
 
	if ( SELECTED ) {
		var intersects = raycaster.intersectObject( plane );
		SELECTED.position.copy( intersects[ 0 ].point.sub( offset ) );
    get_sphere_pos();
    
		return;
	}

	var intersects = raycaster.intersectObjects( drag_objects );
	if ( intersects.length > 0 ) {
		if ( INTERSECTED != intersects[ 0 ].object ) {
			INTERSECTED = intersects[ 0 ].object;
			plane.position.copy( INTERSECTED.position );
			plane.lookAt( camera.position );
		}


	} else {
		INTERSECTED = null;
	}
}

function onDocumentMouseDown( event ) {
	event.preventDefault();
	var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 ).unproject( camera );
	var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
	var intersects = raycaster.intersectObjects( drag_objects );
	if ( intersects.length > 0 ) {
		controls.enabled = false;
		SELECTED = intersects[ 0 ].object;
		var intersects = raycaster.intersectObject( plane );
		offset.copy( intersects[ 0 ].point ).sub( plane.position );
	}
}

function onDocumentMouseUp( event ) {
	event.preventDefault();
	controls.enabled = true;
	if ( INTERSECTED ) {
		plane.position.copy( INTERSECTED.position );
		SELECTED = null;
	}
}
function camera_collision(bool,el){
  if(bool){
    el.visible = false;
    //console.log(el.audio_type,bool)
  }
  else{
    el.visible = true;
  }
}
  
function sphere_collision(bool,el){
  if(bool){
    var oscillator_difference = audio_data.oscillator.frequency.value-el.strength;
    
    if(oscillator_difference < 0){
      audio_data.oscillator.frequency.value += 1;
    }
    if(oscillator_difference > 0){
      audio_data.oscillator.frequency.value -= 1;
    }
    el.active = true;
    if(el.material.opacity<.5){
      el.material.opacity += .005;
    }
  }
  else{
    el.active = false;
    if(el.material.opacity>audio_options.mat.opacity){
      el.material.opacity -= .005;
    }
    //el.material.opacity = audio_options.mat.opacity;
  }
}

//////////////////////////////////////////
    //    Animation
//////////////////////////////////////////

var count = 0;
function animation(time){
  //line.update();
  sphere.update();
  objects_to_update.forEach(function(el){
    //console.log(el);
    el.update(sphere.position);
  })
  
  collision_detector(camera_helper,camera_collision);
  collision_detector(sphere,sphere_collision);
  //console.log(camera.position)
}

if (typeof AudioContext !== "undefined") {
  context = new AudioContext();
} else if (typeof webkitAudioContext !== "undefined") {
  context = new webkitAudioContext();
} else {
  //return;
}

//__________________________________________ Audio
//____________________________ Audio
function Audio_Global(){
  var that = this; 
  this.audio_base = 'http://crossorigin.me/http://www.holy-crab.de/sandbox/sounds/';
	this.audio_file_source = {
		context : (function(){
			// Fix up prefixing
			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			var audio_context = new AudioContext();
			return audio_context;
		}()),
		audio_source : {
			global : {
			  boat_behind:         that.audio_base + 'kings_of_convenience_boat_behind.mp3',
			  awakener:         that.audio_base + 'Sound_Awakener_-_Poetic_motion.mp3',
			  cakeheads:         that.audio_base + 'cakeheads.mp3',
			  nicht:         that.audio_base + 'den_nicht.mp3',
			  love:         that.audio_base + 'love_is_no_big_truth.mp3',
			  paris_1:         that.audio_base + 'paris_m2.mp3',
			  paris_2:         that.audio_base + 'paris_m3.mp3',
			  paris_3:         that.audio_base + 'paris_m4.mp3'
		  }
    }
	};
	this.audio =  {
		ready : false,
		data : {},
		current : (function(){
			var tracks = {};
			for (track in that.audio_file_source.audio_source.global){
				tracks[track] = null;
			}
			return tracks;
		}())
	};
  this.oscillator = function(){
    var oscillator; // Create sound source
	  
     // Connect sound to output    
     // Play instantly
    oscillator = that.audio_file_source.context.createOscillator();
    oscillator.already_started = false;
    
    oscillator.custom_start = function(){
    //  this.connect(that.audio_file_source.context.destination);
    this.connect(that.audio_file_source.context.destination); // Connect gain to output
      
      if(!this.already_started){
        this.start(0);
      }
      this.already_started = true;
    };
    
    oscillator.custom_stop = function(){
     // this.stop(0);
      this.disconnect();
    };
    return oscillator;
  }();
this.playSound = function(name){
		if(that.audio.ready){
				//console.log(that.audio.current);
			if(typeof that.audio.current[name] === "undefined" || that.audio.current[name] === null){
				//console.log('undefined ')
        that.audio_file_source.crossOrigin = 'anonymous';
	  var source1 = that.audio_file_source.context.createBufferSource();
			  source1.buffer = that.audio.data[name];
	  		source1.connect(that.audio_file_source.context.destination);
	  		source1.start(0);

				source1.onended = function(){
					that.audio.current[name] = null;
				}
	  		that.audio.current[name] = source1;
	  	}
	  }
	}
	this.stopSound = function(name){
		if(typeof name === "undefined"){
			for(current_audio in that.audio.current){
				if(that.audio.current[current_audio] !== null){
					that.audio.current[current_audio].stop();
					that.audio.current[current_audio].context.currentTime = 0;
					that.audio.current[current_audio].context = null;
				}
			}
		}
		else{
			if(that.audio.current[name] != null){
				that.audio.current[name].stop();
				that.audio.current[name].context.currentTime = 0;
				that.audio.current[name].context = null;
			}
  	}
	}

	this.bufferLoader = (function(){
			var bufferLoader = new BufferLoader(
			  that.audio_file_source.context,function(){
			  	var sounds = [];
			  	for(file in that.audio_file_source.audio_source.global){
			  		sounds.push(that.audio_file_source.audio_source.global[file]);
			  	}
			  	return sounds;
			  }(),
			  function(bufferList){
			  	that.audio.ready = true;
			  	that.audio.data =(function(){
			  		var data = {};
			  		var num = 0;
			  		var keys = Object.keys(that.audio_file_source.audio_source.global);
			  		for(buffer in bufferList){
			  			data[keys[num]] = bufferList[num]
			  			num++;
			  			that.ready_count++;
			  		}
			  		return data;
			  	}())
			  });

			bufferLoader.load();

			return bufferLoader;
		}());
}


var audio_data = new Audio_Global();

audio_data.oscillator.custom_start();

//__________________________________________ KIck it off
render();