    var container;

    var camera, camera_helper, scene, controls;
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
    var animation = {

    };
    var hair;
    var mesh, circle, controller_animation, helper;
    var morph_logic;
    var banane;
    var floor;
    var texture1;
    var tv_screen, tv_context;
    var å = {
      ready: {
        count: 0
      },
      current_skeleton: 'default',
      keymap: {
        37: false,
        38: false,
        39: false,
        40: false
      },
      mouse: {
        x: 0,
        y: 0,
        z: 0.5
      },
      models: {
        minion: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/61062/minion.json"
      },
      targetList: []
    }

    var yellow_image = document.getElementById('texture_yellow_minion');
    var minion_yellow_texture = new THREE.Texture(yellow_image);
    minion_yellow_texture.minFilter = THREE.LinearFilter;
    minion_yellow_texture.needsUpdate = true;

    var minion_image = document.getElementById('texture_minion');
    var minion_texture = new THREE.Texture(minion_image);
    minion_texture.minFilter = THREE.LinearFilter;
    minion_texture.needsUpdate = true;

    var minion_spec_image = document.getElementById('texture_spec_minion');
    var minion_spec_texture = new THREE.Texture(minion_spec_image);
    minion_spec_texture.minFilter = THREE.LinearFilter;
    minion_spec_texture.needsUpdate = true;

    var minion_bump_image = document.getElementById('texture_bump_minion');
    var minion_bump_texture = new THREE.Texture(minion_bump_image);
    minion_bump_texture.minFilter = THREE.LinearFilter;
    minion_bump_texture.needsUpdate = true;
    //___________________________________________

    function getRandomColor() {
      var letters = '0123433333000ccc'.split('');
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }

      return color;
    }

    //___________________________________________ KICK IT OFF
    init();
    animate();

    //___________________________________________ INIT
    function init() {

        container = document.getElementById('container');

        camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, .1, 10000);
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 5;
        camera.update = function(time) {

        }
        camera.move_direction = 1;
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0xffffff, 0.0015);

        scene.add(camera);

        var material = new THREE.MeshBasicMaterial({
          color: 0x0000ff,
          transparent: true,
          opacity: 0
        });

        var radius = 50;
        var segments = 32;

        var circleGeometry = new THREE.CircleGeometry(radius, segments);
        camera_helper = new THREE.Mesh(circleGeometry, material);
        scene.add(camera_helper);
        camera_helper.add(camera);
        camera_helper.visible = true;
        camera.position.set(50, 20, 50);
        //___________________________________________ CONTROLS
        controls = new THREE.OrbitControls(camera);
        controls.damping = 0.2;
        controls.addEventListener('change', render);
        camera.lookAt(new THREE.Vector3(0, 5, 0));
        controls.target = new THREE.Vector3(0, 5, 0);
        controls.minDistance = 50;
        controls.maxDistance = 160;
        controls.minPolarAngle = 20 * Math.PI / 180;
        controls.maxPolarAngle = 90 * Math.PI / 180;
        controls.minAzimuthAngle = -30 * Math.PI / 180;
        controls.maxAzimuthAngle = 30 * Math.PI / 180;

        //___________________________________________ HEMI

        var ambient = new THREE.AmbientLight(0xffffff);
        scene.add(ambient);

        //___________________________________________ FAKE LIGHT
        fake_light = new THREE.SpotLight(0xffffff, .5);
        fake_light.position.set(0, 50, 120);
        fake_light.castShadow = true;
        //
        fake_light.shadowMapWidth = 1024 * 2;
        fake_light.shadowMapHeight = 1024 * 2;
        //
        var d = 3500;
        fake_light.shadowCameraLeft = -d;
        fake_light.shadowCameraRight = d;
        fake_light.shadowCameraTop = d * 2.8;
        fake_light.shadowCameraBottom = -d;
        fake_light.shadowCameraNear = 0.1;
        //scene.add( fake_light );

        light = new THREE.SpotLight(0xffffff, .1);

        light.castShadow = true;

        light.shadowMapWidth = 1024 * 2;
        light.shadowMapHeight = 1024 * 2;

        var d = 3500;
        light.shadowCameraLeft = -d;
        light.shadowCameraRight = d;
        light.shadowCameraTop = d * 2.8;
        light.shadowCameraBottom = -d;
        light.shadowCameraNear = 0.1;
        light.position.set(0, 100, 100);
        light.target.updateMatrixWorld();

        light.update = function(time) {

          this.position = camera_helper.position;
          //light.position.updateMatrixWorld();
          this.target.position.set(camera_helper.position.x, 0, camera_helper.position.z);
          this.target.updateMatrixWorld();
        }
        camera_helper.add(light);

        corr_light = new THREE.SpotLight(0xffffff, .1);
        corr_light.position.set(0, 12, 20);
        corr_light.target.position.set(0, 6, 0);
        corr_light.target.updateMatrixWorld();
        //corr_light.castShadow = true;
        scene.add(corr_light);

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
        //__________________________________ LOAD MODEL

        var loader = new THREE.JSONLoader();

        loader.load(å.models.minion, function(geometry, material) {

          material.forEach(function(mat, index) {
            mat.skinning = true;
          });
          var main_material = new THREE.MeshPhongMaterial({
            shading: THREE.SmoothShading,
            skinning: true,
            shininess: 200,
            map: minion_texture,
            side: THREE.DoubleSide,
            specularMap: minion_spec_texture,
            bumpMap: minion_bump_texture,
            bumpScale: .005,
          });
          var yellow_material = new THREE.MeshPhongMaterial({
            shading: THREE.SmoothShading,
            skinning: true,
            shininess: 20,
            map: minion_yellow_texture,
            side: THREE.DoubleSide,
            specularMap: minion_spec_texture
          });

          var transparent_material = new THREE.MeshPhongMaterial({
            color: 0x3BB8E7,
            shading: THREE.SmoothShading,
            shininess: 200,
            skinning: true,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: .2
          });

          var hair_material = new THREE.MeshPhongMaterial({
            color: 0x000000,
            shading: THREE.SmoothShading,
            shininess: 200,
            skinning: true,
            side: THREE.DoubleSide
          });

          var minion_material = new THREE.MeshFaceMaterial([main_material, yellow_material, transparent_material, hair_material]);

          var colors = [];
          minion = new THREE.SkinnedMesh(geometry, minion_material);

          minion.geometry.colors = colors;
          minion.geometry.colorsNeedUpdate = true;

          minion.position.set(0, 0, 0);
          minion.scale.set(10, 10, 10);

          minion.receiveShadow = true;
          minion.castShadow = true;
          minion.direction = 1;

          minion.update = function(time) {
            animation.jump.timeScale = 0;
            //animation.walk.timeScale = 0;
            minion_movement(å.keymap);
            camera_helper.position.x = this.position.x;
            camera_helper.position.z = this.position.z;
            floor.position.x = this.position.x;
            floor.position.z = this.position.z;
          }
          scene.add(minion);

          //___________________________________________ Animation
          animation.jump = new THREE.Animation(minion, geometry.animation[1]);
          animation.jump.play();
          animation.jump.timeScale = 1;

          animation.walk = new THREE.Animation(minion, geometry.animation[0]);
          animation.walk.play();
          animation.walk.timeScale = 5;

          helper = new THREE.SkeletonHelper(minion);
          helper.material.linewidth = 1;
          helper.visible = false;
          scene.add(helper);
        });

        //___________________________________________ FLOOR

        var plane_geo = new THREE.PlaneBufferGeometry(100, 100, 32);

        var plane_mat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          side: THREE.DoubleSide
        })

        floor = new THREE.Mesh(plane_geo, plane_mat);
        floor.rotation.x = -90 * Math.PI / 180;
        floor.receiveShadow = true;
        scene.add(floor);

      }
      // __________________________________ Only for Skinned Mesh Animation
    function ensureLoop(animation) {
      //animation.hierarchy.shift();

      for (var i = 0; i < animation.hierarchy.length; i++) {

        var bone = animation.hierarchy[i];
        var first = animation.hierarchy[0];
        var last = animation.hierarchy[animation.hierarchy.length - 1];
        last.pos = first.pos;
        last.rot = first.rot;
        last.scl = first.scl;
      }
    }

    function boneLookAt(bone, p) {
      var target = new THREE.Vector3(
        p.x - bone.matrixWorld.elements[12],
        p.y - bone.matrixWorld.elements[13],
        p.z - bone.matrixWorld.elements[14]
      ).normalize();
      var v = new THREE.Vector3(0, 0, 1);
      var q = new THREE.Quaternion().setFromUnitVectors(v, target);
      q.x += .1;
      bone.quaternion.copy(q);
    }

    //___________________________________________ Event in Space
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('keydown',keymapper,false);
    window.addEventListener('keyup',keymapper,false);
    function keymapper(e) {
      controls.enabled = false;
      e.preventDefault(e);
      e = e || event; // to deal with IE
      å.keymap[e.keyCode] = e.type == 'keydown';
     }

    function minion_movement(keymap) {
      for (key in keymap) {
        if (keymap[key]) {
          switch (key) {

            //SPACE
            case '32':
              animation.walk.timeScale = (0);
              animation.jump.timeScale = (5);
              å.current_skeleton = 'jump';
              minion.direction = 1;
              break;
              //Forwards
            case '38':
              minion.translateZ(0.3);
              animation.walk.timeScale = (5);
              å.current_skeleton = 'walk';
              minion.direction = 1;
              break;
              //Backwards
            case '40':
              minion.translateZ(-0.3);
              animation.walk.timeScale = (-5);
              å.current_skeleton = 'walk';
              minion.direction = -1;
              break;
              //left
            case '37':
              minion.rotation.y += .05;
              camera_helper.rotation.y += .05;
              å.current_skeleton = 'walk';

              break;
              //right
            case '39':
              minion.rotation.y -= .05;
              camera_helper.rotation.y -= .05;
              å.current_skeleton = 'walk';
              break;
          }
        }
      }
    }

    //___________________________________________ click

    function onWindowResize() {

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);

    }

    //___________________________________________ RENDER 
    var eye_options = {
      current: {
        top: 0,
        bottom: 0
      },
      state: 'bored',
      switchState: function() {
        var states = ['close', 'bored', 'angry', 'open', 'complete_closed'];
        return states[Math.floor(Math.random() * states.length)];
      },
      speed: 2,
      direction: {
        top: 1,
        bottom: 1
      },
      stops: {
        close: {
          top: 65,
          bottom: 65
        }
      }
    }
    var current_eye = 0;

    function eye_movement(mesh, point) {
      var private_point = point.clone();
      private_point.x += camera_helper.position.x;
      private_point.y += camera_helper.position.y;
      private_point.z += camera_helper.position.z;
      boneLookAt(mesh.skeleton.bones[4], private_point);

      switch (eye_options.state) {
        case 'close':
          eye_options.current.top += (eye_options.speed * eye_options.direction.top);
          eye_options.current.bottom += (eye_options.speed * eye_options.direction.bottom);
          if (eye_options.current.top > eye_options.stops.close.top || eye_options.current.top < 0) {
            eye_options.direction.top *= (-1);
          }
          if (eye_options.current.bottom > eye_options.stops.close.bottom || eye_options.current.bottom < 0) {
            eye_options.direction.bottom *= (-1);
          }
          mesh.skeleton.bones[6].rotation.x = eye_options.current.top * Math.PI / 180;
          mesh.skeleton.bones[7].rotation.x = -eye_options.current.bottom * Math.PI / 180;
          break;
        case 'bored':
          mesh.skeleton.bones[6].rotation.x = 60 * Math.PI / 180;
          mesh.skeleton.bones[7].rotation.x = 0 * Math.PI / 180;
          break;
        case 'angry':
          mesh.skeleton.bones[6].rotation.x = 55 * Math.PI / 180;
          mesh.skeleton.bones[7].rotation.x = -55 * Math.PI / 180;
          break;
        case 'open':
          mesh.skeleton.bones[6].rotation.x = 0 * Math.PI / 180;
          mesh.skeleton.bones[7].rotation.x = -0 * Math.PI / 180;
          break;
        case 'complete_closed':
          mesh.skeleton.bones[6].rotation.x = 65 * Math.PI / 180;
          mesh.skeleton.bones[7].rotation.x = -65 * Math.PI / 180;
          break;
      }
    }

    $('body').click(function(e) {
      eye_options.state = eye_options.switchState();
    })

    function animate() {

      requestAnimationFrame(animate);

      render();
    }
    var fps = 24;
    var keyframes = 58;
    var duration = keyframes / fps;

    var interpolation = duration / keyframes;

    function render(time) {
      theta += 0.1;
      var delta = clock.getDelta();

      // update morph

      if (typeof minion !== "undefined") {
        var keyframe = Math.floor(time / interpolation) + animOffset;
        if (helper !== undefined) {
          helper.update();
        }

        THREE.AnimationHandler.update(interpolation);
        minion.update(time);
        camera.update(time);
        light.update(time);

        // ___________________________________________ LOOKAt Point
        eye_movement(minion, camera.position);
        //
        var time = Date.now();
        prevTime = time;

      }

      renderer.render(scene, camera);

    }