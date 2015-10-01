var explosion=null,ex_bool = false;
var sheeps_on_screen = [];
var punsh = [];
var $spawn = $('button');
//___________________________________________
var scene = new THREE.Scene();

//___________________________________________ camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    camera.position.z = 15;
    camera.position.y = 5;
    camera.position.x = 5;
    camera.lookAt(new THREE.Vector3(0,0,0));

//___________________________________________ renderer
var render_options = { 
    antialiasing: true , 
    alpha: true,
    transparent : true
}

var renderer = new THREE.WebGLRenderer(render_options);
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;
    //renderer.setClearColor(0x00cbf0,1);

document.body.appendChild( renderer.domElement );

//___________________________________________ resize

window.onresize = function(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
//___________________________________________ controls

  controls = new THREE.OrbitControls( camera );
  controls.damping = 0.2;
  controls.addEventListener( 'change', render );

//___________________________________________ Event in Space
	var projector = new THREE.Projector();
  var mouse = {};
  //All Clickable Objects
  var targetList = [];
	
//___________________________________________ Event in Space
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );

//___________________________________________ click
function onDocumentMouseDown( event ) {
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;	
	// find intersections
	var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
	projector.unprojectVector( vector, camera );
	var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize());
	var intersects = ray.intersectObjects( targetList );
	if ( intersects.length > 0 ){
    clicker(intersects[ 0 ].object);
	}
}
//___________________________________________ move
function onDocumentMouseMove( event ) {
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;	
	// find intersections
	var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
	projector.unprojectVector( vector, camera );
	var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

	var intersects = ray.intersectObjects( targetList );
	
	if ( intersects.length > 0 ){
    mover(intersects[ 0 ].object);
	}
}

//___________________________________________ Helper Functions

function velocity(vel){
    var array_ = [];
    var rnd = Math.random()*vel;
    var siner = Math.sin(rnd)*vel;    
    return siner;
  }

function rad_(deg){
 var rad = deg * Math.PI/180;
  return rad;
}

function get_random_color(r,g,b) {  
    return 'rgb(' + (Math.floor(Math.random() * r)+1) + ',' + (Math.floor(Math.random() * g)+1) + ',' + (Math.floor(Math.random() * b)+1) + ')';
}


//___________________________________________ Light
var ambient = new THREE.AmbientLight( 0x000000 );
//scene.add(ambient);

var light = new THREE.DirectionalLight( 0xffffff, 1, 1000 );
    light.shadowDarkness = 0.5;
    light.shadowCameraVisible = false;
    light.castShadow = true;
    light.position.set( 0, 10, 100 );

    light.shadowCameraRight    =  5;
    light.shadowCameraLeft     = -5;
    light.shadowCameraTop      =  5;
    light.shadowCameraBottom   = -5;
  
var fill =  light.clone();
    fill.position.z = -100;
var top_light = light.clone();
    top_light.position.set(0,100,0);
var left_light = light.clone();
    left_light.position.set(100,0,0);
var right_light = light.clone();
    right_light.position.set(-100,0,0);
    scene.add( light );
    scene.add( fill );
    scene.add( top_light );
    scene.add( left_light );
    scene.add( right_light );
//___________________________________________ Chicken

