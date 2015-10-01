//______________________________   Helper
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

var red_material = new THREE.MeshLambertMaterial({
	  color: 0xc7030f,
    shading:THREE.FlatShading,
    side: THREE.DoubleSide
});

function WORLD(scene){
  this.scene = scene;
  var objects_to_update = [];
  this.error = function(){
    return function(error){
        console.log(error);
    }
  }
  this.adder = function(el){
    if(typeof el.update !== "undefined"){
      objects_to_update.push(el);
    }
    else{
      this.error(el+', is not animated');
    }
  }
  
  this.add = function(obj,animated){
    var that = this;
    if(obj.type === "Object3D"){
      obj.children.forEach(function(el,index){
        if(el.type === "Object3D"){
        el.children.forEach(function(el,index){
          that.adder(el);
        });
        }
        else{
          that.adder(el);
        }
      });
    }
    else{
      that.adder(obj);
    }
    this.scene.add(obj);
  }
                 
  this.update = function(){
    objects_to_update.forEach(function(el,index){
        el.update();
    });
  }
}

function rand_num(min,max,bool){
 
  var num = Math.floor(Math.random()*max) + min; // this will get a number between 1 and 99;
if(bool || typeof bool === "undefined"){
  num *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
}
  
  return num;
}

function getRandomColor() {
    var letters = '0123456789ABCDEFG'.split('');
    var color = '';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


var $fogColor = 0x73dbff;

//______________________________   Scene
var scene = new THREE.Scene();
var world = new WORLD(scene);

    //scene.fog = new THREE.FogExp2( $fogColor, 0.085 );

//______________________________   Camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    camera.position.x = -10;
    camera.position.y = 2.6;
    camera.position.z = 5.8;
    camera.lookAt(new THREE.Vector3(0,2,0));
 
//______________________________   Renderer
var renderer = new THREE.WebGLRenderer({ antialias: true }); /// { alpha: true }
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMapEnabled = true;
    // to antialias the shadow
    renderer.shadowMapType = THREE.PCFSoftShadowMap;
    renderer.setClearColor($fogColor, 1 );
document.body.appendChild( renderer.domElement );


//______________________________   Resize
window.onresize = function(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

//______________________________   Controls

 controls = new THREE.OrbitControls( camera );
 controls.damping = 0.2;
  controls.minPolarAngle = 0; // radians
controls.maxPolarAngle = Math.PI/2; 
 controls.addEventListener( 'change', render );

//______________________________    Light

var ambient = new THREE.AmbientLight(0x000011);
scene.add(ambient);

var light = new THREE.DirectionalLight( 0xfdfdfd, 1.5 );
light.position.x = -500;
light.position.y = 500;
light.position.z = 500;
light.shadowCameraVisible = false;
light.castShadow = true;
light.shadowCameraNear = true;

light.shadowMapWidth = 1024 ;
light.shadowMapHeight = 1024 ;

scene.add( light );
//_______________________________ Floor
function terrain_obj(){
  this.terrain_geometry =  new THREE.BoxGeometry(40,60, 3,30,30,30);
  this.terrain_material = green_material;
  this.generate = function(){
      this.count =0;
  
    
   this.terrain =  new THREE.Mesh(this.terrain_geometry,this.terrain_material);
   this.terrain.rotation.x = -Math.PI / 2;    
   this.terrain.rotation.z = -Math.PI / 2;
   this.terrain.position.x = 12;
   this.terrain.position.y = -2;
   this.terrain.receiveShadow = true;
   this.terrain.castShadow = true;
    
   this.terrain.geometry.vertices.forEach(function(p,index){
     if(p.z>1.3){
       p.z += rand_num(1,2) * .1;
     }
   });

  var edges = new THREE.EdgesHelper(this.terrain, 0x388f4e );
  scene.add( edges );
   scene.add(this.terrain);
   return this;
  };
  this.generate();
}
var terrain_bottom = terrain_obj()

//_______________________________ Zyinder


function track(){
  var geometry = new THREE.BoxGeometry(60,.2,.2);
  var material = new THREE.MeshLambertMaterial({
    color:0x333333
  });
  var track = new THREE.Mesh(geometry,material);
  track.receiveShadow = true;
  track.castShadow = true;
  track.position.x = 12;
  return track;
}

function Wood(){
  var wooden = new THREE.Geometry();
  var geometry = new THREE.BoxGeometry(.5,.3,4);
  var material = wood_material;
  
  for(var i=0;i<50;i++){
    geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 1.2,0,0) );
    wooden.merge(geometry);
  }
  
  var wood = new THREE.Mesh(wooden,material);
  wood.position.x = -18;
  wood.position.y = -.3;
  wood.receiveShadow = true;
  wood.castShadow = true;
  return wood;

}
  

