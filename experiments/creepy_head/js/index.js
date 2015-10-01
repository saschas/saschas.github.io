var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var FLOOR = -250;
var container, stats;
var camera, scene;
var renderer;
var time = 0;
var mesh, helper;
var raycaster = new THREE.Raycaster();
var morph_logic;

var å = {
  mouse: {
    x: 0,
    y: 0,
    z: 0.5
  },
  targetList: []
}
var controls;
var eye_driver, eye_l, eye_r;

var mouseX = 0,
  mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var clock = new THREE.Clock();

init();
animate();

function init() {

  container = document.getElementById('container');

  camera = new THREE.PerspectiveCamera(30, SCREEN_WIDTH / SCREEN_HEIGHT, .1, 10000);
  camera.position.x = 100;
  camera.position.y = 50;
  camera.position.z = 400;
  camera.move_direction = 1;
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.0015);

  scene.add(camera);

  eye_driver = new THREE.Object3D();
  eye_driver.position.set(0, 0, 0);
  scene.add(eye_driver);
  // GROUND

  var geometry = new THREE.CylinderGeometry(23, 23, 23, 32);
  var material = new THREE.MeshLambertMaterial({
    color: 0x222222
  });

  var floor = new THREE.Mesh(geometry, material);
  floor.position.y = -45;
  floor.position.z = -8;
  //floor.rotation.x = -90 * Math.PI/180;
  floor.receiveShadow = true;
  floor.castShadow = true;
  scene.add(floor);
  //
  controls = new THREE.OrbitControls(camera);
  controls.damping = 0.2;
  controls.addEventListener('change', render);
  //
  //controls.maxPolarAngle = Math.PI / 2;
  camera.lookAt(new THREE.Vector3(0, 50, 0));
  controls.target = new THREE.Vector3(0, 50, 0);

  var ambient = new THREE.AmbientLight(0x302A43);
  scene.add(ambient);

  var light = new THREE.DirectionalLight(0xFFFBE6, .5);
  light.position.set(-1500, 2500, 1000).multiplyScalar(1);
  scene.add(light);

  light.castShadow = true;

  light.shadowMapWidth = 1024;
  light.shadowMapHeight = 1024;

  var d = 70;

  light.shadowCameraLeft = -d;
  light.shadowCameraRight = d;
  light.shadowCameraTop = d * 1.5;
  light.shadowCameraBottom = -d;

  light.shadowCameraFar = 3500;
  //light.shadowCameraVisible = true;

  // RENDERER

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    transparent: true,
    alpha: true
  });
  //renderer.setClearColor( 0xffffff );
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  renderer.domElement.style.position = "relative";

  container.appendChild(renderer.domElement);

  renderer.gammaInput = true;
  renderer.gammaOutput = true;

  renderer.shadowMapEnabled = true;

  //__________________________________ LOAD MODEL

  var image = document.createElement( 'img' );
  image.crossOrigin = 'anonymous';
image.src = 'http://crossorigin.me/https://s3-us-west-2.amazonaws.com/s.cdpn.io/61062/eye.jpg';
  

var texture = new THREE.Texture( image );
texture.needsUpdate = true;
  
  var loader = new THREE.JSONLoader(true);
  loader.load("https://s3-us-west-2.amazonaws.com/s.cdpn.io/61062/head.json", function(geometry) {
    mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
      color: 0xFCFFFE,
      morphTargets: true,
      overdraw: 1,
      shading: THREE.FlatShading,
      side: THREE.DoubleSide
    }));
    mesh.scale.set(10, 10, 10);

    mesh.receiveShadow = true;
    mesh.castShadow = true;
    mesh.position.y = 0;
    scene.add(mesh);

    //ANIMATION
    

    animation = new THREE.MorphAnimation(mesh);
    // EYE LEFT
    var eye_geometry = new THREE.SphereGeometry(6, 32, 32);
    var eye_material = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      map: texture

    });
    // modify UVs to accommodate MatCap texture
    var faceVertexUvs = eye_geometry.faceVertexUvs[0];
    for (i = 0; i < faceVertexUvs.length; i++) {

      var uvs = faceVertexUvs[i];
      var face = eye_geometry.faces[i];
      for (var j = 0; j < 3; j++) {

        uvs[j].x = face.vertexNormals[j].x * 0.5 + 0.5;
        uvs[j].y = face.vertexNormals[j].y * 0.5 + 0.5;

      }
    }

    eye_l = new THREE.Mesh(eye_geometry, eye_material);
    eye_l.position.set(-12.5, 33, 20);
    eye_l.update = function(time) {
      this.rotation.copy(eye_driver.rotation);
    }
    scene.add(eye_l);

    eye_r = new THREE.Mesh(eye_geometry, eye_material);
    eye_r.update = function(time) {
      this.rotation.copy(eye_driver.rotation);
    }
    eye_r.position.set(12.5, 33, 20);
    scene.add(eye_r);

    morph_logic = new Logic(mesh);
  });

  window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