function mesh_color(color){
  var mesh_color = new THREE.MeshPhongMaterial({ 
    color: color 
  });
  return mesh_color;
}
function Sheep(x,z,rot) {
  this.id = 0;
  this.name = "Chicken";
  this.time_stamp_id = (new Date()).toString().replace(/([^0-9]+)/gi, '');
  
  var fac = 1;
var box = new THREE.BoxGeometry(1, 1, 1);
var box_material = mesh_color(0xfcde62);

var group_p = [];
var chick = new THREE.Object3D();
var mesh = new THREE.Mesh( box , mesh_color(0xffffff) );
    mesh.position.x = 0;
    mesh.position.y = 0;
    mesh.position.z = 0;
    mesh.scale.set(1.2,1,1);
var head = new THREE.Mesh( box , mesh_color(0xfaae8b) );
    head.position.x = 1;
    head.position.y = .5;
    head.position.z = 0;
    head.rotation.set(90 * Math.PI/180,1,0);
    head.scale.set(.6,.6,.8);
var head_w = head.clone();
    head_w.material = mesh_color(0xffffff);
//var head_w = new THREE.Mesh( box , mesh_color(0xffffff) );
    head_w.position.x = .6;
    head_w.position.y = .8;
    head_w.position.z = 0;
    head_w.rotation.set(90 * Math.PI/180,1,0);
    head_w.scale.set(.7,.7,.4);
var eye_l = new THREE.Mesh( box , mesh_color(0xffffff) );
    eye_l.position.x = .95;
    eye_l.position.y = .6;
    eye_l.position.z = .3;
    eye_l.rotation.set(90 * Math.PI/180,1,0);
    eye_l.scale.set(.25,.05,.25);
var eye_r = eye_l.clone();
    eye_r.position.z = -.3;
var ears = new THREE.Mesh( box , mesh_color(0xfaae8b) );
    ears.position.x = .65;
    ears.position.y = .6;
    ears.position.z = 0;
    ears.rotation.set(90 * Math.PI/180,1,0);
    ears.scale.set(.2,1,.2);
var pupil_l = new THREE.Mesh( box , mesh_color(0x000000) );
    pupil_l.position.x = .95;
    pupil_l.position.y = .6;
    pupil_l.position.z = .35;
    pupil_l.rotation.set(rad_(90),0,0);
    pupil_l.scale.set(.05,.05,.05);
var pupil_r = pupil_l.clone();
    pupil_r.position.z = -.35;
var leg_l_v = new THREE.Mesh( box , mesh_color(0xfaae8b) );
    leg_l_v.position.x = .35;
    leg_l_v.position.y = -.75;
    leg_l_v.position.z = .3;
    leg_l_v.rotation.set(0,0,0);
    leg_l_v.scale.set(.3,.3,.3);
var leg_l_h = leg_l_v.clone();
    leg_l_h.position.x = -.3;
var leg_r_v = leg_l_h.clone();
    leg_r_v.position.z = -.3;
var leg_r_h = leg_l_v.clone();
    leg_r_h.position.z = -.3;
  
    chick.add( mesh );
    chick.add( head );
    chick.add( head_w );
    chick.add( eye_l );
    chick.add( eye_r );
    chick.add( ears );
    chick.add( pupil_l );
    chick.add( pupil_r );
    
    chick.add( leg_l_v );
    chick.add( leg_l_h );
    chick.add( leg_r_v );
    chick.add( leg_r_h );
    
  
  chick.position.x = x;
  chick.position.z = z;
  chick.rotation.y = rot;
  
    scene.add(chick);
    group_p.push([
        velocity(Math.random()*100),
        velocity(Math.random()*100),
        velocity(Math.random()*100)
    ]);
    chick.children.forEach(function(elem,i) {
      targetList.push(elem);
    });
    chick.extra_options = {
        velocity : group_p
      }
      chick.remover = function() {
        chick.children.forEach(function(elem){
          targetList.filter(function (el,index) {
            if(el.uuid == elem.uuid){
             targetList.splice(index,1);
            }
          });
        });
        
        scene.remove(chick);
      }
      chick.update = function(time) {
        mesh.position.y += .0025 * fac;
        head.position.y += .005 * fac;
        head_w.position.y += .005 * fac;
        ears.position.y += .005 * fac;
        eye_l.position.y += .005 * fac;
        eye_r.position.y += .005 * fac;
        pupil_l.position.y += .005 * fac;
        pupil_r.position.y += .005 * fac;

        pupil_l.position.x += .002 * fac;
        pupil_r.position.x += .002 * fac;

        leg_l_v.rotation.z -= .04 * fac;
        leg_r_v.rotation.z -= .04 * fac;

        leg_l_h.rotation.z -= .04 * fac;
        leg_r_h.rotation.z -= .04 * fac;

        if(head.position.y > .7 || head.position.y < 0.5) fac*=(-1);
      }
  
    //targetList.push(mesh);
    chick.castShadow = true;
    chick.receiveShadow = true;
  chick.name = "Sheep";
    return chick;
}


function generate_path(){
  var path = [];
  for(var i=0;i<100;i++){
    var x = Math.sin(i);
    var y = Math.cos(i);
    path.push([x,y]);
  }
}
//___________________________________________ Game Logic
//________________________ Move
function floor(){
  var box = new THREE.BoxGeometry(2, 1, 2);
  var cube_material = mesh_color(get_random_color( 100,250,100));
  var floor = new THREE.Object3D();
  for(var i=0;i<20;i++){
    for(var j=0;j<20;j++){
    var mesh = new THREE.Mesh( box , cube_material );
      mesh.position.x = -((20*2.05)/2) + i * 2.05;
      mesh.position.z = -((20*2.05)/2) + j * 2.05;
      floor.add(mesh)
    }
  }
  floor.position.y = -1.5;
  scene.add(floor);
}

