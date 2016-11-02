/*
  Basic Setup
*/
//(function(){
//__________ Variables
var main_color = 0x000000;
var time = 0;
var canvas_height = window.innerHeight;
var canvas_width = window.innerWidth;
var clock = new THREE.Clock();
var assets = {
  geometry : {},
  textures : {},
  materials : {}
}


var scene, camera,renderer,controls;
var box;

var FractalOptions = function() {
  this.offsetX = 0.0;
  this.offsetY = 0.0;
  this.threshold = 5.0;
  this.zoom = 1.5;
  this.facR = .045;
  this.facG = .005;
  this.facB =  .0005;
}


function init(){
//__________ scene
  scene = new THREE.Scene();
//__________ camera
  camera = new THREE.PerspectiveCamera( 55, canvas_width/canvas_height, 0.1, 1000 );
  camera.position.set(0,0,155);
  scene.add(camera);
//__________ renderer
  renderer = new THREE.WebGLRenderer({ 
    alpha: true,
    antialias:true
  });
  renderer.setSize( canvas_width, canvas_height );
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(main_color,1);
  document.body.appendChild( renderer.domElement );


   var options = new FractalOptions();
  var gui = new dat.GUI();
  var offsetX = gui.add(options, 'offsetX', -1, 1);
  var offsetY = gui.add(options, 'offsetY', -1, 1);
  var zoom = gui.add(options, 'zoom', 0.0001, 2.5);
  var threshold = gui.add(options, 'threshold', 0.0001, 5.0);
  var facR = gui.add(options, 'facR', 0.0001, 1.0);
  var facG = gui.add(options, 'facG', 0.0001, 1.0);
  var facB = gui.add(options, 'facB', 0.0001, 1.0);


  offsetX.onChange(function(value) {
    box.material.uniforms.offset.value.x = value;
  }).step(0.001);

  offsetY.onChange(function(value) {
    box.material.uniforms.offset.value.y = value;
  }).step(0.001);

  zoom.onChange(function(value) {
    box.material.uniforms.zoom.value = value;
  }).step(0.0001);

  facR.onChange(function(value) {
    box.material.uniforms.fac.value.x = value;
  }).step(0.0001);
  facG.onChange(function(value) {
    box.material.uniforms.fac.value.y = value;
  }).step(0.0001);
  facB.onChange(function(value) {
    box.material.uniforms.fac.value.z = value;
  }).step(0.0001);
  threshold.onChange(function(value) {
    box.material.uniforms.threshold.value = value;
  }).step(0.0001);

  var vShader = document.getElementById('vertex-shader');
  var fShader = document.getElementById('fragment-shader');

  var shaderMaterial = new THREE.ShaderMaterial({
      vertexShader:   vShader.textContent,
      fragmentShader: fShader.textContent,
     // lights : true,
      uniforms: {
        time: {
          type : "f",
          value: time
        },
        zoom : {
          type : "f",
          value : options.zoom
        },
        threshold : {
          type : "f",
          value : options.threshold
        },
        max : {
          type : "i",
          value : 50
        },
        offset : {
          type : "v2",
          value : {
            x : options.offsetX,
            y : options.offsetY
          }
        },
        fac : {
          type : "v3",
          value : {
            x : options.facR,
            y : options.facG,
            z : options.facB
          }
        }
      },
      //lights: true
    });


    box = new THREE.Mesh(new THREE.PlaneBufferGeometry(100,100,256,256),shaderMaterial);
    scene.add(box);



  //__________ controls
  controls = new THREE.OrbitControls( camera );



  
  //__________ resize

  window.onresize = function(){
    canvas_height = window.innerHeight;
    canvas_width = window.innerWidth;
    camera.aspect = canvas_width / canvas_height;
    camera.updateProjectionMatrix();
    renderer.setSize( canvas_width, canvas_height );
  }

  render(time);
}//end of init



//__________ render
var render = function (time) { 
  requestAnimationFrame( render );
  controls.update();
  animation(time);
  renderer.render(scene, camera);
};
//__________ animation
function animation(time){
  clock.getDelta();
  box.material.uniforms.time.value = time / 1000;
  //box.rotation.x += 0.001;
  // box.rotation.y += 0.01;
  // box.rotation.z += 0.001;
};
//__________
init();
//}()); //__eof

