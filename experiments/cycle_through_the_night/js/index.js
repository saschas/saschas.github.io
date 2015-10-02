$(document).ready(function(){
var container;

var camera, scene, controls;
var raycaster = new THREE.Raycaster();

var renderer;

var clock = new THREE.Clock();
var time = 0;
var duration = 100;
var keyframes = 4;
var interpolation = duration / keyframes;
var currentKeyframe = 0;
var lastKeyframe = 0;
var animOffset = 1;
var radius = 600;
var theta = 0;
var prevTime = Date.now();

var lamp_light, light, fake_light;
var mouseX = 0,
  mouseY = 0;

var lamp_light,moon_light;
var stones = [];
var large_stones = [];

var house = [];
var lamp_mesh = [];
var dirt;
var rahmen;

var videoTexture;
var main_options = {
  speed: .8,
  bounds: {
    min: 70,
    max: 80
  }
}
var helper;
var mesh, circle, controller_animation, helper;

//_______________________________________
var texture_man = document.getElementById('texture_man');
var texture_moon = document.getElementById('texture_moon');
var texture_lamp = document.getElementById('texture_lamp');

//_______________________________________

var å = {
  audio: {
    src: "Blear_Moon_-_08_-_Piano_miniature_003.mp3"
  },
  gravity: 0.981,
  ready: {
    count: 0
  },
  mouse: {
    x: 0,
    y: 0,
    z: 0.5
  },
  models: {
    man: "model/stylised.json",
    lamp: "model/lamp.json",
  },
  texture:  { },
  targetList: []
}

$(window).load(function() {
    å.texture.moon = new THREE.Texture(texture_moon);
    å.texture.character= new THREE.Texture(texture_man);
    å.texture.lamp= new THREE.Texture(texture_lamp);
    
    for (t in å.texture) {
      å.texture[t].crossOrigin = "Anonymous";
      å.texture[t].minFilter = THREE.NearestFilter;
      å.texture[t].needsUpdate = true;
    }
  
  init();
  animate();
});

//___________________________________________

function randomNumber(min, max, bool) {

  var num = Math.floor(Math.random() * max) + min; // this will get a number between 1 and 99;
  if (bool || typeof bool == "undefined") {
    num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
  }
  return num;
}

function generate_color(x, y, z) {
  if (x < 1) {
    x += .01;
  } else {
    x = 0;
  }
  if (y < 1) {
    y += .01;
  } else {
    y = 0;
  }
  if (z < 1) {
    z += .01;
  } else {
    z = 0;
  }

  return [x, y, z];
}

function getRandomColor() {
  var letters = '0123433333000ccc'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}

function pointInCircle(point, target, radius) {
  var distsq = (point.x - target.x) * (point.x - target.x) + (point.y - target.y) * (point.y - target.y) + (point.z - target.z) * (point.z - target.z);
  // returns bool , distance to target origin 
  return [distsq <= radius * radius * radius, distsq];
}

function boneLookAt(bone, p) {
  //console.log(bone.name,p);

  var target = new THREE.Vector3(
    p.position.x - bone.matrixWorld.elements[12],
    p.position.y - bone.matrixWorld.elements[13],
    p.position.z - bone.matrixWorld.elements[14]
  ).normalize();
  var v = p.position;
  var q = new THREE.Quaternion().setFromUnitVectors(v, target);
  q.x += .1;
  bone.quaternion.copy(q);
}

//___________________________________________ INIT
function init() {

    container = document.getElementById('container');

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, .1, 10000);
    camera.position.x = -50;
    camera.position.y = 20;
    camera.position.z = -135;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x1D1F20, 0.001);

    scene.add(camera);

    // RENDERER

    renderer = new THREE.WebGLRenderer({
      antialias: true,
      transparent: true,
      alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    renderer.shadowMapEnabled = true;

    //___________________________________________ CONTROLS
    controls = new THREE.OrbitControls(camera);
    controls.damping = 0.2;
    controls.addEventListener('change', render);
    controls.maxPolarAngle = Math.PI / 2;
    camera.lookAt(new THREE.Vector3(0, 20, 0));
    controls.target = new THREE.Vector3(0, 20, 0);
    controls.maxDistance = 200;

    //___________________________________________ HEMI
    var ambient = new THREE.AmbientLight(0x1A1324, 1);
    scene.add(ambient);

    //Conterlight
    var pointLight = new THREE.PointLight(0xffffff, .5, 300);
    pointLight.position.set(100, 100, 0);
    scene.add(pointLight);

    // LAMP
    lamp_light = new THREE.SpotLight(0xffffff, 1); // FEE191
    lamp_light.position.set(100, 260, 100).multiplyScalar(1);
    //
    lamp_light.castShadow = true;
    //
    lamp_light.shadowMapWidth = 1024;
    lamp_light.shadowMapHeight = 1024;

    //lamp_light.shadowCameraVisible = true;
    var d = 5000;
    lamp_light.shadowCameraLeft = -d;
    lamp_light.shadowCameraRight = d;
    lamp_light.shadowCameraTop = d;
    lamp_light.shadowCameraBottom = -d;
    lamp_light.shadowCameraNear = 0.01;
    lamp_light.shadowCameraFar = 350;

    scene.add(lamp_light);

    moon_light = new THREE.SpotLight(0xffffff, .5);
    moon_light.position.set(0, 50, 0).multiplyScalar(1);
    //
    moon_light.castShadow = true;
    //
    moon_light.shadowMapWidth = 1024;
    moon_light.shadowMapHeight = 1024;
    moon_light.target.position.set(100, 100, 200);
    moon_light.target.updateMatrixWorld();

    var d = 5000;
    moon_light.shadowCameraLeft = -d;
    moon_light.shadowCameraRight = d;
    moon_light.shadowCameraTop = d;
    moon_light.shadowCameraBottom = -d;
    moon_light.shadowCameraNear = 0.01;
    moon_light.shadowCameraFar = 350;

    scene.add(moon_light);

    //__________________________________ LOAD MODEL

    var loader = new THREE.JSONLoader(true);

    //___________________________________________ Little Kid

    loader.load(å.models.man, function(geometry, material) {
      var man_material = new THREE.MeshFaceMaterial(material);
      var man_material = new THREE.MeshPhongMaterial({
        shininess: 10,
        map: å.texture.character,
        skinning: true
      });
      man = new THREE.SkinnedMesh(geometry, man_material); //Skinned

      var animation = new THREE.Animation(man, geometry.animation);
      animation.play();
      animation.timeScale = 1.8;

      helper = new THREE.SkeletonHelper(man);
      helper.material.linewidth = 3;
      helper.visible = false;
      scene.add(helper);

      man.receiveShadow = true;
      man.castShadow = true;
      man.position.y = 2;

      man.update = function(time) {
        this.position.x += Math.sin(0.0005 * time) * .05;
      }
      scene.add(man);
      man.add(front_dirt);
      man.add(dirt);

    });

    //___________________________________________ Moon

    var moon_geometry = new THREE.SphereGeometry(85, 32, 32)
    var moon_material = new THREE.MeshPhongMaterial({
      transparent: true,
      opacity: .7,
      map: å.texture.moon,
      bumpMap :å.texture.moon,
      bumpScale : .001
    })
    var moon = new THREE.Mesh(moon_geometry, moon_material);
    moon.position.set(100, 100, 200);
    scene.add(moon);

    //___________________________________________

    var dirt_geo = new THREE.Geometry();

    var kMaterial = new THREE.PointCloudMaterial({
      color: 0xffffff,
      size: .25,
      transparent: true,
      opacity: .5,
      vertexColors: true
    });

    var colors = [];
    var color_array = [0x363A3F, 0x846550];
    var turbulence = []
    for (var i = 0; i < 250; i++) {

      var x = randomNumber(0, 5, true);
      var y = 2 + randomNumber(0.1, 25, false);
      var z = randomNumber(0, 25, false);

      dirt_geo.vertices.push(new THREE.Vector3(randomNumber(0, 2.1, true), 0, randomNumber(0, .2, true)));
      turbulence.push(new THREE.Vector3(x, y, z));

      colors.push(new THREE.Color(color_array[Math.floor(Math.random() * color_array.length)]));
    }
    dirt = new THREE.PointCloud(dirt_geo, kMaterial);
    dirt.turbulence = turbulence;
    dirt.geometry.colors = colors;
    dirt.geometry.colorsNeedUpdate = true;
    dirt.position.set(0, 0, 0);

    dirt.update = function(time) {
      var that = this;
      this.geometry.vertices.forEach(function(p, index) {

        p.x += .01 * that.turbulence[index].x;
        p.y += Math.sin(time) * .0001 * that.turbulence[index].y + randomNumber(.1, .8, false);
        p.z -= .01 * that.turbulence[index].z + randomNumber(.1, .8, false);

        var radius_checker = pointInCircle({
          x: 0,
          y: 0,
          z: -9
        }, p, 5);

        if (!radius_checker[0]) {
          p.x = 0;
          p.y = 0;
          p.z = -9;
        }
      });

      this.geometry.verticesNeedUpdate = true;
    }

    front_dirt = dirt.clone();

    front_dirt.position.z = 15;
    front_dirt.castShadow = true;

    //___________________________________________

    loader.load(å.models.lamp, function(geometry, material) {
      var lamp_material = new THREE.MeshPhongMaterial({
        shininess: 10,
        map: å.texture.lamp,
        side: THREE.DoubleSide,
        transparent: true,
        depthTest: true,
      });

      var p_lamps = [];
      for (var l = 0; l < 2; l++) {

        lamp_mesh[l] = new THREE.Mesh(geometry, lamp_material); //Skinned
        lamp_mesh[l].position.z = -80 + (l * 65);
        lamp_mesh[l].position.x = -50;
        lamp_mesh[l].receiveShadow = true;
        lamp_mesh[l].castShadow = true;

        lamp_mesh[l].update = function(time) {

            this.position.z -= main_options.speed;

            if (this.position.z > 0 && this.position.y > 4) {
              this.position.y -= å.gravity;
            }

            if (this.position.z < -70) {
              this.position.y -= (.1 + randomNumber(0.1, 1.2, false));
              this.rotation.x -= randomNumber(0.01, 0.06, false);
            }

            if (this.position.z < -(80)) {
              this.position.z = 80;
              this.position.y = (16 + randomNumber(1, 3));
              this.rotation.x = randomNumber(1, 8, true) * Math.PI / 180;
              this.rotation.y = randomNumber(1, 8, true) * Math.PI / 180;
              this.rotation.z = 0;
            }

          } //end of update

        var pointLight = new THREE.PointLight(0xF7D747, 1, 100);
        pointLight.position.set(0, 55, 0);
        lamp_mesh[l].add(pointLight);

        scene.add(lamp_mesh[l]);
      }

    });

    //___________________________________________

    var base_material = new THREE.MeshLambertMaterial({
      color: 0x333333,
      transparent: true
    });
    var box = new THREE.BoxGeometry(5, 5, 5);
    var pool_options = {
      position: {
        x: 0,
        y: 0,
        z: 80
      },
      radius: 5
    }
    var small_stone = {
      offset: {
        x: -30,
        z: -55
      },
      stone_row: 0,
      stone_col: 0
    }
    for (var i = 0; i < 480; i++) {
      stones[i] = new THREE.Mesh(box, base_material);

      if (i % 15 == 0) {
        small_stone.stone_row++;
        small_stone.stone_col = 0;
      }

      stones[i].position.x = small_stone.offset.x + 5 * small_stone.stone_col + randomNumber(.1, .8, true);
      stones[i].position.z = small_stone.offset.z + 5 * small_stone.stone_row + randomNumber(.1, .8, true);
      stones[i].rotation.x = randomNumber(1, 8, true) * Math.PI / 180;
      stones[i].rotation.y = randomNumber(1, 8, true) * Math.PI / 180;

      stones[i].update = function(time) {

        this.position.z -= main_options.speed;
        pool_options.position.z -= main_options.speed;

        if (this.position.z > 0 && this.position.y < -(1 + randomNumber(.1, .8, true))) {
          this.position.y += å.gravity;
        }

        if (this.position.z < -51) {
          this.position.y -= (.1 + randomNumber(0.1, 1.2, false));
          this.rotation.x += randomNumber(0.1, 0.6, true);
          this.rotation.y += randomNumber(0.1, 0.6, true);
          this.rotation.z += randomNumber(0.1, 0.6, true);
        }

        if (this.position.z < -(80)) {
          this.position.z = 80;
          this.position.y = -(16 + randomNumber(1, 3));
          this.rotation.x = randomNumber(1, 8, true) * Math.PI / 180;
          this.rotation.y = randomNumber(1, 8, true) * Math.PI / 180;
          this.rotation.z = 0;
        }

      }

      scene.add(stones[i]);

      stones[i].receiveShadow = true;
      small_stone.stone_col++;
    }

    /// ___________________________________________ BIG STONES

    var large_box = new THREE.BoxGeometry(40, 5, 29);

    var large_stone = {

      offset:  {
        x: -52.5,
        z: -70,
      },
      stone_row: 0,
      stone_col: 0

    }
    for (var i = 0; i < 12; i++) {
      large_stones[i] = new THREE.Mesh(large_box, base_material);

      if (i % 2 == 0) {
        large_stone.stone_row++;
        large_stone.stone_col = 0;
      }

      large_stones[i].position.x = large_stone.offset.x + 115 * large_stone.stone_col + randomNumber(.1, .8, true);
      large_stones[i].position.z = large_stone.offset.z + 27 * large_stone.stone_row;
      large_stones[i].rotation.x = randomNumber(1, 3, true) * Math.PI / 180;
      large_stones[i].rotation.z = randomNumber(1, 3, true) * Math.PI / 180;
      large_stones[i].position.y = 0;

      large_stones[i].update = function(time) {

        this.position.z -= main_options.speed;

        if (this.position.z > 0 && this.position.y < randomNumber(.1, .8, true)) {
          this.position.y += å.gravity;
        }

        if (this.position.z < -70) {
          this.position.y -= (.1 + randomNumber(0.1, 1.2, false));
          this.rotation.x -= randomNumber(0.01, 0.1, false);
        }

        if (this.position.z < -(80)) {
          this.position.z = 80;
          this.position.y = -(16);

          this.rotation.x = randomNumber(1, 3, true) * Math.PI / 180;
          this.rotation.z = randomNumber(1, 3, true) * Math.PI / 180;
          this.rotation.y = 0;
        }
      }
      large_stones[i].receiveShadow = true;
      scene.add(large_stones[i]);

      large_stone.stone_col++;
    }

    //___________________________________________ HOUSE

    var house_geo = new THREE.BoxGeometry(5, 10, 20);

    var house_options = {
      offset: {
        x: -73,
        y: 0,
        z: -50
      },
      stone_row: 0,
      stone_col: 0
    }
    for (var i = 0; i < 56; i++) {
      house[i] = new THREE.Mesh(house_geo, base_material);

      if (i % 8 == 0) {
        house_options.stone_row++;
        house_options.stone_col = 0;
      }

      house[i].position.x = house_options.offset.x + randomNumber(.1, .8, true);
      house[i].position.y = -5 + (house_options.stone_row * 10 + randomNumber(.1, .8, true));
      house[i].position.z = house_options.offset.z + 20 * house_options.stone_col + randomNumber(.1, .8, true);
      house[i].rotation.y = randomNumber(1, 8, true) * Math.PI / 180;
      house[i].options = {
        row: house_options.stone_row,
        col: house_options.stone_col
      }

      house[i].update = function(time) {

          this.position.z -= main_options.speed;

          if (this.rotation.y < 0) {
            this.rotation.y += 0.05;
          }

          if (this.position.z < -51) {
            this.position.y -= (randomNumber(0.1, .8, false));
            this.rotation.y += randomNumber(0.01, 0.06, false);
          }

          if (this.position.z < -(80)) {
            this.position.z = 80;
            this.position.y = -5 + (this.options.row * 10 + randomNumber(.1, .8, true));
            this.rotation.set(0, -1, 0);

          }
        } //end of update

      scene.add(house[i]);

      house[i].receiveShadow = true;
      house_options.stone_col++;
    }

    //___________________________________________ Audio

    var audio_ = document.createElement('audio');
    audio_.src = å.audio.src;
    audio_.loop = true;
    document.body.appendChild(audio_);
    audio_.play();

  } // end of init
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

//___________________________________________ Event in Space
window.addEventListener('resize', onWindowResize, false);
//___________________________________________ click

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

//___________________________________________ RENDER 

function animate(time) {

  requestAnimationFrame(animate);

  render(time);
  if (typeof stones != "undefined") {

    stones.forEach(function(el) {
      el.update(time);
    });

    large_stones.forEach(function(el) {
      el.update(time);
    });

    lamp_mesh.forEach(function(el) {
      el.update(time);
    });
  }

  if (typeof dirt != "undefined") {
    dirt.update(time);
  }

  if (typeof man != "undefined") {
    man.update(time);
  }
  if (typeof house != "undefined") {
    house.forEach(function(el) {
      el.update(time);
    });
  }

  if (typeof rahmen != "undefined") {

    rahmen.update(time);

  }
}

function render(time) {
  theta += 0.1;

  // update morph
  var delta = .75 * clock.getDelta();

  // update skinning

  THREE.AnimationHandler.update(delta);

  if (helper !== undefined) {
    helper.update();
  }

  renderer.render(scene, camera);

}


  
});