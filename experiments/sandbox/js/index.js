//__________________________________________

var $fogColor = 0x000000;
//__________________________________________
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var offset = new THREE.Vector3();
var INTERSECTED, SELECTED;
var drag_objects = [];

//__________________________________________

//__________________________________________
var renderer = new THREE.WebGLRenderer({
  antialias: true
}); /// { alpha: true }
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMapEnabled = true;
// to antialias the shadow
renderer.shadowMapType = THREE.PCFSoftShadowMap;
renderer.setClearColor($fogColor, 1);

renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);
document.body.appendChild(renderer.domElement);

//__________________________________________

window.onresize = function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  //__________________________________________

var scene = new THREE.Scene();

//__________________________________________
var camera = new THREE.PerspectiveCamera(105, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 10;
camera.position.x = -8;
camera.position.z = 8;
camera.rotation.x = -20 * Math.PI / 180;
//__________________________________________

controls = new THREE.OrbitControls(camera);
controls.damping = 0.02;
controls.target = new THREE.Vector3(0, 10, 0);
//controls.minPolarAngle = 5*Math.PI/180;
//controls.maxPolarAngle = 5*Math.PI/180;
controls.maxDistance = 10;
controls.minDistance = 3;

controls.update();
controls.addEventListener('change', render);

//__________________________________________
/*var ambient = new THREE.AmbientLight(0x333333);
    scene.add(ambient);
*/
var light = new THREE.SpotLight(0xffffff, 1, 1000);
light.shadowDarkness = 2;
// light.shadowCameraVisible = true;
light.castShadow = true;
light.position.set(-200, 150, 0);

//ridiculous hight shadow map
light.shadowMapWidth = 1024 * 2; // default is 512
light.shadowMapHeight = 1024 * 2; // default is 512
light.shadowCameraRight = 50;
light.shadowCameraLeft = -50;
light.shadowCameraTop = 50;
light.shadowCameraBottom = -50;

var light_bottom = new THREE.SpotLight(0xffffff, 1, 1000);
light_bottom.position.y = -10;
light_bottom.intensity = .5;
scene.add(light);
scene.add(light_bottom);

//__________________________________________ Floor
var geometry = new THREE.BoxGeometry(50, 50, 50);
var material = new THREE.MeshLambertMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide,
});

//__________________________________________ Floor

var floor_geometry = new THREE.PlaneGeometry(20, 20, 32);
var floor_material = new THREE.MeshLambertMaterial({
  color: 0xcccccc,
  side: THREE.DoubleSide
});

var bg_1 = new THREE.Mesh(floor_geometry, floor_material);
bg_1.rotation.z = -Math.PI / 2;
bg_1.rotation.x = Math.PI / 2;
bg_1.position.y = 0;
bg_1.receiveShadow = true;
//floor.castShadow = true;
var bg_2 = bg_1.clone();

var bg_2 = bg_1.clone();
bg_2.position.y = 20;

var bg_3 = bg_2.clone();
bg_3.position.x = 0;
bg_3.position.y = 0;
bg_3.position.z = 0;

bg_1.rotation.y = -Math.PI / 2;
bg_1.position.x = 10;
bg_1.position.y = 10;

var bg_4 = bg_1.clone();
bg_4.rotation.y = 0;
bg_4.position.z = -10;
bg_4.position.y = 10;
bg_4.position.x = 0;

var bg_5 = bg_4.clone();
bg_5.position.z = 10;

var bg_6 = bg_1.clone();
bg_6.position.x = -10;

scene.add(bg_1);
scene.add(bg_2);
scene.add(bg_3);
scene.add(bg_4);
scene.add(bg_5);
scene.add(bg_6);

//grid xz
var grid_1 = new THREE.GridHelper(10, 1);
grid_1.position.set(0, 0.1, 0);
scene.add(grid_1);

//grid xz
var grid_2 = new THREE.GridHelper(10, 1);
grid_2.position.set(0, 19.9, 0);
scene.add(grid_2);

//grid xy
var grid_3 = new THREE.GridHelper(10, 1);
grid_3.rotation.z = Math.PI / 2;
grid_3.position.set(9.9, 10, 0);
scene.add(grid_3);

//grid xy
var grid_4 = new THREE.GridHelper(10, 1);
grid_4.rotation.x = 90 * Math.PI / 180;
grid_4.position.set(0, 10, 9.9);
scene.add(grid_4);

//grid xy
var grid_5 = new THREE.GridHelper(10, 1);
grid_5.rotation.x = 90 * Math.PI / 180;
grid_5.position.set(0, 10, -9.9);
scene.add(grid_5);

//grid xy
var grid_6 = new THREE.GridHelper(10, 1)
grid_6.rotation.x = 90 * Math.PI / 180;
grid_6.rotation.y = 0 * Math.PI / 2;
grid_6.rotation.z = 90 * Math.PI / 180;
grid_6.position.set(-9.9, 10, 0);
scene.add(grid_6);

//___________________________________________ Sphere

