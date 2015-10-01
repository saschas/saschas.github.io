//////////////////////////////////////////
    //   Helper
//////////////////////////////////////////
function getRandomColor() {
    var letters = '0123456789ABCDEFG'.split('');
    var color = '';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getIndex(array, key, value) {
  for (var i = 0; i < array.length; i++) {
    if (array[i][key] == value) {
      return i;
    }
  }
  return null;
}

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};



//_________________________________________
var $fogColor = 0x333333;

var clickable = [];
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var offset = new THREE.Vector3();
var INTERSECTED, SELECTED;
//////////////////////////////////////////
    //   Scene
//////////////////////////////////////////
var scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( $fogColor, 0.005 );

//////////////////////////////////////////
    //   Camera
//////////////////////////////////////////
var camera = new THREE.PerspectiveCamera( 105, window.innerWidth/window.innerHeight, 0.1, 1000 );
    camera.position.z = 50;
    camera.position.y = 50;
    camera.lookAt(new THREE.Vector3(0,25,-50));
    camera.updateProjectionMatrix();
//////////////////////////////////////////
    //   Renderer
//////////////////////////////////////////
var renderer = new THREE.WebGLRenderer({ antialias: true }); /// { alpha: true }
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMapEnabled = true;
    // to antialias the shadow
    renderer.shadowMapType = THREE.PCFSoftShadowMap;
    renderer.setClearColor($fogColor, 1 );
renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);
document.body.appendChild( renderer.domElement );


//////////////////////////////////////////
    //   Resize
//////////////////////////////////////////
window.onresize = function(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
//////////////////////////////////////////
    //   Controls
//////////////////////////////////////////

 controls = new THREE.OrbitControls( camera );
 controls.damping = 0.2;
 //
 controls.maxPolarAngle = Math.PI/2;
  controls.center = new THREE.Vector3(0,25,-50);
  controls.target = new THREE.Vector3(0,25,-50);
 controls.addEventListener( 'change', render );

//////////////////////////////////////////
    //    Light
//////////////////////////////////////////
////////////////////////
    //    PointLight
////////////////////////

var light = new THREE.DirectionalLight( 0xffffff, 1, 1000 );
    light.shadowDarkness = .8;
   // light.shadowCameraVisible = true;
    light.castShadow = true;
    light.intensity = 1.5;
    light.position.set( 0, 500, 0 );

//ridiculous hight shadow map
    light.shadowMapWidth = 1024 * 2; // default is 512
    light.shadowMapHeight = 1024 * 2;  // default is 512

var front_light  = light.clone();
front_light.position.z = 1500;
front_light.position.y = 500;
front_light.intensity = 5;
scene.add( light );
scene.add( front_light );
//___________________________________________ helper
var plane = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(2000, 2000, 8, 8),
  new THREE.MeshBasicMaterial({
    color: 0x000000,
    opacity: 0.25,
    transparent: true
  })
);
plane.visible = false;
scene.add(plane);
//_____________________________ Sphere


//////////////////////////////////////////
    //    Floor Geometry
//////////////////////////////////////////
var geometry = new THREE.PlaneBufferGeometry( 1000, 1000, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: $fogColor} );
var floor = new THREE.Mesh( geometry, material );
    floor.receiveShadow = true;
    floor.material.side = THREE.DoubleSide;
    floor.rotation.x = Math.PI / 2;
    floor.position.y =  -1;
    scene.add( floor );

//////////////////////////////////////////
    //    Background Geometry
//////////////////////////////////////////

var box = new THREE.BoxGeometry(10,10,10);
var background  = new THREE.Object3D();
var base_material = new THREE.MeshBasicMaterial({
  color: 0x666666,
  shading : THREE.FlatShading
});

