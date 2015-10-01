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


var $fogColor = 0xeeeeee;
console.log(typeof getRandomColor(),'0x'+ getRandomColor());

//////////////////////////////////////////
    //   Scene
//////////////////////////////////////////
var scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( $fogColor, 0.005 );

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


var box = new THREE.BoxGeometry(.5,2,.25);

for(var i=0;i<20;i++){
  
  var hue = 'rgb(' + (Math.floor(Math.random() * 1)+ 100) + ',' + (Math.floor(Math.random() * 1)+ 10) + ',' + (Math.floor(Math.random() * 256)+ 100) + ')';
; 
  var base_material = new THREE.MeshLambertMaterial({color: hue });
  var height = Math.random();
  var cube = new THREE.Mesh( box, base_material);
      cube.receiveShadow = true;
      cube.castShadow = true;
      cube.position.x = -5 + i * .55;
      cube.scale.y = height;
      cube.position.y =  -1 + height;
  scene.add(cube);
}

////////////////////////
    //    Koordinaten System
////////////////////////

var base_material = new THREE.MeshPhongMaterial({color: 0xcccccc });
var box = new THREE.BoxGeometry(11.5,.03, .03);

for(var i=0;i<11;i++){
  var stroke = new THREE.Mesh( box, base_material);
      stroke.position.y = -1 + i * .25;
      stroke.position.z = -.15;
  stroke.position.x = -.1;
  scene.add(stroke);
}
////////////////////////
    //    Text
////////////////////////

for(var i=0;i<11;i++){

var text    = new THREEx.Text(i, {
    font        : "droid serif",
    weight      : "bold",
    size        : .1,
    height      : 0.01
});
text.position.x = -5.5;
  text.position.z = -.15;
  text.position.y = -.9 + i * .25;
  text.material = new THREE.MeshLambertMaterial({color : 0x000000})
  scene.add(text);
}

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
  
}

//////////////////////////////////////////
    //    Start scene
//////////////////////////////////////////
render(time);