function baller()  {
  var sphere_geometry = new THREE.SphereGeometry(1, 10, 10);
  var sphere_material = new THREE.MeshPhongMaterial({
    color: 0xf05751,
    shader: THREE.FlatShading
  });

  var sphere = new THREE.Mesh(sphere_geometry, sphere_material);
  sphere.receiveShadow = true;
  sphere.castShadow = true;
  sphere.position.y = 10;
  sphere.direction = 1;
  sphere.speed = 1.1;
  sphere.gravity = -0.981;
  sphere.bounce = 1.2;
  sphere.collision = false;
  sphere.collide = function(objects) {
    var that = this;
    var obj_bounding = new THREE.Box3().setFromObject(that);
  
objects.forEach(function(el, i) {
    var bounding_el = new THREE.Box3().setFromObject(el);
    if (obj_bounding.isIntersectionBox(bounding_el)) {
      that.collision = true;
      that.material.color = new THREE.Color(0xffffff);
      return false;
    }
    else{
      that.material.color = new THREE.Color(0xff0000);
      that.collision = false;
    } 
});
}
    //____________________ UPDATE
  sphere.update = function(time) {
    var influence;
    
    if (this.position.y > 19) this.position.y = 19;
    if (this.position.y < 0) this.position.y = 1;
    if (this.position.x > 9) this.position.x = 9;
    if (this.position.x < -9) this.position.x = -9;
    if (this.position.z > 9) this.position.z = 9;
    if (this.position.z < -9) this.position.z = -9;

    //__________ FLOOR switch directio
    if (this.position.y <= 1) {
      this.direction *= (-1);
    }
    if (this.position.y > 1 && this.direction < 0) {
      this.speed -= .1;
      if (this.speed < 0) {
        if (this.bounce > 0) this.bounce -= .1;
        this.speed += this.bounce;
        this.direction *= (-1);
      }
    }
    this.position.y += (this.gravity * this.speed) * this.direction;
    this.collide(spheres);
  }
  drag_objects.push(sphere);
  return sphere;
}
var spheres = [];
for (var i = 0; i < 10; i++) {
  spheres[i] = new baller();
  spheres[i].position.x = Math.floor(Math.random() * 20) - 10;
  spheres[i].position.y = Math.floor(Math.random() * 20) - 0;
  spheres[i].position.z = Math.floor(Math.random() * 20) - 10;
  scene.add(spheres[i]);
}
//scene.add( sphere );

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

//___________________________________________ render

var time = 0;
var render = function(time) {
  requestAnimationFrame(render);
  animation(time);
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
};

//___________________________________________ drag & drop

function onDocumentMouseMove(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  if (SELECTED) {
    var intersects = raycaster.intersectObject(plane);
    SELECTED.position.copy(intersects[0].point.sub(offset));
    return;
  }

  var intersects = raycaster.intersectObjects(drag_objects);
  if (intersects.length > 0) {
    if (INTERSECTED != intersects[0].object) {
      if (INTERSECTED) INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
      INTERSECTED = intersects[0].object;
      INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
      plane.position.copy(INTERSECTED.position);
      plane.lookAt(camera.position);
    }

  } else {
    if (INTERSECTED) INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
    INTERSECTED = null;
  }
}

function onDocumentMouseDown(event) {
  event.preventDefault();
  var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera);
  var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
  var intersects = raycaster.intersectObjects(drag_objects);
  if (intersects.length > 0) {
    controls.enabled = false;
    SELECTED = intersects[0].object;
    var intersects = raycaster.intersectObject(plane);
    offset.copy(intersects[0].point).sub(plane.position);

    document.body.style.cursor = 'move';
  }
}

function onDocumentMouseUp(event) {
  event.preventDefault();
  controls.enabled = true;
  if (INTERSECTED) {
    plane.position.copy(INTERSECTED.position);
    if (INTERSECTED.position.y > 0) {
      INTERSECTED.speed = 1;
      INTERSECTED.bounce = .8;

      //console.log(INTERSECTED.position.y);
    }
    SELECTED = null;
  }

  document.body.style.cursor = 'auto';
}

//////////////////////////////////////////
//    Animation
//////////////////////////////////////////

function collision_detector(obj, objects) {
  var intersecting = [];
  var obj_bounding = new THREE.Box3().setFromObject(obj);
  objects.forEach(function(el, i) {
    var bounding_el = new THREE.Box3().setFromObject(el);
    var boolean_collision;
    if (obj_bounding.isIntersectionBox(bounding_el)) {
      boolean_collision = true;
      el.material.color = new THREE.Color(0xffffff);
    } else {
      boolean_collision = false;
      el.material.color = new THREE.Color(0xff0000);
    }
  });
}

var count = 0;

function animation(time) {
  drag_objects.forEach(function(el, index) {

  });
  spheres.forEach(function(el, index) {
    //console.log(el)
    el.update(time);
   // console.log(el.collision);
    
    
    //collision_detector(el,drag_objects);
  })
}

render();