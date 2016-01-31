
/*
	Basic Setup
*/
//(function(){

//__________ Variables

var main_color = 0x000000;
var canvas_height = window.innerHeight;
var canvas_width = window.innerWidth;
//__________ scene
var scene = new THREE.Scene();

//__________ camera

var camera = new THREE.PerspectiveCamera( 1, canvas_width/canvas_height, 10000, 100000 );

  camera.position.set(17873,16279,17942);
	scene.add(camera);
//__________ renderer

var renderer = new THREE.WebGLRenderer({ alpha: true,antialias :true,transparent:true }); /// { alpha: true }
    renderer.setSize( canvas_width, canvas_height );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    //renderer.setClearColor(main_color,1);

    document.body.appendChild( renderer.domElement );

//__________ resize

window.onresize = function(){
  canvas_height = window.innerHeight;
  canvas_width = window.innerWidth;

  camera.aspect = canvas_width / canvas_height;
  camera.updateProjectionMatrix();
  renderer.setSize( canvas_width, canvas_height );
}

//__________ controls

  controls = new THREE.OrbitControls( camera );

  controls.damping = 0.2;
  controls.maxPolarAngle = Math.PI/2;
  controls.minPolarAngle = 1;
  controls.minDistance = 10000;
  controls.maxDistance = 30000;


  controls.minAzimuthAngle = - 90 * Math.PI / 180; // radians
  controls.maxAzimuthAngle = 30 * Math.PI / 180; // radians

  controls.target = new THREE.Vector3(50,70,65);


//__________ light
var ambient = new THREE.AmbientLight(0xaaaaaa,1);
scene.add(ambient);
var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set( 200, 100, 0 );
    spotLight.intensity = 1;
    spotLight.castShadow = true;
    spotLight.shadowCameraVisible = true;
    scene.add(spotLight);

//__________ cubes
var loader = new THREE.JSONLoader();
var textureLoader = new THREE.TextureLoader();
var roomGroup = new THREE.Group();

textureLoader.load('assets/textures/roomMap_small.jpg',function(texture) {

  loader.load('assets/json/room.json',function(geometry,material){
      material.forEach(function(m,index) {
        m.map = texture;
        m.bumpMap = texture;
        m.side = THREE.DoubleSide;
        m.shading = THREE.FlatShading;
        m.shininess = 10;
        m.color = new THREE.Color(0xffffff);
        m.specular = new THREE.Color(0x333333);

        m.needsUpdate = true;
      })
      console.log(geometry,material);
      var roomMaterial = new THREE.MeshFaceMaterial(material);


      var room = new THREE.Mesh(geometry,roomMaterial);

      scene.add(room);
  });

});


//__________ render
var render = function () { 
  requestAnimationFrame( render ); 
  animation();
  controls.update();
  renderer.render(scene, camera);
};

//__________ animation

function animation(){
  // scene.rotation.y  -= .0005;
};

//__________

render();



//}()); //__eof