function Tile(pos) {
var cube = new THREE.Mesh( box, base_material);
    cube.receiveShadow = true;
    cube.castShadow = true;
    cube.position.x = pos.x;
    cube.position.y = pos.y;
    cube.position.z = pos.z;
    edges_tile = new THREE.EdgesHelper( cube, 0xcccccc );
    scene.add( edges_tile );
  return cube;
}
for(var j=0;j<10;j++){
  for(var i=0;i<10;i++){
    var single_tile = new Tile({
      x : i * 10.25,
      y : j * 10.25,
      z : -50
    });
    background.add(single_tile);
  }
}

background.position.x = -50;
background.position.z = -70;


var left_bg = background.clone();
    left_bg.rotation.y = -90 * Math.PI / 180;
    
var right_bg = background.clone();
    right_bg.rotation.y = -90 * Math.PI / 180;
    right_bg.position.x = 50;
background.add(left_bg);
background.add(right_bg);

scene.add(background);
    //    Bars
////////////////////////

function Fireball(){

var box = new THREE.BoxGeometry(5,5,5);
var hue = 'rgb(' + (Math.floor(Math.random() * 1)+ 100) + ',' + (Math.floor(Math.random() * 1)+ 10) + ',' + (Math.floor(Math.random() * 256)+ 100) + ')';
 var base_material = new THREE.MeshLambertMaterial({color: hue });
  var height = Math.random();
  var cube = new THREE.Mesh( box, base_material);
      cube.receiveShadow = true;
      cube.castShadow = true;
      cube.fire = false;
      cube.position.set(0,0,-50);
      cube.airtime = (Math.floor(Math.random() * 51) + 20);
      cube.vel = {
        x : (Math.floor(Math.random() * 21) - 10) *.01,
        y : (Math.floor(Math.random() * 51) + 20) *.01, // speed
        z : (Math.floor(Math.random() * 21) - 10) *.01,
      }
    //_______ firework
      cube.firework = function(pos){
        var that = this;
        this.fire = true;
        this.visible = false;
        var firework = new THREE.Object3D();
        for(var i= 0;i<50;i++){
          var cube = new THREE.Mesh( box, base_material);
          cube.scale.set(.5,.5,.5);
              cube.vel = {
                x : (Math.floor(Math.random() * 21) - 10) *.1,
                y : (Math.floor(Math.random() * 21) - 10) *.1, // speed
                z : (Math.floor(Math.random() * 21) - 10) *.1,
              }
          var rand = {
            x : (Math.floor(Math.random() * 21) - 10) *.05,
            y : (Math.floor(Math.random() * 21) - 10) *.05,
            z : (Math.floor(Math.random() * 21) - 10) *.05
          }
          cube.random = rand;
          cube.receiveShadow = true;
          cube.castShadow = true;
          cube.position.set(pos.x,pos.y,pos.z);
          
          cube.update = function(time){
            
          
            edges_fire.material.opacity -= .001;
            edges_fire.material.transparent = true;
            this.position.x += this.random.x * this.vel.x;
            this.position.y += this.random.y * this.vel.y + (0.0981 * time * .0001);
            
            this.position.z += this.random.z * this.vel.z;
              
            this.rotation.x += this.random.x; 
            this.rotation.y += this.random.y;
            this.rotation.z += this.random.z; 
            
            this.scale.x -= .02;
            this.scale.y -= .02;
            this.scale.z -= .02;
                        
            if(this.position.y <=0){
              this.position.y =0;
            }
            if(this.scale.x <0){
              that.remove();
            }
          }
          firework.add(cube);
        }
        scene.add(firework);
        return firework;
      }
      var single_firework;
      cube.update = function(time){
        this.position.y += .1;
        this.position.x += this.vel.x;
        this.position.y += this.vel.y + .2;
        this.position.z += this.vel.z;
        
        this.rotation.x += this.vel.x; 
        this.rotation.y += this.vel.y;
        this.rotation.z += this.vel.z;
        
        this.material.color.r += 1;
        this.material.color.g += 0;
        this.material.color.b += 0;
        this.material.needsUpdate = true;//.colorsNeedUpdate = true;
        
        if(this.position.y > this.airtime){
          if(!this.fire){
            single_firework = this.firework(this.position);
          }
          single_firework.children.forEach(function(el,index){
            el.update(time);
          });
          this.material.color = new THREE.Color(0xff00000);
        }
      }
    cube.active  = true;
    cube.remove = function(){
      if(this.active){
        scene.remove(this,single_firework,edges_fire);
        fire.remove(getIndex(fire, 'uuid', this.uuid));
        this.active = false;
      }
    }
  scene.add(cube);
  var edges_fire = new THREE.EdgesHelper( cube, 0xcccccc );
  scene.add( edges_fire );
  return cube;
}

