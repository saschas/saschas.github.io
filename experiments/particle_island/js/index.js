function randomNumber(min,max,bool){
  
  var num = Math.floor(Math.random()*max) + min; // this will get a number between 1 and 99;
  if(bool || typeof bool == "undefined"){
    num *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
  }
  return num;
}

//______________________________ Scene
var å = {
  controls : {
    type : 'orbit',
    obj : {}
  }
}
var main_color = 0xcccccc;
var time = 0;
var clock = new THREE.Clock();
var canvas_height = window.innerHeight;
var canvas_width = window.innerWidth;

var cloud_origin = {
  x : 0,
  y : 0,
  z : 0
}

cloud_origin.update = function(t){
   this.x = Math.sin(.00005*t) * 2000;
   this.z = Math.cos(.00005*t) * 2000;
}

//______________________________ Scene
var scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0x395783, 0.00005 );

//______________________________ Camera
var camera = new THREE.PerspectiveCamera( 75, canvas_width/canvas_height, 0.1, 50000 );
    camera.lookAt(new THREE.Vector3(0,150,0));
    camera.position.set(6000,5000,8000);
//______________________________ Renderer
var renderer = new THREE.WebGLRenderer({ alpha: true,transparent:true,alpha:true }); /// { alpha: true }
    renderer.setSize( canvas_width, canvas_height );
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;
    //renderer.setClearColor(main_color,1);
$('body').append( renderer.domElement );


//______________________________ Resize
window.onresize = function(){
  canvas_height = window.innerHeight;
  canvas_width = window.innerWidth;
  camera.aspect = canvas_width / canvas_height;
  camera.updateProjectionMatrix();
  renderer.setSize( canvas_width, canvas_height );
}
//______________________________ Controls
function orbit_Controls(){
  var orbit_controls = null;
  orbit_controls = new THREE.OrbitControls( camera );
  orbit_controls.damping = 0.2;
  orbit_controls.maxPolarAngle = Math.PI/2;
  orbit_controls.minPolarAngle = 1;
  
  //controls.minDistance = 100;
  //controls.maxDistance = 220;
  orbit_controls.target = new THREE.Vector3(0,250,0);
  camera.updateMatrixWorld();
  
  return orbit_controls;
}
function fly_Controls(obj){
  var fly_controls = null;
  fly_controls = new THREE.FlyControls( camera );

  fly_controls.movementSpeed = 1000;
  fly_controls.domElement = renderer.domElement;
  fly_controls.rollSpeed = 30 * Math.PI / 180;
  fly_controls.autoForward = false;
  fly_controls.dragToLook = false;
  if(typeof å.controls.cockpit !== "undefined" ){
    camera.position = å.controls.cockpit.position;
  }
  camera.updateMatrixWorld();
  return fly_controls;
}

function set_Controls(type){
  switch(type){
    default:
      å.controls.obj.fly = fly_Controls(å.controls.cockpit);
      å.controls.obj.orbit = orbit_Controls();
      å.controls.obj.fly.enabled = false;
    break;
    case 'orbit':
      å.controls.obj.orbit.enabled = true;
      å.controls.obj.fly.enabled = false;
      å.controls.type = 'orbit';
    break;
    case 'fly':
      å.controls.obj.orbit.enabled = false;
      å.controls.obj.fly.enabled = true;
      å.controls.type = 'fly';
    break;    
  }
}

set_Controls();


//______________________________  Light
var ambient = new THREE.AmbientLight(0x312433);
scene.add(ambient);
/*0xF2Fa870*/
var spotLight = new THREE.SpotLight(0xF9B990);
    spotLight.position.set(-4000,8000,14000);

    spotLight.intensity = 1;
    spotLight.castShadow = true;

		spotLight.shadowCameraNear = 500;
		spotLight.shadowCameraFar = 25000;
		spotLight.shadowCameraFov = 1500;

		//spotLight.shadowCameraVisible = true;

		spotLight.shadowBias = 0.0001;
		spotLight.shadowDarkness = .8;

		spotLight.shadowMapWidth = 1024*2;
		spotLight.shadowMapHeight = 1024*2;
    scene.add(spotLight);