var wood = Wood();
world.add(wood);

var track_left = track();
    track_left.position.z = -1.2;
    track_left.position.y = -.08;
var track_right = track();
    track_right.position.z = 1.2;
    track_right.position.y = -.08;
world.add(track_left);
world.add(track_right);

function mesh_obj(type,obj) {
  if(typeof obj === "undefined"){
    obj = {}
    obj.x = 0;
    obj.y = 0;
    obj.z = 0;
  }
  switch(type){
    case "wheel" :
      this.geometry =  new THREE.CylinderGeometry( .5, .5, .25, 32 );
    break;
    case "box" :
      this.geometry = new THREE.BoxGeometry(1,1,1);
    break;
    case "tube" :
      this.geometry = new THREE.TorusGeometry( .2, .05, 12,6);
      break;
    case "sphere":
      this.geometry = new THREE.SphereGeometry( 1, 12,12 );
      break;
    case "iso":
      this.geometry = new THREE.IcosahedronGeometry(2, 1);
      break;
  }
  this.material = new THREE.MeshLambertMaterial({
      color: 0x444444,
      shading : THREE.FlatShading
    });
var wheel = new THREE.Mesh( this.geometry, this.material );
    wheel.rotation.x = 90 * Math.PI / 180;
  
    wheel.position.x = obj.x;
    wheel.position.y = obj.y;
    wheel.position.z = obj.z;
    
    wheel.receiveShadow = true;
    wheel.castShadow = true;
    
    wheel.update = function(){
      this.rotation.y += .1;
    }
  
  return wheel;
}



var lok = new THREE.Object3D();
//___________________________________
var wheels = new THREE.Object3D();
//__________________________________
var wheel_1_deko = mesh_obj('tube');
    wheel_1_deko.translateZ(-.1);

var wheel_1a_deko = mesh_obj('tube');
    wheel_1a_deko.translateZ(-.1);

var wheel_2_deko = mesh_obj('tube');
    wheel_2_deko.translateZ(-.1);

var wheel_2a_deko = mesh_obj('tube');
    wheel_2a_deko.translateZ(-.1);

var wheel_3_deko = mesh_obj('tube');
    wheel_3_deko.translateZ(.1);

var wheel_3a_deko = mesh_obj('tube');
    wheel_3a_deko.translateZ(-.1);

var wheel_4_deko = mesh_obj('tube');
    wheel_4_deko.translateZ(.1);

var wheel_4a_deko = mesh_obj('tube');
    wheel_4a_deko.translateZ(.1);

var pos = {
  x :-2,
  y : 0,
  z : 1.2
}
var wheel_1 = mesh_obj('wheel',pos);
    pos.x = -.8;
var wheel_1a = mesh_obj('wheel',pos);
    pos.x = 3;
var wheel_2 = mesh_obj('wheel',pos);
    pos.x = .8;
var wheel_2a = mesh_obj('wheel',pos);

    pos.x = -2;
    pos.z = -1.2;
var wheel_3 = mesh_obj('wheel',pos);
    pos.x = -.8;
var wheel_3a = mesh_obj('wheel',pos);
    pos.x = 3;
var wheel_4 = mesh_obj('wheel',pos);
    pos.x = .8;
var wheel_4a = mesh_obj('wheel',pos);


wheel_1.add(wheel_1_deko);
wheel_1a.add(wheel_1a_deko);

wheel_2.add(wheel_2_deko);
wheel_2a.add(wheel_2_deko);

wheel_3.add(wheel_3_deko);
wheel_3a.add(wheel_3a_deko);

wheel_4.add(wheel_4_deko);
wheel_4a.add(wheel_4a_deko);

wheel_2.scale.x = 2;
wheel_2.scale.z = 2;
wheel_2.position.y = .5;