//__________________________________

var button_base_geometry = new THREE.CylinderGeometry( 13, 13, 2, 32 );
var button_base_material = new THREE.MeshPhongMaterial({
  color: 0x385a74
});
var button_base = new THREE.Mesh( button_base_geometry, button_base_material );
    button_base.receiveShadow = true;
    button_base.castShadow = true;
scene.add( button_base );


var button_geometry = new THREE.CylinderGeometry( 9,9, 7, 32 );
var button_material = new THREE.MeshLambertMaterial({
  color: 0xc3020e
});
var button = new THREE.Mesh( button_geometry, button_material );
    button.active = false;
    button.update = function(){
      if(this.active){
        if(this.position.y > -2){
          this.material.color.r -=1;
          this.material.color.g +=1;
          this.position.y -= 1;
        }
      }
      else{
        if(this.position.y < 1){
          this.material.color.r +=1;
          this.material.color.g -=1;
          this.position.y += 1;
        }
      }
    }
    
    button.receiveShadow = true;
    button.castShadow = true;
clickable.push(button);
scene.add( button );

var text    = new THREEx.Text("push the button", {
    font        : "droid serif",
    weight      : "bold",
    size        : 2,
    height      : 1
});
text.position.x = 0;
  text.position.z = 15;
  text.position.y = -1;
text.rotation.x = -90 * Math.PI/ 180;
  text.material = new THREE.MeshLambertMaterial({color : 0xeeeeee})
  scene.add(text);

//__________________________________

var fire = [];

//////////////////////////////////////////
    //   Render
//////////////////////////////////////////
var time = 0;
var render = function (time) { 
  requestAnimationFrame( render ); 
  animation(time);  
  renderer.render(scene, camera);
};

//////////////////////////////////////////
    //    Animation
//////////////////////////////////////////
function onDocumentMouseMove(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  if (SELECTED) {
    var intersects = raycaster.intersectObject(plane);
    //SELECTED.position.copy(intersects[0].point.sub(offset));
    return;
  }

  var intersects = raycaster.intersectObjects(clickable);
  if (intersects.length > 0) {
    document.body.style.cursor = 'pointer';
    if (INTERSECTED != intersects[0].object) {
      INTERSECTED = intersects[0].object;
    }

  } else {
    document.body.style.cursor = 'auto';
    INTERSECTED = null;
  }
}

function onDocumentMouseDown(event) {
  event.preventDefault();
  var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera);
  var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
  var intersects = raycaster.intersectObjects(clickable);
  if (intersects.length > 0) {
    controls.enabled = false;
    SELECTED = intersects[0].object;
    document.body.style.cursor = 'pointer';
    SELECTED.active = !SELECTED.active;
    console.log(SELECTED);
  }
}

function onDocumentMouseUp(event) {
  event.preventDefault();
  controls.enabled = true;
  if (INTERSECTED) {    
    SELECTED = null;
  }
  document.body.style.cursor = 'auto';
}

function animation(time){
  //scene.rotation.y += .01;
  button.update();
  
  if(button.active){
    if(time%2 < 0.15){
    var fireball = new Fireball();
        fire.push(fireball);
    }
  }
  fire.forEach(function(el,index){
    el.update(time);
  })
}


//////////////////////////////////////////
    //    Start scene
//////////////////////////////////////////
render(time);