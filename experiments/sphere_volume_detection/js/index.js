//________________________________  Helper
function getRandomColor() {
    var letters = '0123456789ABCDEFG'.split('');
    var color = '';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


function randNum(min,max,bool){
  var num = Math.floor(Math.random()*max) + min;
  if(bool || typeof bool == "undefined"){
num *= Math.floor(Math.random()*2) == 1 ? 1 : -1; 
  }
  return num;
}

var $fogColor = 0x00000;
var objects_to_update = [];

//________________________________ Scene
var scene = new THREE.Scene();
    //scene.fog = new THREE.FogExp2( $fogColor, 0.085 );

//________________________________ Camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    camera.position.x = -14;
    camera.position.y = 8;
    camera.position.z = 12;
    
    camera.lookAt(new THREE.Vector3(0,10,0));
 
//________________________________  Renderer
var renderer = new THREE.WebGLRenderer({ antialias: true,alpha: true }); /// { alpha: true }
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMapEnabled = true;
    // to antialias the shadow
    renderer.shadowMapType = THREE.PCFSoftShadowMap;
    //renderer.setClearColor($fogColor, 1 );
document.body.appendChild( renderer.domElement );


//________________________________  Resize
window.onresize = function(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
//________________________________ Controls

 controls = new THREE.OrbitControls( camera );
 controls.damping = 0.2;
 controls.addEventListener( 'change', render );
 //
 controls.maxPolarAngle = Math.PI/2;
 controls.target.set( 0,0,0 );
//________________________________  Light
//___  PointLight
//___  PointLight
////////////////////////
var ambient = new THREE.AmbientLight(0x666666);
scene.add(ambient);

var light = new THREE.DirectionalLight( 0xfdfdfd, 1, 1000 );
    light.shadowDarkness = .8;
light.intensity = 1;
   // light.shadowCameraVisible = true;
    light.castShadow = true;
    light.position.set( 0, 50, 0 );

//ridiculous hight shadow map
    light.shadowMapWidth = 1024 * 2; // default is 512
    light.shadowMapHeight = 1024 * 2;  // default is 512

scene.add( light );


//_______________________________ Å Options

function Å(){
  this.target = {
    x:0,
    y:0,
    z:0,
    radius : 2
  }
  this.count = 1000;
  this.bounds = {
    x : 5,
    y : 5,
    z : 5
  };
  
  this.vel = function(){
    var vel = [];
    for(var i=0;i<1000;i++){
      vel[i] = {
        x :Math.sin(i) * Math.random() * .04,
        y :Math.cos(i) * Math.random() * .04,
        z :Math.sin(i) * Math.cos(i) * Math.random() * .08
      }
    }
    return vel;
  }();
}

var å = new Å();
var geometry = new THREE.BoxGeometry( å.bounds.x*2, å.bounds.y*2, å.bounds.z*2 );
var material = new THREE.MeshLambertMaterial({
  color: 0xcccccc,
  transparent:true,
  opacity : .1
});

var cube = new THREE.Mesh( geometry, material );
var edges = new THREE.EdgesHelper( cube, 0xffffff );
edges.material.opacity = .2;
edges.material.transparent = true;
scene.add( edges );

var sphere_geometry = new THREE.SphereGeometry( å.target.radius, 12, 12 );
var sphere_material = new THREE.MeshLambertMaterial({
  color: 0xFBD143,                                         
  transparent: true,
  opacity:.1,
  emissive : 2
});

var attractor = new THREE.Mesh( sphere_geometry, sphere_material );
attractor.update = function(time){
  this.position.x = Math.sin(.0015*time) * 2.5;
  this.position.y = Math.cos(.0015*time) * 2.5;
  this.position.z = Math.sin(.0015*time) * 2.5;
  this.scale.set(å.target.radius*.75,å.target.radius*.75,å.target.radius*.75);
}
attractor.receiveShadow = true;
scene.add( attractor );

//_____________________

function MergedBall(å){
  var material_array = [];
  var material_counter = 0;
  var sphere_geometry = new THREE.SphereGeometry( .075, 1, 1 );
  var completeGeometry = new THREE.Geometry();
  var single_ball = [];
  
  for(var i=0;i<å.count;i++){
      single_ball[i] = new THREE.Mesh(sphere_geometry);
          
      var material = new THREE.MeshBasicMaterial({  
           vertexColors: THREE.FaceColors
        });
      single_ball[i].position.x = randNum(-å.bounds.x+1,å.bounds.x-1);
      single_ball[i].position.y = randNum(-å.bounds.y+1,å.bounds.y-1);
      single_ball[i].position.z = randNum(-å.bounds.z+1,å.bounds.z-1);
      single_ball[i].vel = å.vel[i];
      single_ball[i].direction = 1;
      single_ball[i].updateMatrix();
completeGeometry.merge(single_ball[i].geometry, single_ball[i].matrix, 1);
  }
  å.single = single_ball;
  
  var sphere = new THREE.Mesh(completeGeometry,material);
  var colors = [];
      sphere.geometry.faces.forEach(function(mat,i){
        mat.color = new THREE.Color(0x000000);
      });
  sphere.receiveShadow =true;
  sphere.castShadow =true;
  return sphere;
}

å.main = new MergedBall(å);

scene.add(å.main);

//________________________________ Render
var time = 0;
var render = function (time) { 
  requestAnimationFrame( render );
  attractor.update(time);
  animation(time);
  renderer.render(scene, camera);
};

//________________________________ Animation
function animation(time){
  scene.rotation.y += .004;
  
  var count_check = 0;
  var count_color = 0;
  var radius_checker;
  for(var k=0;k<å.count;k++){
     count_color += 6;
    for(var j=0;j<12;j++){
      
      var pos = å.main.geometry.vertices[count_check];
      
      pos.x += å.single[k].vel.x * å.single[k].direction;
      pos.y += å.single[k].vel.y * å.single[k].direction;
      pos.z += å.single[k].vel.z * å.single[k].direction;
      //ONLY check the last one
      if(j==11){
        if(pos.x < -å.bounds.x +.1|| pos.x >å.bounds.x-.1||
          pos.y < -å.bounds.y+.1 || pos.y > å.bounds.y-.1||
          pos.z < -å.bounds.z+.1 || pos.z > å.bounds.z-.1){
          å.single[k].direction *= (-1);
        }
      }//end of check ->11
        radius_checker = pointInCircle({
          x : pos.x,
          y : pos.y,
          z : pos.z
        },attractor.position, å.target.radius);
        if(radius_checker[0]){
          for(var i_=count_color-6;i_<count_color;i_++){
            å.main.geometry.faces[i_].color = new THREE.Color(0xFBD143);
          }
                 
        }
        else{
          for(var i_=count_color-6;i_<count_color;i_++){
            å.main.geometry.faces[i_].color = new THREE.Color(0x000000);
          }         
        }
      
      count_check++;      
      å.main.geometry.colorsNeedUpdate = true;      
      å.main.geometry.verticesNeedUpdate= true;    
      
    }
  }
  
}



//________________________________ HELPER FCTs
// Check of point is in radius
function pointInCircle(point,target, radius) {
  var distsq = (point.x - target.x) * (point.x - target.x) + (point.y - target.y) * (point.y - target.y) + (point.z - target.z) * (point.z - target.z);
  // returns bool , distance to target origin 
  return [distsq <= radius * radius * radius,distsq];
}
//////////////////////////////////////////
render(time);