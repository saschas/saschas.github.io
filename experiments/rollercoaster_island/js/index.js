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
    var effect;
    var prevTime = Date.now();
    var helper;
    var konfSystem, sec_konfSystem;
    // custom global variables

    var postprocessing = {
      enabled: true
    };
    var velocity = {};

    var rad_wagon, rad;

    var track;
    var wagons;
    var monster;
    //Helper Track
    var tangent = new THREE.Vector3();
    var axis = new THREE.Vector3();
    var up = new THREE.Vector3(0, 1, 0);

    var gras;
    var animation;

    var fake_light;
    var base_url = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/61062/"
    var å = {
      rad: {
        enabled: false
      },
      explore: {
        enabled: false
      },
      monster: {
        enabled: false
      },
      track: {
        enabled: false,
        speed: 0.0005,
        counter: 0,
        lookAt: .00001
      },
      mouse: {
        x: 0,
        y: 0,
        z: .5
      },
      mode: {
        desktop: true,
        vr: false,
        orientation: false
      },
      postprocessing: {
        enabled: true
      },
      paused: false,
      state: {

      },
      scene: {

      },
      model: {
        track: base_url + 'track.json',
        rad: base_url + 'rad.json',
        rad_ground: base_url + 'rad_ground.json',
        rad_wagon: base_url + 'rad_wagon.json',
        monster: base_url + 'monster.json',
        monster_ground: base_url + 'monster_ground.json',
        park: base_url + 'park.json',
        cloud: base_url + 'cloud.json'
      },
      loaded: {

      }
    }

    // Meh..___________________________________________ LOAD IMAGES CROSS
    var smoke_image = document.getElementById('texture_smoke');
    var smoke_texture = new THREE.Texture(smoke_image);
    smoke_texture.needsUpdate = true;

    //___________________________________________

    var materialDepth;
    var sunPosition = new THREE.Vector3(100, 0, -100);
    var screenSpacePosition = new THREE.Vector3();

    var bgColor = 0x000000;
    var sunColor = 0x222222;
    var orbitRadius = 20;

    var postprocessing = {
      enabled: true
    };

    //___________________________________________ HELPER
    function randNum(min, max, bool) {

      var num = Math.random() * max + min;
      if (bool ||  bool === "undefined") {
        num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
      }
      return num;
    }

    function centerPoint(pointA, pointB, percentage) {

      var dir = pointB.clone().sub(pointA);
      var len = dir.length();
      dir = dir.normalize().multiplyScalar(len * percentage);
      return pointA.clone().add(dir);

    }

    function first_controls(controls) {
      if (controls.name !== 'first') {
        controls = null;

        controls = new THREE.FlyControls(camera);
        controls.movementSpeed = 1000;
        controls.domElement = renderer.domElement;
        controls.rollSpeed = Math.PI / 24;
        controls.autoForward = true;
        controls.dragToLook = false;
      }
      return controls;
    }

    function orbit_controls(controls) {

      controls = null;
      scene.add(camera);
      controls = new THREE.OrbitControls(camera);
      controls.damping = 0.2;
      controls.name = 'orbit';
      controls.autoRotate = false;
      controls.addEventListener('change', render);
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      controls.target = new THREE.Vector3(0, 0, 0);
      return controls;
    };

    function vr_controls(controls) {

      å.mode.vr = true;
      å.mode.desktop = false;

      var split_check = typeof controls.connect === 'function';

      scene.add(camera);
      if (split_check) {
        controls.connect();
      } else {
        controls = null;
        controls = new THREE.DeviceOrientationControls(camera);
        controls.connect();

        controls.name = 'vr';
        if (!å.mode.desktop) {
          effect = new THREE.StereoEffect(renderer);
          controls.name = 'vr';
          effect.eyeSeparation = 2;
          effect.setSize(window.innerWidth, window.innerHeight);
        }
        camera.lookAt(new THREE.Vector3(0, 0, 0));

      }
      return controls;
    }

    function pointInCircle(point, target, radius) {
      var distsq = (point.x - target.x) * (point.x - target.x) + (point.y - target.y) * (point.y - target.y) + (point.z - target.z) * (point.z - target.z);
      // returns bool , distance to target origin 
      return [distsq <= radius * radius * radius, distsq];
    }

    //___________________________________________ KICK IT OFF

    init();
    animate();

    //___________________________________________ INIT
    function init() {

        //if(Modernizr.touch){
        //  å.mode.vr = true;
        //  å.mode.desktop = false;
        //}

        container = document.getElementById('container');

        //__________________________________ Camera

        camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, .1, 100000);
        camera.position.x = -46; // 0
        camera.position.y = 45; // 0.5
        camera.position.z = -130; // 6.3
        camera.move_direction = 1;
        camera.posSpeed = 0.002;
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0xFFCA73, 0.003);
        camera.update = function(time) {
          if (typeof track !== "undefined" && å.track.enabled) {
            if (å.track.counter < 1) {
              å.track.counter += å.track.speed;
            } else {
              å.track.counter = 0;
            }
            if (å.track.lookAt <= 1) {
              å.track.lookAt += å.track.speed;
            } else {
              å.track.lookAt = 0;
            }
            if (å.track.counter > 1) {
              å.track.counter = 1
            }
            if (å.track.lookAt > 1) {
              å.track.lookAt = 1
            }
            var position_l = track.getPointAt(å.track.counter);
            var position_r = track_r.getPointAt(å.track.counter);

            var lookAt_position_l = track.getPointAt(å.track.lookAt);
            var lookAt_position_r = track_r.getPointAt(å.track.lookAt);

            var camera_position = centerPoint(position_l, position_r, .5);
            var lookAt_position = centerPoint(lookAt_position_l, lookAt_position_r, .5);

            this.position.copy(camera_position);

            if (!å.mode.vr) {
              tangent = track.getTangentAt(å.track.lookAt).normalize();
              axis.crossVectors(up, tangent).normalize();
              var radians = Math.acos(up.dot(tangent));

              this.quaternion.setFromAxisAngle(axis, radians);
              this.lookAt(lookAt_position);
            }
          }

          //__________________ Rad

          if (typeof wagons !== "undefined" && å.rad.enabled) {
            if (this.position.x == 0 && this.position.y == 0 && this.position.z == 0) {
              this.position.set(0, 0, 0);
              this.lookAt(new THREE.Vector3(1, 0, 0));
            }

            if (!å.mode.vr && controls.name !== 'orbit') {
              controls = orbit_controls(controls);
              this.position.set(0, -6, 6);
            }
            if (this.position.x == 0 && this.position.y == 0 && this.position.z == 0) {
              this.position.set(0, 0, 6);
              this.lookAt(new THREE.Vector3(2, 0, 0))
            }
            controls.noZoom = true;
            controls.maxDistance = 0.02;
            wagons.children[0].add(camera);
          }

          //__________________ Monster

          if (typeof monster !== "undefined" && å.monster.enabled) {
            if (!å.mode.vr && controls.name !== 'orbit') {
              controls = orbit_controls(controls);

            }
            if (this.position.x == 0 && this.position.y == 0 && this.position.z == 0) {
              this.position.set(-5, -18, 0.1);
            }
            controls.target = new THREE.Vector3(-5, -18, 0);
            controls.noZoom = true;
            controls.maxDistance = 0.01;
            monster.add(camera);
          }

          if (å.rad.enabled) {

          }

          //__________________ Explore
          if (å.explore.enabled) {

          }
        }
        scene.add(camera);

        // ___________________________________________RENDERER

        renderer = new THREE.WebGLRenderer({
          antialias: true,
          transparent: true,
          alpha: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        renderer.shadowMapEnabled = true;

        renderer.gamma

        //___________________________________________ CONTROLS

        if (å.mode.desktop) {
          controls = orbit_controls(controls);

        }
        if (å.mode.vr) {
          controls = vr_controls(controls);
        }

        //___________________________________________ FAKE LIGHT

        var ambient = new THREE.AmbientLight(0x333333);
        scene.add(ambient);
        //___________________________________________ Light

        light = new THREE.SpotLight(0xF5A96B, 10, 200, Math.PI / 2);
        light.position.set(0, 150, 0).multiplyScalar(1);

        light.castShadow = true;

        light.shadowMapWidth = 1024 * 2;
        light.shadowMapHeight = 1024 * 2;
        scene.add(light);

        front_light = new THREE.SpotLight(0xF5A96B, 2, 200, Math.PI / 2);
        front_light.position.set(-46, 45, -150).multiplyScalar(1);
        scene.add(front_light);

        //___________________________________________ Fake Light

        fake_light = new THREE.SpotLight(0x45D2EA, 1, 1, Math.PI / 2);
        fake_light.position.set(0, 300, -150).multiplyScalar(1);

        fake_light.castShadow = true;

        fake_light.shadowMapWidth = 1024;
        fake_light.shadowMapHeight = 1024;

        var d = 3500;
        fake_light.shadowCameraLeft = -d;
        fake_light.shadowCameraRight = d;
        fake_light.shadowCameraTop = d;
        fake_light.shadowCameraBottom = -d;
        fake_light.shadowCameraNear = 0.01;
        scene.add(fake_light);

        var pointLight = new THREE.PointLight(0xffffff, .1);
        //___________________________________________ FLARE

        var loader = new THREE.JSONLoader();

        //___________________________________________ BALL

        var modifier = new THREE.SubdivisionModifier(2);

        loader.load(å.model.track, function(geometry) {
          var spline_geometry = [];
          var spline_geometry_r = [];
          geometry.vertices.forEach(function(p, index) {
            if (index % 2 == 0) {
              spline_geometry.push(p);
            } else {
              spline_geometry_r.push(p);
            }

          });
          spline_geometry[spline_geometry.length - 1] = spline_geometry[0];
          spline_geometry_r[spline_geometry_r.length - 1] = spline_geometry_r[0];

          track = new THREE.SplineCurve3(spline_geometry);
          track_r = new THREE.SplineCurve3(spline_geometry_r);
          var radius = .2;
          var segments = 6;

          var circleGeometry = new THREE.CircleGeometry(radius, segments);

          var extrudeSettings = {
            steps: 1000,
            bevelEnabled: false,
            extrudePath: track
          };
          var extrudeSettings_r = {
            steps: 1000,
            bevelEnabled: false,
            extrudePath: track_r
          };

          draw_feets(spline_geometry);
          draw_feets(spline_geometry_r);

          draw_inbetween_line([spline_geometry, spline_geometry_r]);

          var shape = new THREE.Shape(circleGeometry.vertices);

          var track_geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
          var track_geometry_r = new THREE.ExtrudeGeometry(shape, extrudeSettings_r);

          var track_material = new THREE.MeshLambertMaterial({
            color: 0xb00000,
            wireframe: false
          });
          var real_track_geo = new THREE.Geometry();
          var extrude_Track = new THREE.Mesh(track_geometry, track_material);
          var extrude_Track_r = new THREE.Mesh(track_geometry_r, track_material);
          extrude_Track.castShadow = true;
          extrude_Track.receiveShadow = true;
          
          extrude_Track_r.castShadow = true;
          extrude_Track_r.receiveShadow = true;
          scene.add(extrude_Track);
          scene.add(extrude_Track_r);

        })

        function draw_inbetween_line(positions) {
          var material = new THREE.LineBasicMaterial({
            color: 0xb00000,
            linewidth: 2
          });

          positions[0].forEach(function(pos, index) {
            var line_geometry = new THREE.Geometry();

            var between_p = centerPoint(pos, positions[1][index], 0.5);

            line_geometry.vertices.push(
              new THREE.Vector3(pos.x, pos.y, pos.z),
              new THREE.Vector3(between_p.x, between_p.y - .1, between_p.z),
              new THREE.Vector3(positions[1][index].x, positions[1][index].y, positions[1][index].z)
            );

            var line = new THREE.Line(line_geometry, material);
            scene.add(line);
          })
        }

        function draw_feets(positions) {

          var material = new THREE.LineBasicMaterial({
            color: 0x0D2339,
            linewidth: 2
          });

          positions.forEach(function(pos, index) {
            var line_geometry = new THREE.Geometry();
            line_geometry.vertices.push(
              new THREE.Vector3(pos.x, pos.y, pos.z),
              new THREE.Vector3(pos.x, -10, pos.z)
            );

            var line = new THREE.Line(line_geometry, material);
            scene.add(line);
          });

        }

        //___________________________________________ RAD

        ///rad_ground.json
        loader.load(å.model.rad_ground, function(geometry, material) {
          material.forEach(function(mat, index) {
            mat.shading = THREE.FlatShading;
          });

          var coaster_ground_m = new THREE.MeshFaceMaterial(material);
          rad_ground = new THREE.Mesh(geometry, coaster_ground_m);
          rad_ground.position.y = -3;
          rad_ground.position.x = 27.25;
          rad_ground.position.z = 16.5;
          rad_ground.rotation.y = 45 * Math.PI / 180;
          rad_ground.receiveShadow = true;
          rad_ground.castShadow = true;
          scene.add(rad_ground);
        });

        loader.load(å.model.rad, function(geometry, material) {

          material.forEach(function(mat, index) {
            mat.shading = THREE.FlatShading;
          });

          var coaster_m = new THREE.MeshFaceMaterial(material);
          // PLANE with Canvas textureFlare3

          geometry.mergeVertices();
          geometry.computeFaceNormals();
          geometry.computeVertexNormals();
          modifier.modify(geometry);

          rad = new THREE.Mesh(geometry, coaster_m);
          rad.position.y = 17;
          rad.position.x = 30;
          rad.position.z = 20;
          rad.rotation.y = 45 * Math.PI / 180;

          rad.update = function(time) {
            this.rotation.z += .01;
          }

          rad.castShadow = true;
          rad.receiveShadow = true;
          scene.add(rad);
        });

        loader.load(å.model.rad_wagon, function(geometry) {

          var wagon_m = new THREE.MeshLambertMaterial({
            color: 0xffffff,
            shading: THREE.FlatShading,
            side: THREE.DoubeSided
          })

          wagons = new THREE.Object3D();

          for (var i = 0; i < 20; i++) {
            rad_wagon = new THREE.Mesh(geometry, wagon_m);

            rad_wagon.position.x = Math.sin(i) * 15.5;
            rad_wagon.position.y = Math.cos(i) * 15.5;
            rad_wagon.position.z = 0;
            rad_wagon.update = function(time) {
              this.rotation.z -= .01;
            }
            wagons.add(rad_wagon);
          }
          wagons.position.y = 17;
          wagons.position.x = 30;
          wagons.position.z = 20;
          wagons.rotation.y = 45 * Math.PI / 180;
          wagons.update = function(time) {
            this.rotation.z += .01;
          }

          wagons.castShadow = true;
          wagons.receiveShadow = true;
          scene.add(wagons);
          //-26 1 -13
        });

        //___________________________________________ Monster

        loader.load(å.model.monster, function(geometry, material) {
          material.forEach(function(mat, index) {
            mat.shading = THREE.FlatShading;
          });

          var monster_m = new THREE.MeshFaceMaterial(material);
          monster = new THREE.Mesh(geometry, monster_m);
          monster.position.y = 22;
          monster.position.x = 35;
          monster.position.z = -23;
          monster.rotation.y = 0 * Math.PI / 180;
          monster.rotSpeed = 0.01;
          monster.direction = 1;
          monster.receiveShadow = true;
          monster.castShadow = true;
          monster.update = function(time) {

            if (this.rotation.x > 1.8 || this.rotation.x < -1.8) {
              this.direction *= (-1);
            }
            this.rotation.x += .01 * this.direction * (1.9 - Math.abs(this.rotation.x));
            this.rotation.y += .01;
          }
          scene.add(monster);
        });

        //___________________________________________ Monster Ground

        loader.load(å.model.monster_ground, function(geometry, material) {

          material.forEach(function(mat, index) {
            mat.shading = THREE.FlatShading;
          });

          var monster_ground_m = new THREE.MeshFaceMaterial(material);
          monster_ground = new THREE.Mesh(geometry, monster_ground_m);
          monster_ground.position.y = -2;
          monster_ground.position.x = 35;
          monster_ground.position.z = -23;
          monster_ground.rotation.y = 90 * Math.PI / 180;

          //monster_ground.castShadow = true;
          monster_ground.receiveShadow = true;
          scene.add(monster_ground);
        });

        //___________________________________________ GROUND

        loader.load(å.model.park, function(geometry, material) {

          material.forEach(function(mat, index) {
            mat.shading = THREE.FlatShading;
          });

          var material = new THREE.MeshFaceMaterial(material);

          console.log(material);
          //var coaster_m = new THREE.MeshPhongMaterial({
          //	color : 0xffffff,
          //	side: THREE.DoubleSide,
          //	shading: THREE.FlatShading
          //});
          ground = new THREE.Mesh(geometry, material);
          ground.rotation.y = 205 * Math.PI / 180;
          ground.position.y = -4.5;
          ground.position.z = 23;
          ground.castShadow = true;
          ground.receiveShadow = true;
          scene.add(ground);
        });

        loader.load(å.model.cloud, function(geometry) {
          var cloud_mat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
          })

          var clouds = [];
          var clouds_obj = new THREE.Object3D();
          for (var c = 0; c < 50; c++) {
            clouds[c] = new THREE.Mesh(geometry, cloud_mat);
            clouds[c].rotation.y = 205 * c * Math.PI / 180;
            clouds[c].position.y = 60 + Math.sin(c) * randNum(0, 20, true);
            clouds[c].position.x = Math.sin(c) * randNum(0, 500, true);
            clouds[c].position.z = Math.cos(c) * randNum(0, 500, true);
            clouds[c].castShadow = true;
            clouds[c].receiveShadow = true;
            clouds_obj.add(clouds[c]);
          }

          scene.add(clouds_obj);
        });
        //___________________________________________ Dust
        var dust = new THREE.Geometry();

        var dMaterial = new THREE.PointCloudMaterial({
          color: 0xffffff,
          size: 0.2,
          transparent: true,
          opacity: .25,
        });

        for (var i = 0; i < 1000; i++) {
          var x = randNum(0, 100, true);
          var y = randNum(0, 100, true);
          var z = randNum(0, 100, true);
          dust.vertices.push(new THREE.Vector3(x, y, z));
        }

        var particleSystem_1 = new THREE.PointCloud(dust, dMaterial);
        scene.add(particleSystem_1);

        //___________________________________________ Konfetti
        var konf = new THREE.Geometry();

        var kMaterial = new THREE.PointCloudMaterial({
          //color: 0xff0000,
          size: 1,
          transparent: true,
          opacity: 1,
          vertexColors: true
        });

        var colors = [];
        var color_array = [0x4285F4, 0x34A853, , 0xFBBC05, 0xEA4335, 0xffffff];
        var turbulence = []
        for (var i = 0; i < 500; i++) {

          var x = randNum(0, 0.05, true);
          var y = randNum(0.1, 0.25, false);
          var z = randNum(0, 0.05, true);

          konf.vertices.push(new THREE.Vector3(0, 0, 0));
          turbulence.push(new THREE.Vector3(x, y, z));
          //;
          colors.push(new THREE.Color(color_array[Math.floor(Math.random() * color_array.length)]));
        }
        konfSystem = new THREE.PointCloud(konf, kMaterial);
        konfSystem.turbulence = turbulence
        console.log(konfSystem);
        konfSystem.geometry.colors = colors;
        konfSystem.geometry.colorsNeedUpdate = true;

        konfSystem.position.set(-40, 0, -55);

        konfSystem.update = function(time) {
          var that = this;
          this.geometry.vertices.forEach(function(p, index) {

            p.x += that.turbulence[index].x;
            p.y += that.turbulence[index].y;
            p.z += that.turbulence[index].z;

            var radius_checker = pointInCircle({
              x: 0,
              y: 0,
              z: 0
            }, p, randNum(9, 15));

            //console.log(radius_checker);
            if (!radius_checker[0]) {
              p.x = 0;
              p.y = 0;
              p.z = 0;
            }
          });

          this.geometry.verticesNeedUpdate = true;
        }

        sec_konfSystem = konfSystem.clone();
        sec_konfSystem.position.set(0, 0, -75);

        scene.add(konfSystem);

        scene.add(sec_konfSystem);

        //___________________________________________SEA
        sea_geometry = new THREE.PlaneGeometry(55, 55, 32, 32);
        sea_material = new THREE.MeshPhongMaterial({
          color: 0x0000ff,
          transparent: true,
          opacity: .85,
          shininess: 10,
          //			  shading: THREE.FlatShading,
          // side : THREE.DoubleSide

        });
        for (var i = 0; i < sea_geometry.vertices.length; i++) {
          sea_geometry.vertices[i].z = Math.random() * 1;
        }
        sea = new THREE.Mesh(sea_geometry, sea_material);
        sea.rotation.x = -Math.PI / 2;
        sea.position.x = -12;
        sea.position.y = -7;
        sea.visible = false;
        sea.receiveShadow = true;
        //sea.castShadow = true;

        scene.add(sea);

      } // end of init

    // __________________________________ Events

    var info = document.getElementById('info');
    var action_vr = document.getElementById('vr_mode');
    var action_desktop = document.getElementById('desktop_mode');
    var action_rollercoaster = document.getElementById('rollercoaster');
    var action_rad = document.getElementById('ferris_wheel');
    var action_monster = document.getElementById('monster');
    var action_explore = document.getElementById('explore');

    info.addEventListener('mouseover', function(event) {
      controls.enabled = false;
    });

    info.addEventListener('mouseout', function(event) {
      controls.enabled = true;
    });

    function check_Camera(camera) {

      if (camera.parent.type !== 'Scene') {
        camera.clone();

        THREE.SceneUtils.detach(camera, camera.parent, scene);
        scene.add(camera);

        controls.update();
        camera.position.set(0, 0, 0);
      }
    }

    action_rollercoaster.addEventListener('click', function(event) {
      camera.position.set(0, 0, 0);
      å.track.enabled = true;
      å.monster.enabled = false;
      å.rad.enabled = false;

      check_Camera(camera)
        //controls.update();
    });
    action_monster.addEventListener('click', function(event) {
      camera.position.set(0, 0, 0);
      å.track.enabled = false;
      å.monster.enabled = true;
      å.rad.enabled = false;

      check_Camera(camera)
    });
    action_rad.addEventListener('click', function(event) {
      camera.position.set(0, 0, 0);
      å.track.enabled = false;
      å.monster.enabled = false;
      å.rad.enabled = true;

      check_Camera(camera)
        //controls.update();
    });

    action_explore.addEventListener('click', function(event) {
      camera.position.set(0, 0, 0);
      å.track.enabled = false;
      å.monster.enabled = false;
      å.rad.enabled = false;
      å.explore.enabled = false;

      check_Camera(camera);

      camera.position.set(0, 0, 10);
      camera.lookAt(new THREE.Vector3(0, 0, 1));
      if (!å.mode.vr) {
        controls = orbit_controls(camera);
      }
      //controls.update();
    });
    //___________________________________________

    action_desktop.addEventListener('click', function(event) {
      å.mode.vr = false;
      å.mode.desktop = true;
      å.mode.orientation = false;

      //
      controls = orbit_controls(controls);
      onWindowResize();
      controls.enabled = true;
    });

    action_vr.addEventListener('click', function(event) {
      å.mode.orientation = true;
      controls = vr_controls(controls);
    });

    window.addEventListener('resize', onWindowResize, false);

    //___________________________________________ click

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      if (å.mode.desktop) {
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
      if (å.mode.vr) {
        effect.setSize(window.innerWidth, window.innerHeight);
      }
    }

    //___________________________________________ RENDER 

    function animate() {

      requestAnimationFrame(animate);

      render();

    }

    var current = 0;

    function render(time) {

      var delta = .75 * clock.getDelta();

      if (helper !== undefined) {
        helper.update();
      }

      konfSystem.update(time);

      if (typeof rad !== "undefined") {
        rad.update(time);
        //rad_wagon.update(time);
        wagons.update(time);
        wagons.children.forEach(function(wagon, index) {
          wagon.update(time);
        });
        monster.update(time);
        sea.visible =true;
      }

      if (å.mode.desktop) {
        renderer.render(scene, camera);
      }
      if (å.mode.orientation) {
        effect.render(scene, camera);

      }
      // update skinning
      if (å.mode.desktop || !å.mode.orientation) {
        camera.update(time);
      } else {
        var delta = clock.getDelta();
        controls.update(delta);
      }
    }