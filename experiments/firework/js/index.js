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

var $fogColor = 0xffffff;
console.log(typeof getRandomColor(),'0x'+ getRandomColor());

//////////////////////////////////////////
    //   Scene
//////////////////////////////////////////
var scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( $fogColor, 0.005 );

//////////////////////////////////////////
    //   Camera
//////////////////////////////////////////
var camera = new THREE.PerspectiveCamera( 105, window.innerWidth/window.innerHeight, 0.1, 1000 );
    camera.position.z = 30;
    camera.position.y = 0;
    camera.lookAt(new THREE.Vector3(0,10,0));
 
//////////////////////////////////////////
    //   Renderer
//////////////////////////////////////////
var renderer = new THREE.WebGLRenderer({ antialias: true }); /// { alpha: true }
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMapEnabled = true;
    // to antialias the shadow
    renderer.shadowMapType = THREE.PCFSoftShadowMap;
    renderer.setClearColor($fogColor, 1 );
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
 controls.addEventListener( 'change', render );
 //
 controls.maxPolarAngle = Math.PI/2;
 controls.target.set( 0,0,0 );
 controls.target0.set( 0,10,0 );
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
    light.intensity = 2;
    light.position.set( 0, 1500, 500 );

//ridiculous hight shadow map
    light.shadowMapWidth = 1024 * 4; // default is 512
    light.shadowMapHeight = 1024 * 4;  // default is 512

scene.add( light );

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
    //    Build Geometry
//////////////////////////////////////////
    //    Bars
////////////////////////

function Fireball(){

var box = new THREE.BoxGeometry(1,1,1);
var hue = 'rgb(' + (Math.floor(Math.random() * 1)+ 100) + ',' + (Math.floor(Math.random() * 1)+ 10) + ',' + (Math.floor(Math.random() * 256)+ 100) + ')';
 var base_material = new THREE.MeshLambertMaterial({color: hue });
  var height = Math.random();
  var cube = new THREE.Mesh( box, base_material);
      cube.receiveShadow = true;
      cube.castShadow = true;
      cube.fire = false;
      cube.airtime = (Math.floor(Math.random() * 21) + 10);
      cube.vel = {
        x : (Math.floor(Math.random() * 21) - 10) *.01,
        y : (Math.floor(Math.random() * 21) + 10) *.01, // speed
        z : (Math.floor(Math.random() * 21) - 10) *.01,
      }
    //_______ firework
      cube.firework = function(pos){
        var that = this;
        this.fire = true;
        var firework = new THREE.Object3D();
        scene.remove(this);
        for(var i= 0;i<100;i++){
          var cube = new THREE.Mesh( box, base_material);
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
            this.position.x += this.random.x * this.vel.x;
            this.position.y += this.random.y * this.vel.y - (0.0981 * time * .0001);
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
        this.position.y += this.vel.y;
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
        scene.remove(single_firework);
        fire.remove(getIndex(fire, 'uuid', this.uuid));
        this.active = false;
      }
    }
  scene.add(cube);
  return cube;
}


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

setInterval(function(){
  var fireball = new Fireball();
        fire.push(fireball);
},1000);
function animation(time){
  scene.rotation.y += .01;
  
  
  fire.forEach(function(el,index){
    el.update(time);
  })
}


//////////////////////////////////////////
    //    Start scene
//////////////////////////////////////////
render(time);