wheel_2a.scale.x = 2;
wheel_2a.scale.z = 2;
wheel_2a.position.y = .5;

wheel_4.scale.x = 2;
wheel_4.scale.z = 2;
wheel_4.position.y = .5;
wheel_4a.scale.x = 2;
wheel_4a.scale.z = 2;
wheel_4a.position.y = .5;

wheels.add(wheel_1);
wheels.add(wheel_1a);

wheels.add(wheel_2);
wheels.add(wheel_2a);

wheels.add(wheel_3);
wheels.add(wheel_3a);

wheels.add(wheel_4);
wheels.add(wheel_4a);

lok.add(wheels);

pos.x = -3;
pos.y = .3;
pos.z = .8;
  var front_box_left = mesh_obj('box',pos);
    front_box_left.scale.set(.1,1.6,1.2);
    front_box_left.rotation.z = -25*Math.PI / 180;
    front_box_left.geometry.vertices[3].x += 2;
    front_box_left.geometry.vertices[6].x += 2;
    front_box_left.geometry.vertices[7].x -= 5;
    front_box_left.geometry.vertices[7].y -= .2;
    front_box_left.update = function(){}
    
pos.z = -.8;
var front_box_right = mesh_obj('box',pos);
    front_box_right.scale.set(.1,1.6,1.2);
    front_box_right.rotation.z = 25*Math.PI / 180;
    front_box_right.geometry.vertices[4].x += 2;
    front_box_right.geometry.vertices[1].x += 2;
    front_box_right.geometry.vertices[5].x -= 5;
    front_box_right.geometry.vertices[5].y += .2;
    front_box_right.update = function(){}
lok.add(front_box_left);
lok.add(front_box_right);
//___________________________________
var line_material = new THREE.LineBasicMaterial({
	color: 0x000000,
  linewidth: 5,
  shading : THREE.FlatShading
});

var line_geometry = new THREE.Geometry();
function transform_vec(obj){
  var x_ = obj.x;
  var y_ = obj.y;
  var z_ = obj.z + .15;
  var vector = new THREE.Vector3(x_,y_,z_);
 
  return vector;
}

function get_absolutePosition(obj,index){ 
  if(typeof index === "undefined"){
    index = 0;
  }
  obj.updateMatrixWorld();
  var vector = obj.geometry.vertices[index].clone();
  vector.applyMatrix4( obj.matrixWorld );
  
  return vector;
}

var vec_0 = transform_vec(get_absolutePosition(wheel_3_deko),64);
var vec_1 = transform_vec(get_absolutePosition(wheel_2_deko,64));
var vec_2 = transform_vec(get_absolutePosition(wheel_1a_deko),64);
var vec_3 = transform_vec(get_absolutePosition(wheel_2a_deko,64));

line_geometry.vertices.push(
  vec_0,
	vec_1,
	vec_2,
	vec_3
);
var line = new THREE.Line( line_geometry, line_material );

line.update = function(){
  
  var vertix = [];
  var vec_1 = transform_vec(get_absolutePosition(wheel_2_deko),64);
  var vec_0 = new THREE.Vector3(vec_1.x + 2.3,vec_1.y,1.4);
  var vec_2 = transform_vec(get_absolutePosition(wheel_1a_deko),64);
  var vec_3 = transform_vec(get_absolutePosition(wheel_1_deko),64);
  
  
  vertix.push(
    vec_0,
    vec_1,
    vec_2,
    vec_3
  );
  this.updateMatrixWorld();
  
  this.geometry.vertices = vertix;
  this.geometry.verticesNeedUpdate = true;
}

var back_line = line.clone();
back_line.position.z = -2.9;
world.add(line);
world.add(back_line);


//___________________________________
pos.x = .75;
pos.y = 0.5;
pos.z = 0;
var box = mesh_obj('box',pos);
box.scale.x = 7;
box.scale.y = 1.9;
box.scale.z = 1;
box.update = function(){};

pos.x = 2.4;
pos.y = 2;
pos.z = 0.8;
lok.add(box);
var box = mesh_obj('box',pos);
box.scale.x = .1;
box.scale.y = .1;
box.scale.z = 3;
box.update = function(){
};
var t_r = box.clone();
    t_r.position.z = -.8;

var t_v = box.clone();
    t_v.position.x = 3.65;
    t_v.position.z = -.8;
