// NOTE: å Object is loaded 
// More info on http://codepen.io/SaschaSigl/blog/a
//////////////////////////////////////////////////////
//// User Option
//////////////////////////////////////////////////////
var userOpts  = {
  ready       : false,
  play        : false,
  range   : 1,
  duration  : 2500,
  delay   : 200,
  easing    : 'Elastic.EaseInOut',
  camera : {
    x : 0,
    y : 20,
    z : 50,
    target : {
     x : 0,
     y : 10,
     z : -40,
   },
   orbit : {
    rotateSpeed : 0.5,
    keyPanSpeed : 10,
    maxPolarAngle : Math.PI/2,
    center : new THREE.Vector3(0,0,0)
  },
  fly : {
    movementSpeed : 1,
    rollSpeed : 0.01,
    autoForward : false,
    dragToLook : true
  }
},
};
//////////////////////////////////////////////////////
////Loading Stack
//////////////////////////////////////////////////////
var models_to_update = [];
function loading_stack(audioData){
  var terrain = new terrain_obj(audioData,10);
  models_to_update = [terrain]
}
//////////////////////////////////////////////////////
//// Audio Data
//////////////////////////////////////////////////////

var audioData = {}

$.ajax({
  dataType: "json",
  url: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/61062/audioData_4.json",
  success: function(data){

  userOpts.ready = true;

  å.store_data(data);

  // Array[1468];  
  loading_stack(å);
  
  }
});


var main_color = 0x000000;
var canvas_height = window.innerHeight;
var canvas_width = window.innerWidth;
//////////////////////////////////////////
    //   Scene
//////////////////////////////////////////
var scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( main_color, 0.005 );
//////////////////////////////////////////
    //   Camera
//////////////////////////////////////////
var camera = new THREE.PerspectiveCamera( 55, canvas_width/canvas_height, 0.1, 1000 );
    camera.lookAt(new THREE.Vector3(0,0,0));
    camera.position.set(80,10,20);

//////////////////////////////////////////
    //   Renderer
//////////////////////////////////////////
var renderer = new THREE.WebGLRenderer({ alpha: true }); /// { alpha: true }
    renderer.setSize( canvas_width, canvas_height );
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;
    renderer.setClearColor(main_color,1);
    renderer.domElement.className = 'header_canvas';
$('header').append( renderer.domElement );

//////////////////////////////////////////
    //   Resize
//////////////////////////////////////////
window.onresize = function(){
  canvas_height = window.innerHeight;
  canvas_width = window.innerWidth;
  camera.aspect = canvas_width / canvas_height;
  camera.updateProjectionMatrix();
  renderer.setSize( canvas_width, canvas_height );
}
//////////////////////////////////////////
    //   Controls
//////////////////////////////////////////
  controls = new THREE.OrbitControls( camera );
  controls.damping = 0.2;
  controls.rotateSpeed = userOpts.camera.orbit.rotateSpeed;
  controls.keyPanSpeed = userOpts.camera.orbit.keyPanSpeed;
  controls.maxPolarAngle = Math.PI/2;
  //controls.minPolarAngle = 1;
  controls.minDistance = 10;
  controls.maxDistance = 400;
//////////////////////////////////////////
    //    Light
//////////////////////////////////////////
var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set( 0, 100, 100 );
    spotLight.intensity = 1;
    spotLight.castShadow = true;
    scene.add(spotLight);

//////////////////////////////////////////
    //    Cubes
//////////////////////////////////////////

function terrain_obj(data,count){
  
  data.stripes(count);
  this.terrain_geometry =  new THREE.PlaneGeometry(100, å.data.length * 1.5, 63,å.data.length);
  this.terrain_material = new THREE.MeshBasicMaterial({
    color: 0xffffff
  });
  this.terrain_wire_material = new THREE.MeshBasicMaterial({
    color: 0x000000,
    lineWidth:2,
    wireframe: true
  });
  this.total = 0;
  this.stripe_count = count;
  this.color_count = 0;
  this.set_vertices = true;
  this.colors = [];
  this.terrain_wire = null;
  this.generate = function(){
   
    this.stripes = data.get_next_stripe();
    if(this.stripes){
      for(var i=0;i<this.stripes.length;i++){
        for(var j=32;j>0;j--){
          this.total++;
          this.terrain_geometry.vertices[this.total].z = this.stripes[i][j] * .05;
        }       
        for(var k=0;k<32;k++){
          this.total++;
           this.terrain_geometry.vertices[this.total].z = this.stripes[i][k] * .05;
        }
      }
      this.generate();
    }
    else{
      this.terrain =  new THREE.Mesh(this.terrain_geometry,this.terrain_material);
      this.terrain_wire =  new THREE.Mesh(this.terrain_geometry.clone(),this.terrain_wire_material);
      this.terrain.rotation.x = -Math.PI / 2;
      this.terrain.rotation.z = -Math.PI / 2;
      this.terrain.scale.set(.8,.8,.8);
      this.terrain_wire.scale.set(.8,.8,.8);
      this.terrain_wire.rotation.x = -Math.PI / 2;
      this.terrain_wire.rotation.z = -Math.PI / 2;
      
      this.terrain_wire.position.y = .01;
      
      this.terrain.position.x = 90;
      this.terrain_wire.position.x = 90;
      scene.add(this.terrain,this.terrain_wire);
      return this;
    }
  };

  this.update = function(){   
  };
  this.generate();
  return this;
}
//////////////////////////////////////////
    //   Floor
//////////////////////////////////////////
var plane_options = {
  width : window.innerWidth,
  height : window.innerHeight,
  position : {
    x : 0,
    y : .25,
    z : 0
  }
}
var $phongMaterialOptions = {
  color : 0x000000
}

var plane_geometry = new THREE.PlaneBufferGeometry( plane_options.width, plane_options.height, 32 );
var plane_material = new THREE.MeshBasicMaterial($phongMaterialOptions); 
var plane = new THREE.Mesh( plane_geometry, plane_material ); 
  plane.rotation.x = -Math.PI/2;
  plane.position.x = plane_options.position.x;
  plane.position.y = plane_options.position.y;
  plane.position.z = plane_options.position.z;
  plane.receiveShadow = true;
  scene.add( plane );
//////////////////////////////////////////
    //   Render
//////////////////////////////////////////
var render = function () { 
  requestAnimationFrame( render ); 
  animation();
  controls.update();
  renderer.render(scene, camera);
};
//////////////////////////////////////////
    //    Animation
//////////////////////////////////////////
function animation(){
	scene.rotation.y += .0001;
}
//////////////////////////////////////////
    //    Start scene
//////////////////////////////////////////
render();