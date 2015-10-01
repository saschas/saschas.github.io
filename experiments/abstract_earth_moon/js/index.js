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


var $fogColor = 0x000000;
console.log(typeof getRandomColor(),'0x'+ getRandomColor());

//////////////////////////////////////////
    //   Scene
//////////////////////////////////////////
var scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( $fogColor, 0.085 );

//////////////////////////////////////////
    //   Camera
//////////////////////////////////////////
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    camera.position.z = 12;
    camera.position.y = 5;
    
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
 controls.target.set( 0,5,0 );
//////////////////////////////////////////
    //    Light
//////////////////////////////////////////
////////////////////////
    //    PointLight
////////////////////////
var ambient = new THREE.AmbientLight(0x666666);
scene.add(ambient);

var light = new THREE.DirectionalLight( 0xfdfdfd, 1, 1000 );
    light.shadowDarkness = .8;
light.intensity = 1.5;
   // light.shadowCameraVisible = true;
    light.castShadow = true;
    light.position.set( 500, 0, 1500 );

//ridiculous hight shadow map
    light.shadowMapWidth = 1024 * 4; // default is 512
    light.shadowMapHeight = 1024 * 4;  // default is 512

scene.add( light );

//_____________________________ Sphere

function ball() {
var sphere_geometry = new THREE.IcosahedronGeometry( 2, 2 );

var sphere_material = new THREE.MeshLambertMaterial( {
  color : 0x29cff8,
  shading : THREE.FlatShading
});
var sphere = new THREE.Mesh( sphere_geometry, sphere_material );
  sphere.direction = 3;
  sphere.geometry.vertices.forEach(function(el,index){
    if(index % 1 == 0){
    el.x +=  Math.sin(index)*.015* Math.floor((Math.random()*5)-5)* sphere.direction;
    el.y +=  Math.cos(index)*.015* Math.floor((Math.random()*5)-5)* sphere.direction;
    el.z +=  Math.sin(index)*.015* Math.floor((Math.random()*5)-5)* sphere.direction;
      }
  })
sphere.geometry.verticesNeedUpdate = true;
  
sphere.position.y = 4;
sphere.receiveShadow = true;
sphere.castShadow = true;
sphere.rand = Math.random()* 5;
sphere.update = function(time){
}
return sphere;
}

var earth = new THREE.Object3D();
var land_ = new ball();
var water_ = new ball();
water_.material.color  = new THREE.Color(0x29cff8);
land_.material.color  = new THREE.Color(0x46b85a);
//land_.rotation.z = 90 * Math.PI / 180;
earth.add( land_ );
earth.add( water_ );


var mond_ = new ball();
    mond_.scale.set(0.3,0.3,0.3);
    mond_.position.x = -5;
    mond_.material.color  = new THREE.Color(0x666666);
    mond_.update = function(){
      this.rotation.y += .005;
    }
    earth.add(mond_);
    earth.update = function(){
      this.rotation.y += .01;
    }

    earth.rotation.x += .5;
    scene.add(earth);

//_______________________________ Zyinder

var particles = new THREE.Geometry();
var pMaterial = new THREE.PointCloudMaterial({
      color: 0xffffff,
      size: .05,
      transparent:true,
      opacity:1
    });


for(var i=0;i<10000;i++){
  var x = Math.floor((Math.random() * 80 ) - 50);
  var y = Math.floor((Math.random() * 80 ) - 50);
  var z = Math.floor((Math.random() * 80 ) - 50);
  particles.vertices.push(new THREE.Vector3(x,y,z));
}

var particleSystem_1 = new THREE.PointCloud(particles,pMaterial);
scene.add(particleSystem_1);


var earth_text    = new THREEx.Text( "Earth", {
    font        : "droid serif",
    weight      : "bold",
    size        : .5,
    height      : .15
});
  earth_text.position.x = 0;
  earth_text.position.z = 3;
  earth_text.position.y = 1;
  earth_text.receiveShadow = true;
  earth_text.castShadow = true;
  earth_text.material = new THREE.MeshLambertMaterial({color : 0xffffff})
  scene.add(earth_text);

var moon_text    = new THREEx.Text( "Moon", {
    font        : "droid serif",
    weight      : "bold",
    size        : .35,
    height      : .15
});
  moon_text.position.x = -5; 
  moon_text.position.y = 1;
  moon_text.receiveShadow = true;
  moon_text.castShadow = true;
  moon_text.material = new THREE.MeshLambertMaterial({color : 0xffffff});
  moon_text.update = function(time){
    mond_.updateMatrixWorld();
    var vector = mond_.geometry.vertices[1].clone();

        vector.applyMatrix4( mond_.matrixWorld );
    this.position.x = vector.x;
    this.position.y = vector.y - 2;
    this.position.z = vector.z;
    //this.lookAt(camera);
  }
  scene.add(moon_text);


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
function animation(time){
  earth.update(time);
  mond_.update(time);
  moon_text.update(time);
}

//////////////////////////////////////////
    //    Start scene
//////////////////////////////////////////
render(time);