var t_l = box.clone();
    t_l.position.x = 3.65;
    t_l.position.z = 0.8;

lok.add(box);
lok.add(t_r);
lok.add(t_l);
lok.add(t_v);

pos.x = 3;
pos.y = 3.6;
pos.z = 0;
var roof = mesh_obj('box',pos);
roof.scale.set(1.8,1.8,.3);
roof.update = function(){}
lok.add(roof);

//___________________________________
pos.x = -2.2;
pos.y = 1.3;
pos.z = 0;
var box_tip = mesh_obj('sphere',pos);

pos.x = 0;
pos.y = 1.3;
pos.z = 0;
var tip = mesh_obj('wheel',pos);
tip.rotation.z = 90 * Math.PI / 180;
tip.scale.y = 20;
tip.scale.x = 2;
tip.scale.z = 2;
tip.update = function(){}
box_tip.update = function(){}

//______________________________________ Cabine
pos.x = -1.5;
pos.y = .9;
pos.z = 0;

var cabine = mesh_obj('box',pos);
cabine.material = red_material;
cabine.scale.set(2,2.5,.3);
cabine.update = function(){}
lok.add(cabine);

pos.x = 1.3;
pos.y = 1.7;
var back_cabine = mesh_obj('box',pos);
back_cabine.material = red_material;
back_cabine.scale.set(2.2,2.5,.3);
back_cabine.update = function(){}
lok.add(back_cabine);

pos.x = - 0.15;
pos.y = 1.3;
pos.z = 0;
var angle_cabine = mesh_obj('box',pos);
 angle_cabine.scale.set(1.3,2.5,.3);
 angle_cabine.rotation.y = 45 * Math.PI /180;
 angle_cabine.update = function(){}
 angle_cabine.material = red_material;
lok.add( angle_cabine);


pos.x = 3;
var main_l_cabine = mesh_obj('box',pos);
 main_l_cabine.scale.set(1.4,.2,2.5);
 main_l_cabine.rotation.y = 90 * Math.PI /180;
 main_l_cabine.rotation.x = 90 * Math.PI /180;
 main_l_cabine.position.z = .8;
 main_l_cabine.update = function(){}
lok.add(main_l_cabine);

var main_r_cabine =main_l_cabine.clone();
    main_r_cabine.position.z = -.8;

     //main_r_cabine.scale.set(1.4,.2,2.5);
     //main_r_cabine.rotation.y = 90 * Math.PI /180;
     //main_r_cabine.rotation.x = 90 * Math.PI /180;
lok.add(main_r_cabine);

pos.x = 3.2;
pos.y = 1.7;
pos.z = -.8;

var back_door_left = mesh_obj('box',pos);
    back_door_left.scale.set(.1,.8,.6);
    back_door_left.translateX(1);
    back_door_left.direction = 1;
    back_door_left.update = function(){
      if(this.rotation.z > 0 || this.rotation.z < -1 ){
        this.direction *= (-1);
      }
      this.rotation.z += .05 * this.direction;
    };
    back_door_left.updateMatrix();
    back_door_left.geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0,.5,0));

lok.add(back_door_left);

pos.x = 3.2;
pos.y = 1.7;
pos.z = .8;
var back_door_right = mesh_obj('box',pos);
    back_door_right.scale.set(.1,.8,.6);
    back_door_right.translateX(1);
    back_door_right.direction = 1;
    back_door_right.rotation.z = -2;
    back_door_right.update = function(){
      if(this.rotation.z > -2 || this.rotation.z < -3){
        this.direction *= (-1);
      }
      this.rotation.z -= .05 * this.direction;
    };
    back_door_right.updateMatrix();
    back_door_right.geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0,.5,0));

lok.add(back_door_right);
//______________________________________ Cabine

wheels.add(box_tip);
wheels.add(tip);



pos.x = -2;
pos.y = 2.5;
pos.z = 0;

var smoker = mesh_obj('wheel',pos);
pos.x = -2;
pos.y = 4;
pos.z = 0;
var smoker_deko = mesh_obj('wheel',pos);
pos.x = 0;
pos.y = 2.5;
pos.z = 0;
var smoker_2_deko = mesh_obj('wheel',pos);
    smoker_2_deko.rotation.x = Math.PI / 180;
    smoker_2_deko.scale.set(.8,4,.8);

