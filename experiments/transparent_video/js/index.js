    var container;

    var camera, scene, controls;
    var raycaster = new THREE.Raycaster();

    var renderer;
    var floor;
    var pointLight;

    function randNum(min, max, bool) {

      var num = Math.random() * max + min;
      if (bool ||  bool === "undefined") {
        num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
      }
      return num;
    }

    function hexToRgb(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }

    //___________________________________________ GUI

    var ImageOptions = function() {
      this.overlay_color = "rgb(0, 128, 255,1)";
      this.overlay_r = 0;
      this.overlay_g = 128;
      this.overlay_b = 255;
      this.overlay_a = 1;
      this.overlay = false;
      this.threshold = true;
      this.threshold_invert = true;
      this.threshold_value = 188;
      this.threshold_r = 0.21;
      this.threshold_g = 0.71;
      this.threshold_b = 0.07;
      this.morph_video = false;
      this.live_cam_input = function() {
        var errorCallback = function(e) {
          console.log('Nope!', e);
        };
        if (navigator.getUserMedia) {
          navigator.getUserMedia({
            audio: false,
            video: true
          }, function(stream) {
            video.src = window.URL.createObjectURL(stream);
          }, errorCallback);
        } else {
          video.src = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/61062/passing_through.mp4';
        }
      }

      // Define render logic ...
    };
    var imageOptions = new ImageOptions();
    var gui = new dat.GUI();
    var overlay = gui.addFolder('Overlay');
    var threshold_f = gui.addFolder('Threshold');
    var overlay_color = overlay.addColor(imageOptions, 'overlay_color');

    overlay.add(imageOptions, 'overlay');
    gui.add(imageOptions, 'morph_video');
    gui.add(imageOptions, 'live_cam_input');

    threshold_f.add(imageOptions, 'threshold');
    threshold_f.add(imageOptions, 'threshold_value', 0, 255);
    threshold_f.add(imageOptions, 'threshold_invert');

    threshold_f.add(imageOptions, 'threshold_r', 0, 2);
    threshold_f.add(imageOptions, 'threshold_g', 0, 2);
    threshold_f.add(imageOptions, 'threshold_b', 0, 2);

    overlay_color.onChange(function(color) {
      var intern_color = hexToRgb(color);

      imageOptions.overlay_r = intern_color.r;
      imageOptions.overlay_g = intern_color.g;
      imageOptions.overlay_b = intern_color.b;
    });

    //___________________________________________ KICK IT OFF
    init();
    animate();

    //___________________________________________ INIT
    function init() {

        navigator.getUserMedia = navigator.getUserMedia ||
          navigator.webkitGetUserMedia ||
          navigator.mozGetUserMedia ||
          navigator.msGetUserMedia;

        container = document.getElementById('container');

        camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, .1, 10000);
        camera.position.x = -650;
        camera.position.y = 35;
        camera.position.z = -1600;
        camera.move_direction = 1;
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.0005);

        scene.add(camera);

        //___________________________________________ CONTROLS
        controls = new THREE.OrbitControls(camera);
        controls.damping = 0.2;
        controls.addEventListener('change', render);
        //controls.maxPolarAngle = Math.PI/2;
        camera.lookAt(new THREE.Vector3(0, 50, 0));
        controls.target = new THREE.Vector3(0, 50, 0);

        //___________________________________________ HEMI

        var ambient = new THREE.AmbientLight(0x333333);

        scene.add(ambient);

        pointLight = new THREE.SpotLight(0xeeeeee, 2);
        pointLight.position.set(0, 0, -1000);
        pointLight.exponent = 20;

        pointLight.castShadow = true;

        pointLight.shadowMapWidth = 1024;
        pointLight.shadowMapHeight = 1024;

        var d = 350;
        //pointLight = new THREE.SpotLight( 0xF0C043, 2 );
        pointLight.shadowCameraLeft = -d;
        pointLight.shadowCameraRight = d;
        pointLight.shadowCameraTop = d;
        pointLight.shadowCameraBottom = -d;
        pointLight.shadowCameraNear = 1;

        scene.add(pointLight);

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

        //___________________________________________ Image

        video = document.getElementById('myVideo');
        video.addEventListener('progress', function() {
          var loadedPercentage = this.buffered.end(0) / this.duration;
          console.log(loadedPercentage);
        });

        videoImage = document.createElement('canvas');
        videoImage.width = 480 * 2;
        videoImage.height = 270 * 2;
        videoImageContext = videoImage.getContext('2d');
        videoImageContext.fillStyle = '#ffffff';
        videoImageContext.fillRect(0, 0, videoImage.width, videoImage.height);

        videoTexture = new THREE.Texture(videoImage);
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;

        videoTexture.wrapS = videoTexture.wrapT = THREE.ClampToEdgeWrapping;

        var plane_mat = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          map: videoTexture,
          wireframe: false,
          shininess: 0,
          transparent: true,
          depthTest: true,
          depthWrite: true,
          alphaTest: .6,
          side: THREE.DoubleSide,
          shading: THREE.SmoothShading
        });
        var fac = 6;
        var plane_geo = new THREE.PlaneGeometry(480 * 2 / fac, 270 * 2 / fac, 128);

        //SHADER from http://threejs.org/examples/webgl_animation_cloth.html
        var uniforms = {
          texture: {
            type: "t",
            value: videoTexture
          }
        };
        var vertexShader = document.getElementById('vertexShaderDepth').textContent;
        var fragmentShader = document.getElementById('fragmentShaderDepth').textContent;
        //___________________________________________

        plane = new THREE.Mesh(plane_geo, plane_mat);
        plane.customDepthMaterial = new THREE.ShaderMaterial({
          uniforms: uniforms,
          vertexShader: vertexShader,
          fragmentShader: fragmentShader
        });
        //plane.rotation.y = Math.PI;
        //plane.receiveShadow = true;
        plane.castShadow = true;
        //plane.visible = false;
        plane.frequencer = 0.1;
        plane.direction = 1;
        plane.position.z = -250;
        plane.geometry.vertices.forEach(function(p, index) {
          //p.z = Math.sin(plane.frequencer*index) * 20;
        });

        plane.update = function(time) {

          var that = this;
          this.frequencer += .001 * this.direction;

          if (this.frequencer >= .9 || this.frequencer <= 0) {
            this.direction *= (-1);
          }
          if(imageOptions.morph_video){
            this.geometry.vertices.forEach(function(p, index) {
              //if(index % 3){

              p.z = Math.sin(that.frequencer * index) * 10; // randNum(0.8,1.3,false);
              //}
            });

            this.geometry.verticesNeedUpdate = true;
          }
          }

        scene.add(plane);

        //___________________________________________ FLOOR

        var floor_geo = new THREE.PlaneGeometry(5000, 5000, 128, 128);
        var floor_mat = new THREE.MeshLambertMaterial({
          color: 0x333333,
          shading: THREE.FlatShading,
          side: THREE.DoubleSide
        });

        floor = new THREE.Mesh(floor_geo, floor_mat);
        //floor.rotation.x = 90 * Math.PI / 180;
        floor.position.z = 150;
        floor.receiveShadow = true;
        //floor.castShadow = true;
        for (var i = 0; i < floor.geometry.vertices.length; i++) {
          floor.geometry.vertices[i].z = Math.random() * 20;
        }
        floor.geometry.verticesNeedUpdate = true;
        var edges = new THREE.WireframeHelper(floor, 0x333333);
        scene.add(edges);
        scene.add(floor);
      } // end of init

    //___________________________________________ Event in Space
    window.addEventListener('resize', onWindowResize, false);
    //___________________________________________ click

    function onWindowResize() {

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);

    }

    //___________________________________________ RENDER 

    function animate() {

      requestAnimationFrame(animate);

      render();

    }

    function render(time) {

      function manipulate(context) {

        context.drawImage(video, 0, 0, 480 * 2, 270 * 2);

        //img.style.display = 'none';
        var videoData = context.getImageData(0, 0, 480 * 2, 270 * 2);
        context.clearRect(0, 0, 480 * 2, 270 * 2);
        var data = videoData.data;
        for (var i = 0; i < data.length; i += 4) {

          // TRESHOLD
          if (imageOptions.threshold) {
            var r = data[i];
            var g = data[i + 1];
            var b = data[i + 2];
            var v = (imageOptions.threshold_r * r + imageOptions.threshold_g * g + imageOptions.threshold_b * b >= imageOptions.threshold_value) ? 255 : 0;

            if (v == 0 && !imageOptions.threshold_invert) {
              data[i + 3] = 0;
            }
            if (v == 255 && imageOptions.threshold_invert) {
              data[i + 3] = 0;
            }
          }
          // COLOR Overlay
          if (imageOptions.overlay) {
            data[i] = data[i] + imageOptions.overlay_r; // red
            data[i + 1] = data[i + 1] + imageOptions.overlay_g; // green
            data[i + 2] = data[i + 2] + imageOptions.overlay_b; // blue

          }
        }
        context.putImageData(videoData, 0, 0);
      }

      manipulate(videoImageContext);
      //console.log();
      if (videoTexture) {
        videoTexture.needsUpdate = true;
      }

      plane.update(time);

      camera.lookAt(new THREE.Vector3(0, 20, 0));
      renderer.render(scene, camera);

    }