//______________________________ Particles
 THREE.ImageUtils.crossOrigin = true;
var cloud_texture = THREE.ImageUtils.loadTexture("https://s3-us-west-2.amazonaws.com/s.cdpn.io/61062/clouds.png");
cloud_texture.minFilter = THREE.NearestFilter;

var tornado_texture = THREE.ImageUtils.loadTexture("https://s3-us-west-2.amazonaws.com/s.cdpn.io/61062/tornado.png");
tornado_texture.minFilter = THREE.NearestFilter;

var dust_texture = THREE.ImageUtils.loadTexture("https://s3-us-west-2.amazonaws.com/s.cdpn.io/61062/dust.png");
dust_texture.minFilter = THREE.NearestFilter;

var rain_texture = THREE.ImageUtils.loadTexture("https://s3-us-west-2.amazonaws.com/s.cdpn.io/61062/raindrop.png");
rain_texture.minFilter = THREE.NearestFilter;

var sky_texture = THREE.ImageUtils.loadTexture("https://s3-us-west-2.amazonaws.com/s.cdpn.io/61062/sky_dome.png");
sky_texture.minFilter = THREE.NearestFilter;


var green_material = new THREE.MeshLambertMaterial({
	  color: 0x43ad56,
    shading:THREE.FlatShading,
    side: THREE.DoubleSide
});

var wood_material = new THREE.MeshLambertMaterial({
	  color: 0xdf7e48,
    shading:THREE.FlatShading,
    side: THREE.DoubleSide
});

var particles = new THREE.Geometry();
//_________________________________ Clouds
var cloud_color = [];
var cMaterial = new THREE.PointCloudMaterial({
      color: 0xcccccc,
      size: 1500,
      sizeAttenuation : true,
      transparent:true,
      depthTest: true,
      depthWrite: true,
      alphaTest: .8,
      vertexColors: THREE.VertexColors,
      map : cloud_texture
    });
var clouds_particles = new THREE.Geometry();
for(var c=0;c<50;c++){
  var c_y = 5000 +randomNumber(0,1000);
  var c_x = cloud_origin.x + Math.sin(c) * randomNumber(100,2500); 
  var c_z = cloud_origin.z + Math.cos(c) * randomNumber(100,2500);
  
  clouds_particles.vertices.push(new THREE.Vector3(c_x,c_y,c_z));
  var color_fac = randomNumber(10,150,false);
  cloud_color[c] = new THREE.Color('rgb('+color_fac+','+color_fac+','+color_fac+')');

}

var clouds = new THREE.PointCloud(clouds_particles,cMaterial);
//clouds.sortParticles = true;
//clouds.frustumCulled = true;
clouds.geometry.colors = cloud_color;
clouds.geometry.colorsNeedUpdate = true;
clouds.receiveShadow = true;
clouds.castShadow = true;
clouds.update = function(time){
  this.position.x = cloud_origin.x;
  this.position.y = cloud_origin.y;
  this.position.z = cloud_origin.z;
  // FLASH
  flash.position.x = this.position.x;
  flash.position.z = this.position.z;
  this.geometry.vertices.forEach(function(_p,index){
 
  });
  //this.sortParticles = true;

 // this.geometry.verticesNeedUpdate = true;
}
clouds.receiveShadow = true;
clouds.castShadow = true;
scene.add(clouds);



//_________________________________ Rain

var rMaterial = new THREE.PointCloudMaterial({
      color: 0x12374F,
      size: 50,
      sizeAttenuation : true,
      transparent:true,
      depthTest: true,
      depthWrite: true,
      alphaTest: 0.1,
      opacity : 1,
      map : rain_texture
    });