smoker.rotation.x = Math.PI / 180;
smoker.scale.set(1,10,1);
smoker.direction = 1;
smoker.update = function(){
}
smoker_2_deko.update = function(){
}

smoker_deko.scale.set(1.5,4,1.5);
smoker_deko.rotation.x = Math.PI / 180;
smoker_deko.direction = 1;
smoker_deko.material = red_material;
smoker_deko.update= function(){
  if(this.position.y > 4 || this.position.y < 3.5){
    this.direction *= (-1);
  }
  this.position.y += .04 * this.direction;
}
//__________________________________

;
var particles = new THREE.Geometry();

var pMaterial = new THREE.PointCloudMaterial({
      color: 0x333333,
      size: .1,
      transparent:true,
      opacity:.25  
    });

var particles_p = []; 
for(var i=0;i<1000;i++){
  var x = -2 +Math.sin(i)* Math.random() * 0.5;
  var y =  5 + Math.cos(i)* Math.random()  * 0.5;
  var z =  0 + Math.cos(i)* Math.random() * 0.5;
particles_p.push(new THREE.Vector3(x,y,z));
}

particles.vertices = particles_p;


var particleSystem = new THREE.PointCloud(particles,pMaterial);
particleSystem.update = function(){
  var particles_p = []; 
  this.material.size += .02;
  for(var i=0;i<1000;i++){
    this.geometry.vertices[i].x +=  Math.random()*0.2;
    this.geometry.vertices[i].y +=  Math.random()*0.2;
    this.geometry.vertices[i].z +=  Math.random()*0.2 * (Math.floor(Math.random()*2) == 1 ? 1 : -1);
    
    if(this.geometry.vertices[i].y > 10 + (Math.random()*5)){
      this.geometry.vertices[i].x = lok.position.x - 2;
      this.geometry.vertices[i].y = lok.position.y +4;
      this.geometry.vertices[i].z = lok.position.z;
      this.material.size = 1;
    }
  }
  this.geometry.verticesNeedUpdate = true;
  
}
world.add(particleSystem);

lok.add(smoker);
lok.add(smoker_deko);
lok.add(smoker_2_deko);

lok.position.x = -2;
lok.position.y = .5;
lok.direction = {
  x : 1,
  y : 1,
  z : 1
};
world.add(lok);


//__________________________________

var hanger_object = new THREE.Object3D();
pos.x = 8;
pos.y = 1;
pos.z = 0;
var hanger = mesh_obj('box',pos);
var hanger_bottom = hanger.clone();
hanger.scale.set(5.5,3.5,.1);
hanger_bottom.scale.set(5.5,3,.1);

var hanger_deko =[]; 
var hanger_deko_2 =[];
var hanger_deko_geometry = new THREE.Geometry();
for(var i=0;i<10;i++){
  pos.x = 5.5+ .55 * i;
  pos.y = 2.2;
  pos.z = 1.5;
  hanger_deko[i] = mesh_obj('box',pos);
  hanger_deko[i].scale.set(.5,.1,2.5);
  
  hanger_deko_2[i] = hanger_deko[i].clone();
  hanger_deko_2[i].position.z = -1.5;
 
  hanger_object.add(hanger_deko[i]);
  hanger_object.add(hanger_deko_2[i]);
}
var hanger_front_deko =[]; 
var hanger_back_deko_2 =[];
for(var i=0;i<7;i++){
  pos.x = 5.3;
  pos.y = 2.2;
  pos.z = -1.3 + .445 * i;
  hanger_front_deko[i] = mesh_obj('box',pos);
  hanger_front_deko[i].scale.set(.4,.1,2.5);
   hanger_front_deko[i].rotation.z = 90 * Math.PI/180;
  hanger_back_deko_2[i] =       hanger_front_deko[i].clone();
  hanger_back_deko_2[i].position.x = 10.7;
  hanger_object.add(hanger_front_deko[i]);
  hanger_object.add(hanger_back_deko_2[i]);
}

hanger_object.add(hanger);

hanger_bottom.scale.set(5,1.8,1);
hanger_bottom.position.y = .5;
hanger_bottom.position.z = 0;


hanger_object.position.x = -2;
hanger_object.add(hanger_bottom);