floor();
//________________________ Explosion

function Explode(old_obj) {
  var ticker = 0;
      old_obj.active = true;
      old_obj.material.visible = false;
  var pos_parent = old_obj.parent.position;
  var pos_base = old_obj.position;
  
  //console.log(pos_parent,pos_base);
  var group = new THREE.Object3D();
  var name = "Explosion"
  group.ex_bool = true;
  var box = new THREE.BoxGeometry(.25, .25, .25);
  var vel_cube = [];
  
  for(var i=0;i<2;i++){
    for(var j=0;j<2;j++){
      for(var k=0;k<2;k++){
        
      var cube_material = mesh_color(get_random_color( 100*k,100*j,100*i));
      var mesh = new THREE.Mesh( box , cube_material );
        var x_ = pos_parent.x + -((.11*9)/2)+i * .25;
        var y_ = pos_parent.y + -((.11*9)/2)+j * .25;
        var z_ = pos_parent.z + -((.11*9)/2)+k * .25;
            mesh.position.x = x_;
            mesh.position.y = y_;
            mesh.position.z = z_;
            group.add(mesh);
            vel_cube.push([
                velocity(Math.random()*100),
                velocity(Math.random()*100),
                velocity(Math.random()*100)
            ]);
      }
    } 
  }
  group.position = pos_parent;
  scene.add(group);
  group.remover = function(){
    scene.remove(group);
    group.ex_bool = false;
    old_obj.parent.remover();
    punsh.filter(function (el,index) {
      if(el.uuid == group.uuid){
        punsh.splice(index,1);
      }
    });
  }
  group.update = function(t) {
    ticker++;
    var that = this;
    if(ticker===100){
      group.remover();
    }
    
    group.children.forEach(function(e,i){
      e.position.x += vel_cube[i][0] * .001;
      e.position.y += vel_cube[i][1] * .001;
      e.position.z += vel_cube[i][2] * .001;
        
      e.rotation.x += Math.random()*x_ * .3;
      e.rotation.y += Math.random()*y_ * .3;
      e.rotation.z += Math.random()*z_ * .3;
      
      e.scale.x -= .05;
      e.scale.y -= .05;
      e.scale.z -= .05;
      
      if(e.scale.x <0){
        group.remover();
      }
      else{
        e.material.visible = true;
      }
    });
  }
  punsh.push(group);
  return group;
}


//___________________________________________ Logic
var sheeps = [];
for(var i=0;i<10;i++){
  for(var j=0;j<10;j++){
    var x = -(10 * 3) / 2;
    var y = -(10 * 3) / 2;
    sheep = new Sheep(x+i*3,y+j*3,i);
    sheeps.push(sheep);
  }
}

$spawn.click(function(){
  sheep = new Sheep(0,0,1); 
});


function logic(time){
  punsh.forEach(function(el){
    if(el.ex_bool){
      el.update();
    }
  });
  sheeps.forEach(function(el){
    el.update(time);
  });
}

//___________________________________________ Game Logic
//__________________ Click
function clicker(obj){
  obj.parent.ex_bool = true;
  obj.parent.children.forEach(function(el) {
    explosion = new Explode(el);
  });
}


function random_explosion(){
   var rand = (Math.random()*sheeps.length-1);
   
   var random_sheep = sheeps[rand.toFixed(0)];
   if(typeof random_sheep  !== "undefined"){
     random_sheep.parent.ex_bool = true;
  random_sheep.children.forEach(function(el) {
    explosion = new Explode(el);
  });
     sheeps.splice(rand.toFixed(0),1);
   }
}

setInterval(random_explosion,500);

var destinationCanvas = document.createElement('canvas');
    destinationCanvas.width = window.innerWidth;
    destinationCanvas.height = window.innerHeight;
    destinationCanvas.setAttribute('class','copy_canvas');
    document.body.appendChild(destinationCanvas);
//grab the context from your destination canvas
var destCtx = destinationCanvas.getContext('2d');

//call its drawImage() function passing it the source canvas directly

//__________________ Click

function mover(obj){
  
}
//___________________________________________ Render Setup
var time = 0;
var render = function (time) { 
  requestAnimationFrame( render );
  logic(time);
  renderer.render(scene, camera);
  //destCtx.clearRect(0,0,window.innerWidth,window.innerHeight);
 // destCtx.drawImage(renderer.domElement, 0, 0);
};

//___________________________________________ Kick it off!
render();