// __________________________________ Only for Skinned Mesh Animation
function ensureLoop(animation) {
  for (var i = 0; i < animation.hierarchy.length; i++) {

    var bone = animation.hierarchy[i];
    var first = animation.data.hierarchy[0];
    var last = animation.data.hierarchy[animation.data.hierarchy.length - 1];

    last.pos = first.pos;
    last.rot = first.rot;
    last.scl = first.scl;
  }
}

function clicker(obj) {
  obj.parent.ex_bool = true;
  obj.parent.children.forEach(function(el)  {
    explosion = new Explode(el);
  });
}

var radius = 600;
var theta = 0;
var prevTime = Date.now();

function animate() {

  requestAnimationFrame(animate);

  render();

}

var duration = 5000;
var keyframes = 150;
var interpolation = duration / keyframes;
var currentKeyframe = 0;
var lastKeyframe = 0;
var animOffset = 1;

function render(time) {
  theta += 0.1;

  var delta = 1 * clock.getDelta();

  // update morph

  if (typeof animation !== "undefined") {
    var keyframe = Math.floor(time / interpolation) + animOffset;

    //eye_l.update(time);
    //eye_r.update(time);
    morph_logic.loop_all_morphs(time);
    var time = Date.now();
    //animation.update( time - prevTime );
    prevTime = time;

  }

  var bounds = 200;
  var speed = 2;

  if (camera.position.x < -bounds || camera.position.x > bounds) {
    camera.move_direction *= -1;
  }

  camera.position.x += speed * camera.move_direction;
  camera.position.y += speed * camera.move_direction;
  camera.lookAt(new THREE.Vector3(0, 20, 0));

  if (typeof morph_logic != "undefined") {
    // EYE MOVEMENT
    eye_l.rotation.copy(camera.rotation);
    eye_r.rotation.copy(camera.rotation);
  }
  renderer.render(scene, camera);

}

function Logic(mesh) {
  this.ready = true;
  this.reset_all_morphs = function() {
    for (var i = 0; i < mesh.morphTargetInfluences.length; i++) {
      mesh.morphTargetInfluences[i] = 0;
    }
  }
  var curr = 0;
  this.counter = 0;
  var Presets = [
    'default',
    'eye_l',
    'mouth_open',
    'char_m',
    'char_u',
    'laugh'
  ]
  this.set_specific_morph = function(type, intensity) {
    var speed = 0.01;
    switch (type) {
      case 'default':
        this.reset_all_morphs();
        mesh.morphTargetInfluences[0] = intensity * speed;
        break;
      case 'eye_l':
        this.reset_all_morphs();
        mesh.morphTargetInfluences[1] = intensity * speed;
        break;
      case 'mouth_open':
        this.reset_all_morphs();
        mesh.morphTargetInfluences[2] = intensity * speed;
        break;
      case 'char_m':
        this.reset_all_morphs();
        mesh.morphTargetInfluences[3] = intensity * speed;
        break;
      case 'char_u':
        this.reset_all_morphs();
        mesh.morphTargetInfluences[4] = intensity * speed;
        break;
      case 'laugh':
        this.reset_all_morphs();
        mesh.morphTargetInfluences[5] = intensity * speed;
        break;
    }
  }
  this.direction = 1;
  this.loop_all_morphs = function(time) {

    if (this.counter % 100 == 0) {
      this.direction *= (-1);
    }
    if (this.counter <= 0) {
      this.direction *= (-1);
      if (curr < Presets.length) {
        curr++;
      } else {
        curr = 0;
      }
    }
    this.set_specific_morph(Presets[curr], this.counter);
    this.counter += 4 * this.direction;
  }

  return;
}

//___________________________________________ Event in Space
document.addEventListener('mousedown', onDocumentMouseDown, false);
document.addEventListener('mousemove', onDocumentMouseMove, false);

//___________________________________________ click
function onDocumentMouseDown(event) {
    å.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    å.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    // find intersections
    var vector = new THREE.Vector3(å.mouse.x, å.mouse.y, 1);
    vector.unproject(camera);
    var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    var intersects = ray.intersectObjects(å.targetList);
    if (intersects.length > 0) {
      clicker(intersects[0].object);
    }
  }
  //___________________________________________ move

function onDocumentMouseMove(event) {
  å.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  å.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  // find intersections
  var vector = new THREE.Vector3(å.mouse.x, å.mouse.y, 1);
  vector.unproject(camera);
  var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

  var intersects = ray.intersectObjects(å.targetList);

  if (intersects.length > 0) {
    mover(intersects[0].object);
  }
  if (typeof morph_logic != "undefined") {

    morph_logic.loop_all_morphs(time);
  }

}