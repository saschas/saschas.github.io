var SCREEN_WIDTH = window.innerWidth;
      var SCREEN_HEIGHT = window.innerHeight;
      var FLOOR = -250;
      var container;
      var camera, scene;
      var renderer;
      var mesh, helper;
      var mouseX = 0, mouseY = 0;
      var windowHalfX = window.innerWidth / 2;
      var windowHalfY = window.innerHeight / 2;
      var clock = new THREE.Clock();
      init();
      animate();
      function init() {
        container = document.getElementById( 'container' );
        camera = new THREE.PerspectiveCamera( 30, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
        camera.position.y = 60;
        camera.position.z = 300;

        scene = new THREE.Scene();

        scene.fog = new THREE.FogExp2( 0xffffff, 0.0015 );

        scene.add( camera );

        // GROUND

        var geometry = new THREE.PlaneBufferGeometry( 16000, 16000 );
        var material = new THREE.MeshPhongMaterial( {color : 0xffffff} );
            
        var floor = new THREE.Mesh(geometry,material);
        floor.position.y = 15;
            floor.rotation.x = -90 * Math.PI/180;
            floor.receiveShadow = true;
            floor.castShadow = true;
        scene.add(floor);

        console.log(floor);
//
       var controls = new THREE.OrbitControls( camera );
           controls.damping = 0.2;
           controls.addEventListener( 'change', render );
           //
           controls.maxPolarAngle = Math.PI/2;
           
           controls.target =  new THREE.Vector3(0,50,0);
    camera.updateProjectionMatrix();
        var ambient = new THREE.AmbientLight( 0x222222 );
        //scene.add( ambient );


        var light = new THREE.DirectionalLight( 0xebf3ff, 1 );
        light.position.set( 0, 250, 200 ).multiplyScalar( 1 );
        scene.add( light );

        light.castShadow = true;

        light.shadowMapWidth = 1024;
        light.shadowMapHeight = 1024;

        var d = 390;

        light.shadowCameraLeft = -d;
        light.shadowCameraRight = d;
        light.shadowCameraTop = d * 1.5;
        light.shadowCameraBottom = -d;

        light.shadowCameraFar = 3500;
        //light.shadowCameraVisible = true;

        // RENDERER

        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setClearColor( 0xffffff );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
        renderer.domElement.style.position = "relative";

        container.appendChild( renderer.domElement );

        renderer.gammaInput = true;
        renderer.gammaOutput = true;

        renderer.shadowMapEnabled = true;

        var loader = new THREE.JSONLoader();
        loader.load( "https://s3-us-west-2.amazonaws.com/s.cdpn.io/61062/Basemesh.json", function ( geometry, materials ) {
          createScene( geometry, materials, 0, 0, 0, 20 )

        });

        window.addEventListener( 'resize', onWindowResize, false );

      }

      function onWindowResize() {

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

      }

      function ensureLoop( animation ){
        for ( var i = 0; i < animation.hierarchy.length; i ++ ) {

          var bone = animation.hierarchy[ i ];
          var first = bone.keys[ 0 ];
          var last = bone.keys[ bone.keys.length - 1 ];

          last.pos = first.pos;
          last.rot = first.rot;
          last.scl = first.scl;
        }
      }

      function createScene( geometry, materials, x, y, z, s ) {
      
        geometry.computeBoundingBox();
        var bb = geometry.boundingBox;
      var material = new THREE.MeshPhongMaterial({
            color : 0xcccccc,
            shininess : 200
        });
        material.skinning = true;
        material.wrapAround = true;
        mesh = new THREE.SkinnedMesh( geometry,material );
        mesh.position.set( x, 15+(y - bb.min.y * s), z );
        //mesh.rotation.y = i;
        mesh.scale.set( s, s, s );
       var crowd = [];
      for(var i=0;i<10;i++){
            crowd[i] = mesh.clone();
            crowd[i].position.x = Math.sin(i) * 50;
            crowd[i].position.z = Math.cos(i) * 50;
            crowd[i].rotation.y = i * 10;
            crowd[i].castShadow = true;
            crowd[i].receiveShadow = true;
            scene.add( crowd[i] );
             
             var animation = new THREE.Animation( crowd[i], geometry.animation );
                    animation.play();
                    animation.timeScale = 1.5;
        }

        

        helper = new THREE.SkeletonHelper( mesh );
        helper.material.linewidth = 1;
        helper.visible = false;
        scene.add( helper );
}

    


 

      function animate() {

        requestAnimationFrame( animate );
        
        render();

      }

      function render() {

        var delta = .75 * clock.getDelta();
        
        // update skinning

        THREE.AnimationHandler.update( delta );

        if ( helper !== undefined ){
              helper.update();
        }

        renderer.render( scene, camera );

      }