var rain_particles = new THREE.Geometry();
for(var r=0;r<5000;r++){
  var r_y = randomNumber(0,5200,false);  
  var r_x = cloud_origin.x + Math.sin(r) *randomNumber(100,1500); 
  var r_z = cloud_origin.z + Math.cos(r) *randomNumber(100,1500);
  
  rain_particles.vertices.push(new THREE.Vector3(r_x,r_y,r_z));
}

var rain = new THREE.PointCloud(rain_particles,rMaterial);
rain.receiveShadow = true;
rain.castShadow = true;
rain.update = function(time){
  this.geometry.vertices.forEach(function(_p,index){
    _p.y -= 29.81 - randomNumber(0,20,false);
    _p.x += 3;
    _p.z += 3;
    if(_p.y <=0){
      _p.y = 5200;
      _p.x = cloud_origin.x-750 + Math.sin(index) * randomNumber(0,1500);
      _p.z = cloud_origin.z-750 + Math.cos(index) * randomNumber(0,1500);
    }
  });
  //this.sortParticles = true;
  this.geometry.verticesNeedUpdate = true;
}
rain.receiveShadow = true;
rain.castShadow = true;
scene.add(rain);
//__________________________________ FLASH
var flash_material = new THREE.LineBasicMaterial({
	color: 0xffffff,
  linewidth: 3
});

var flash_geometry = new THREE.Geometry();
flash_geometry.vertices.push(
	new THREE.Vector3( 0, 5000, 0 ),
	new THREE.Vector3( 0, 2400, 0 ),
	new THREE.Vector3( 200, 2600, 0 ),
	new THREE.Vector3( 0, 0, 0 )
);

var flash = new THREE.Line( flash_geometry, flash_material );
flash.position.y = 5000;
flash.scale.set(0,0,0);
flash.geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, -5000, 0 ) );
flash.direction = 1;
flash.speed = .25;
flash.counter = 0;
flash.internal_counter = 0;
flash.go = function(time){
  if(this.scale.x >= 1.01 || this.scale.x < 0){
      this.direction *= -1;
      this.internal_counter+=1;
     
  }  
    this.scale.x += this.speed * this.direction;
    this.scale.y += this.speed * this.direction;
    this.scale.z += this.speed * this.direction;
  
    this.counter=0;
}
flash.update = function(time){
  
  if(this.internal_counter!==2){
    this.go(time);
  }
  else{
    if(this.counter%200 == 0){
      this.internal_counter = 0;
    }
  }
  this.counter++;
}

 scene.add( flash );


//_________________________________ Waterfall

var wMaterial = new THREE.PointCloudMaterial({
      color: 0x03C7FC,
      size: 150,
      sizeAttenuation : true,
      transparent:true,
      depthTest: true,
      depthWrite: true,
      alphaTest: 0.1,
      opacity : .5,
      map : rain_texture
    });
var waterfall_particles = new THREE.Geometry();
for(var w=0;w<10000;w++){
  var w_y = -randomNumber(200,3300,false);  
  var w_x = -1500+randomNumber(0,650); 
  var w_z = 3700 + w_x/3;
  waterfall_particles.vertices.push(new THREE.Vector3(w_x,w_y,w_z));
}

var waterfall = new THREE.PointCloud(waterfall_particles,wMaterial);
waterfall.receiveShadow = true;
waterfall.castShadow = true;
waterfall.update = function(time){
  this.geometry.vertices.forEach(function(_p,index){
    _p.y -= 19.81 - randomNumber(0,20,false);
    _p.x -= Math.random()*index * .0005;
    _p.z += Math.random()*index * .0005;
    if(_p.y <= -3000 - randomNumber(1,5000,false)){
      _p.y = -randomNumber(200,3300,false);
      _p.x = -1500+randomNumber(0,650);
      _p.z = 3700 + _p.x/3;
    }
  });

  //this.sortParticles = true;

  this.geometry.verticesNeedUpdate = true;
}
waterfall.receiveShadow = true;
waterfall.castShadow = true;
scene.add(waterfall);