pos.x = 5;
pos.y = .5;
pos.z = 0;
var koppel = mesh_obj('box',pos);
    koppel.scale.set(3,.3,.3);

hanger_object.add(koppel);
hanger_object.position.y = .75;


pos.x = 6;
pos.y = 0;
pos.z = 1.2;
var hanger_wheel_front_left = mesh_obj('wheel',pos);

hanger_wheel_front_left.scale.set(1.4,1,1.4);
hanger_object.add(hanger_wheel_front_left);

var hanger_wheel_front_right =hanger_wheel_front_left.clone();

hanger_wheel_front_right.position.z = -1.2;
hanger_object.add(hanger_wheel_front_right);

var hanger_wheel_back_right =hanger_wheel_front_left.clone();
hanger_wheel_back_right.position.z = -1.2;
hanger_wheel_back_right.position.x = 10;
hanger_object.add(hanger_wheel_back_right);

var hanger_wheel_back_left =hanger_wheel_front_left.clone();
//hanger_wheel_back_left.position.z = -1.2;
hanger_wheel_back_left.position.x = 10;
hanger_object.add(hanger_wheel_back_left);

hanger_object.children.forEach(function(el,index){
  el.update = function(){}
});

hanger_wheel_front_left.update =function() {
  this.rotation.y += .1;
}

hanger_wheel_front_right.update =function() {
  this.rotation.y += .1;
}
 
hanger_wheel_back_left.update =function() {
  this.rotation.y += .1;
}

hanger_wheel_back_right.update = function() {
  this.rotation.y += .1;
}

world.add(hanger_object);
//__________________________________

function Tree(){
  var obj = new THREE.Object3D();
  var pos = {
    x: 0,  
    y: 2.5,  
    z: 0
  }
  var stamm = mesh_obj('wheel',pos);
  stamm.material = wood_material;
  pos.y = 1.5;
  var leafs = mesh_obj('iso',pos);
  leafs.material = green_material;
  stamm.position.y = 1;
  leafs.position.y = 4;
  stamm.position.z = 0;
  stamm.scale.set(1,10,1);
  stamm.material.transparent = true;
  leafs.material.transparent = true;
  stamm.rotation.z = Math.PI/180;
  stamm.rotation.x = Math.PI/180;
  //stamm.updateMatrix();
  leafs.update = function(){
    
  }
  //stamm.geometry.applyMatrix( stamm.matrix );
  obj.add(leafs);
  stamm.update = function(){
    
  }
  
  obj.add(stamm);
  return obj;
}

var tree_array = [];
for(var i=0;i<12;i++){ 
tree_array[i] = new Tree();
  tree_array[i].position.x = -17 + i * 5 + rand_num(1,2);
  tree_array[i].position.z = rand_num(4,15);
  tree_array[i].rotation.x = rand_num(1,15) * Math.PI / 180;
  tree_array[i].rotation.y = rand_num(1,15) * Math.PI / 180;
  tree_array[i].rotation.z = rand_num(1,15) * Math.PI / 180;
 var rand = rand_num(0.8,1.6,false); tree_array[i].scale.set(rand,rand,rand);
  
  world.add(tree_array[i]);
}

//______________________________   Render
var time = 0;
var render = function (time) { 
  requestAnimationFrame( render ); 
  animation(time); 
 
  renderer.render(scene, camera);
};

var camera_helper_geometry = new THREE.BoxGeometry(50,50,50);
var camera_helper_material = new THREE.MeshBasicMaterial(0xffffff);
var camera_helper = new THREE.Mesh(camera_helper_geometry,camera_helper_material)
scene.add(camera_helper);
camera_helper.visible = false;
camera_helper.add(camera);
//______________________________    Animation

function animation(time){
  //camera_helper.rotation.y -= .001;
  
  
  lok.position.x -= .2;
  hanger_object.position.x -= .2;
  
  if(lok.position.x < -15){
    lok.position.x = 50;
    hanger_object.position.x = 50;
  }  
  if(lok.rotation.y > 0.05 || lok.rotation.y < -0){
    lok.direction.y *= (-1);
  }
  if(lok.rotation.z > 0.05 || lok.rotation.z < -0.05){
    lok.direction.z *= (-1);
  }
  
  world.update();
}


//______________________________    Start scene

render(time);