//_________________________________ Waterfall FOAM

var wfMaterial = new THREE.PointCloudMaterial({
      color: 0xffffff,
      size: 50,
      sizeAttenuation : true,
      transparent:true,
      depthTest: true,
      depthWrite: true,
      alphaTest: 0.1,
      opacity : .5
    });
var waterfall_foam_particles = new THREE.Geometry();
for(var wf=0;wf<1000;wf++){
  var wf_y = -randomNumber(0,1000,false);  
  var wf_x = -1500+randomNumber(0,800); 
  var wf_z = 3700 + wf_x/3 + randomNumber(0,300);
  waterfall_foam_particles.vertices.push(new THREE.Vector3(wf_x,wf_y,wf_z));
  
}

var waterfall_foam = new THREE.PointCloud(waterfall_foam_particles,wfMaterial);
waterfall_foam.receiveShadow = true;
waterfall_foam.castShadow = true;
waterfall_foam.update = function(time){
  this.geometry.vertices.forEach(function(_p,index){
    _p.y -= 6 + randomNumber(0,20,false);
    _p.x += randomNumber(0,3);
    _p.z += randomNumber(0,3);
    if(_p.y <= -1000 - randomNumber(1,1500,false)){
      _p.y = -randomNumber(0,330,false);
      _p.x = -1500+randomNumber(0,800);
      _p.z = 3700 + _p.x/3 + randomNumber(0,300);
    }
  });

  //this.sortParticles = true;

  this.geometry.verticesNeedUpdate = true;
}
waterfall_foam.receiveShadow = true;
waterfall_foam.castShadow = true;
scene.add(waterfall_foam);






//______________________________  Island

var loader = new THREE.JSONLoader();
var material_options = {
  emissive : 0xffffff,
  color: 0x000000,
  opacity: .5,
  side : THREE.DoubleSide
 // transparent:true
}

var island;
loader.load(
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/61062/insel.json",
  function ( geometry, materials ) {
    var material = new THREE.MeshLambertMaterial({
      color : 0x54AD55,
      shading : THREE.FlatShading
    });
    var island = new THREE.Mesh( geometry, material );
    //island.scale.set(4000,4000,4000);
    island.position.set(0,0,0);
    island.position.y = -800;
    island.receiveShadow = true;
    island.castShadow = true;
      scene.add( island);
  
    build_Tree(island.geometry.vertices);
  }
);


loader.load(
  // resource URL
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/61062/insel-bottom.json",
  // Function when resource is loaded
  function ( geometry, materials ) {
    var material = new THREE.MeshLambertMaterial({
      color : 0xE99463,
      shininess : 1,
      shading : THREE.FlatShading
    });
    
    var island_b = new THREE.Mesh( geometry, material );
      //island_b.scale.set(4000,4000,4000);
      island_b.position.set(0,0,0);
     var edges = new THREE.EdgesHelper(island_b,0x292121);
    island_b.position.y = -800;
    scene.add(edges);
    scene.add( island_b);
  }
);

loader.load(
  // resource URL
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/61062/insel-sea.json",
  // Function when resource is loaded
  function ( geometry, materials ) {
    var material = new THREE.MeshLambertMaterial({
      color : 0x03C7FC,
      shininess : 1,
      shading : THREE.FlatShading
    });
    
    var island = new THREE.Mesh( geometry, material );
      island.position.set(0,0,0);
     var edges = new THREE.EdgesHelper(island,0x000000);
    island.position.y = -800;
    //scene.add(edges);
    scene.add(island);
  }
);
//__________________________________ AIRCRAFT
var aircraft;
loader.load(
  // resource URL
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/61062/flugzeug.json",
  // Function when resource is loaded
  function ( geometry, materials ) {
    var material = new THREE.MeshLambertMaterial({
      color : 0xff0000,
      shininess : 1,
      shading : THREE.FlatShading
    });
    var propeller = new THREE.Object3D();
    var prop_geometry = new THREE.BoxGeometry(30,200,30);
    var prop_2_geometry = new THREE.BoxGeometry(30,30,200);
    var prop_mat = new THREE.MeshBasicMaterial({
      color : 0x000000
    });
    propeller.position.set( 500, 5000, 3275 );
    
    var prop = new THREE.Mesh(prop_geometry,prop_mat);
    var prop_2 = new THREE.Mesh(prop_2_geometry,prop_mat);

      propeller.add(prop);
       propeller.add(prop_2);
       propeller.update = function(time){
          this.rotation.x += .25; 
       }
     
      aircraft = new THREE.Mesh( geometry, material );
      aircraft.position.set(0,0,0);
      aircraft.position.y = 0;
      aircraft.update = function(time){
        propeller.update(time);
        if(å.controls.type == 'fly'){
          this.position.copy( camera.position );
          this.rotation.copy( camera.rotation );
        }
        else{
          this.rotation.y += .015;      
          this.position.y += Math.sin(0.005*time) * 30;
        }
    }
     
    aircraft.add(propeller);
    //scene.add(edges);
    scene.add(aircraft);
    
    å.controls.cockpit = aircraft;
  }
);





//_____________________________ TREE

function Tree(x_,y_,z_){
  var obj = new THREE.Object3D();
  var pos = {
    x: 0,  
    y: 2.5,  
    z: 0
  }
  var stamm_geometry = new THREE.CylinderGeometry( 100, 150, 700, 12 );
  var stamm = new THREE.Mesh(stamm_geometry,wood_material);
  var leafs_geometry = new THREE.IcosahedronGeometry(350, 1);
  var leafs = new THREE.Mesh(leafs_geometry,green_material);
  leafs.position.y = 700;
  leafs.material = green_material;
  stamm.add(leafs);
  stamm.position.x = x_;
  stamm.position.y = y_;
  stamm.position.z = z_;
  
  stamm.rotation.x = Math.random()*3 * Math.PI/ 180;
  stamm.rotation.z = Math.random()*3 * Math.PI/ 180;
  return stamm;
}

function build_Tree(arr){
  var geo_ = new THREE.Geometry();
      geo_.vertices = arr;
var trees = new THREE.Object3D();
  
  for(var t=0;t<arr.length;t+=4){
    var radii_checker = pointInCircle(arr[t],{
      x:0,
      y:arr[t].y ,
      z:0
    }, 220);    
    if(radii_checker[0]){
       trees.add(new Tree(arr[t].x,arr[t].y-700,arr[t].z));
    }
  }
  scene.add(trees);
}

//______________________________ EVENTS
var fly_action = document.getElementById('fly_action');

fly_action.addEventListener('click',function(e){
  å.controls.type = 'fly';
  set_Controls('fly');
});



//_____________________________ Render
var render = function (time) {
  var delta = clock.getDelta();
  requestAnimationFrame( render ); 
  animation(time);
  
  if(å.controls.type == 'fly'){
    å.controls.obj.fly.update( delta );
  }
  renderer.render(scene, camera);
};
//______________________________ Animation
function animation(time){
   cloud_origin.update(time);
   clouds.update(time);
   rain.update(time);
   waterfall.update(time);
   waterfall_foam.update(time);
  if(typeof aircraft !== "undefined"){
    aircraft.update(time);
  }
  flash.update(time);
}
//________________________________Start scene
render(time);

//________________________________ Helper
function pointInCircle(point,target, radius) {
  var distsq = (point.x - target.x) * (point.x - target.x) + (point.y - target.y) * (point.y - target.y) + (point.z - target.z) * (point.z - target.z);
  // returns bool , distance to target origin 
  return [distsq <= radius * radius * radius,distsq];
}