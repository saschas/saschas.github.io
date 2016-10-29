/*
	Basic Setup
*/
//(function(){
//__________ Variables

function prepareTexture(texture,wrap) {
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(wrap,wrap);
}
function loadGeo(name,url){
  loader.load(url,function(geometry,material){
    assets.geometry[name] = geometry;
    assets.materials[name] = material;
  });
}

function loadTexture(name,url){
  textureLoader.load(url,function(t){
    assets.textures[name] = t;
  });
}


var bokehPass;
var main_color = 0x000000;
var time = 0;
var canvas_height = window.innerHeight;
var canvas_width = window.innerWidth;
var manager = new THREE.LoadingManager();
var leaves = [];
var assets = {
  geometry : {},
  textures : {},
  materials : {}
}
manager.onProgress = function ( item, loaded, total ) {

  console.log( item, loaded, total );

  if(loaded == total){
    init();
  }
};

var loader = new THREE.JSONLoader(manager);
var textureLoader = new THREE.TextureLoader(manager);
var scene, camera,renderer,controls;
var tree;
var cubeCamera;
var postprocessing = {};

var assetsToLoad = {
  geometry : {
    tree :'assets/json/tree.json',
    stone : 'assets/json/stone.json',
    sky : 'assets/json/sky.json',
    leaf : 'assets/json/leaf.json',
    ground : 'assets/json/ground.json'
  },
  textures : {
    bark_albedo : 'dist/textures/bark_albedo.jpg',
    bark_normal : 'dist/textures/bark_normal.jpg',
    leaves_albedo : 'dist/textures/leaves_albedo.jpg',
    leaves_alphaMap : 'dist/textures/leaves_alphaMap.jpg',
    leaves_normal : 'dist/textures/leaves_normal.jpg',
    ground : 'dist/textures/ground.jpg',
    ground_normal : 'dist/textures/ground_normal.jpg',
    ground_displace : 'dist/textures/ground_displace.jpg',
    rock : 'dist/textures/rock.jpg',
    rock_normal : 'dist/textures/rock_normal.jpg',
    sky : 'dist/textures/sky.jpg',
    ground_nature : 'dist/textures/ground_nature.jpg',
    ground_nature_normal : 'dist/textures/ground_nature_normal.jpg',
    textureFlare0 : 'dist/textures/lensflare0.png',
    textureFlare1 : 'dist/textures/lensflare2.png',
    textureFlare2 : 'dist/textures/lensflare3.png',

  }
}


for(geo in assetsToLoad.geometry){
  loadGeo(geo, assetsToLoad.geometry[geo]);
}

for(tex in assetsToLoad.textures){
  loadTexture(tex, assetsToLoad.textures[tex]);
}

function init(){
//__________ scene
  scene = new THREE.Scene();
//__________ camera
  camera = new THREE.PerspectiveCamera( 55, canvas_width/canvas_height, 0.1, 1000 );
  camera.position.set(10,3,-10);

	scene.add(camera);

  cubeCamera = new THREE.CubeCamera( 1, 100000, 128 );
      scene.add( cubeCamera );
//__________ renderer
  renderer = new THREE.WebGLRenderer({ 
    alpha: true,
    antialias:true
  });
  renderer.setSize( canvas_width, canvas_height );
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.setClearColor(main_color,1);
  document.body.appendChild( renderer.domElement );
//__________ resize

//__________ controls
  controls = new THREE.OrbitControls( camera );
  controls.target.set(0,5,0);
  controls.damping = 0.2;
  controls.maxPolarAngle = 110 * Math.PI/180;
  controls.minPolarAngle = 1;
  controls.minDistance = 10;
  controls.maxDistance = 14;
  //__________ light

  var ambient = new THREE.AmbientLight(0xaaaaaa);
      scene.add(ambient);


  var spotLight = new THREE.SpotLight(0xffffff);
      spotLight.position.set( 0, 50, 150 );
      spotLight.intensity = 1;
      spotLight.castShadow = true;
      spotLight.angle = Math.PI / 5;
      spotLight.shadow.mapSize.width = 1024;
      spotLight.shadow.mapSize.height = 1024;

      spotLight.shadow.camera.near = 5;
      spotLight.shadow.camera.far = 100;
      spotLight.shadow.camera.fov = camera.fov;
      var d = 100;
      spotLight.shadow.camera.left = -d;
      spotLight.shadow.camera.right = d;
      spotLight.shadow.camera.top = -d;
      spotLight.shadow.camera.bottom = d;
      scene.add(spotLight);

  var flareColor = new THREE.Color( 0xffffff );
      flareColor.setHSL( 50, 90, 10 + 0.5 );

      var lensFlare = new THREE.LensFlare( assets.textures.textureFlare0, 700, 0.0, THREE.AdditiveBlending, flareColor );

      lensFlare.add( assets.textures.textureFlare1, 512, 0.0, THREE.AdditiveBlending );
      lensFlare.add( assets.textures.textureFlare1, 512, 0.0, THREE.AdditiveBlending );
      lensFlare.add( assets.textures.textureFlare1, 512, 0.0, THREE.AdditiveBlending );

      lensFlare.add( assets.textures.textureFlare2, 60, 0.9, THREE.AdditiveBlending );
      lensFlare.add( assets.textures.textureFlare2, 70, 0.7, THREE.AdditiveBlending );
      lensFlare.add( assets.textures.textureFlare2, 120, 0.9, THREE.AdditiveBlending );

      lensFlare.customUpdateCallback = function( object ) {

        var f, fl = object.lensFlares.length;
        var flare;
        var vecX = -object.positionScreen.x * 2;
        var vecY = -object.positionScreen.y * 2;


        for( f = 0; f < fl; f++ ) {

          flare = object.lensFlares[ f ];

          flare.x = object.positionScreen.x + vecX * flare.distance;
          flare.y = object.positionScreen.y + vecY * flare.distance;

          flare.rotation = 0;

        }

        object.lensFlares[ 2 ].y += 0.025;

      };

      lensFlare.position.copy( spotLight.position );

      scene.add( lensFlare );

  //__________ post
  var renderPass = new THREE.RenderPass( scene, camera );

    bokehPass = new THREE.BokehPass( scene, camera, {
    focus:    1.,
    aperture: .015,
    maxblur:  1.0,

    width: canvas_width,
    height: canvas_height
  } );

  bokehPass.renderToScreen = false;

  var composer = new THREE.EffectComposer( renderer );

  var bloomPass = new THREE.UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight), //resolution
    .25,//strength
    .25, //radius
    .15  //threshold
    );
  
  var depthMaterial = new THREE.MeshDepthMaterial();
  depthMaterial.depthPacking = THREE.RGBADepthPacking;
  depthMaterial.blending = THREE.NoBlending;

  var pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter };
  depthRenderTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, pars );

  // Setup SSAO pass
  var ssaoPass = new THREE.ShaderPass( THREE.SSAOShader );
  ssaoPass.renderToScreen = true;
  ssaoPass.uniforms[ "tDepth" ].value = depthRenderTarget.texture;
  ssaoPass.uniforms[ 'size' ].value.set( window.innerWidth, window.innerHeight );
  ssaoPass.uniforms[ 'cameraNear' ].value = camera.near;
  ssaoPass.uniforms[ 'cameraFar' ].value = camera.far;
  ssaoPass.uniforms[ 'onlyAO' ].value = ( postprocessing.renderMode == 1 );
  ssaoPass.uniforms[ 'aoClamp' ].value = .01;
  ssaoPass.uniforms[ 'lumInfluence' ].value = .50;

  composer.addPass( renderPass );
  composer.addPass(bloomPass);
  composer.addPass( bokehPass );
  composer.addPass( ssaoPass );

  postprocessing.composer = composer;
  postprocessing.bokeh = bokehPass;
  //__________ cubes

  window.onresize = function(){
    canvas_height = window.innerHeight;
    canvas_width = window.innerWidth;
    camera.aspect = canvas_width / canvas_height;
    camera.updateProjectionMatrix();
    renderer.setSize( canvas_width, canvas_height );
  }


  function createTree(geometry,material){

    prepareTexture(assets.textures.bark_albedo,30);
    prepareTexture(assets.textures.bark_normal,30);
    material[0] = new THREE.MeshStandardMaterial({
      color : 0x555555,
      map : assets.textures.bark_albedo,
      bumpMap : assets.textures.bark_normal,
      bumpScale : .1,
      roughness : 1,
      metalness : .2,
    });

    material[1] = new THREE.MeshStandardMaterial({
      color : 0x999999,
      map : assets.textures.leaves_albedo,
      transparent : true,
      roughness : .9,
      metalness : 0,
      alphaMap : assets.textures.leaves_alphaMap,
      bumpScale :.005,
      bumpMap : assets.textures.leaves_normal,
      side : THREE.DoubleSide,
      depthWrite : true,
      depthTest : true,
      alphaTest : 0.9,
      vertexColors : THREE.FaceColors
    });
    geometry.faces.forEach(function(face,index){
      var rand = -50 + Math.random() * 70;
      var hue = Math.floor((100 - rand) * 70 / 100);

       face.color.setHSL( hue,Math.abs(rand - 50)/50, .45);
      
    });

    var leaf = new THREE.Mesh(assets.geometry.leaf,material[1]);
    for(var l = 0;l < 50;l++){
      leaves[l] = leaf.clone();

      leaves[l]._own = {
        vel : {
          x : Math.random()*10,
          y : Math.random()*10,
          z : Math.random()*10,
        }
      }
      var scaleFac = .75 + Math.random()*.25;
      leaves[l].scale.set(scaleFac,scaleFac,scaleFac);
      leaves[l].position.x = -3 + Math.random() * 6;
      leaves[l].position.z = -3 + Math.random() * 6;
      leaves[l].position.y = -3 + Math.random() * 6;

      leaves[l].rotation.x = -10 + Math.random() * 20;
      leaves[l].rotation.y = -10 + Math.random() * 20;
      leaves[l].rotation.z = -10 + Math.random() * 20;


      scene.add(leaves[l]);
    }
    var bottomLeafes = [];
    for(var p=0;p<150;p++){
      bottomLeafes[p] = leaf.clone();
      bottomLeafes[p].position.set(-5+ Math.random() * 10,0.1,-Math.random()*10);
      bottomLeafes[p].rotation.set(0,0.1,0);
      var scaleFac = .75 + Math.random()*.25;
      bottomLeafes[p].scale.set(scaleFac,scaleFac,scaleFac);
      scene.add(bottomLeafes[p]);
    }

   
    tree = new THREE.Mesh(geometry,new THREE.MeshFaceMaterial(material));
    tree.receiveShadow = true;
    tree.castShadow = true;

    scene.add(tree);
  }


   prepareTexture(assets.textures.ground,5);
   prepareTexture(assets.textures.ground_normal,5);
   prepareTexture(assets.textures.ground_displace,10);

  var plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(50,50,512,512),new THREE.MeshStandardMaterial({
    color : 0xcccccc,
    //shading : THREE.FlatShading,
    map : assets.textures.ground,
    bumpMap: assets.textures.ground_normal,
    displacementMap: assets.textures.ground_displace,
    envMap: cubeCamera.renderTarget.texture,
    envMapIntensity: .25,
    displacementScale: .1,
    bumpScale: -.25,
    roughness : .8,
    metalness : 0.9
  }));

  // plane.geometry.vertices.forEach(function(v,index){

  //   v.z += Math.random() * .15;
  // });
  plane.geometry.verticesNeedsUpdate = true;
  plane.receiveShadow = true;
  plane.rotation.x = -90 * Math.PI / 180;
  plane.rotation.z = -45 * Math.PI / 180;
  plane.scale.set(1,1,1);
  scene.add(plane);

  //_________________________________________________________________
  var sky = new THREE.Mesh(assets.geometry.sky,new THREE.MeshBasicMaterial({
    color : 0xcccccc,
    map : assets.textures.sky
  }));
  sky.scale.set(500,500,500);
  sky.rotation.y = -90 * Math.PI / 180;
  scene.add(sky);


  //_________________________________________________________________

  createTree(assets.geometry.tree,assets.materials.tree);


  prepareTexture(assets.textures.rock,2);
  prepareTexture(assets.textures.rock_normal,2);
  var stone = new THREE.Mesh(assets.geometry.stone,new THREE.MeshStandardMaterial({
    color : 0x666666,
    map : assets.textures.rock,
    bumpMap : assets.textures.rock_normal,
    bumpScale : .2,
    envMap: cubeCamera.renderTarget.texture,
    roughness : 1,
    metalness : 0
  }));

  stone.receiveShadow = true;
  stone.castShadow = true;
  var stones = [];

  for(var i=0;i<36;i++){
    stones[i] = stone.clone();
    stones[i].position.y = .05 - Math.random() * .05;
    stones[i].rotation.y = i * 10 * Math.PI / 180;
    scene.add(stones[i]);
  }

  var ground = new THREE.Mesh(assets.geometry.ground,new THREE.MeshStandardMaterial({
    color : 0x999999,
    map :  assets.textures.ground_nature,
    bumpMap :  assets.textures.ground_nature_normal,
    roughness : 1,
    metalness : 0
  }));
  ground.position.y += .05;
  scene.add(ground);



  render(time);
}//end of init


//__________ render
var render = function (time) { 
  requestAnimationFrame( render );
  controls.update();
  animation(time);

  //cubeCamera.updateCubeMap( renderer, scene );
  postprocessing.composer.render( 0.1 );
//  renderer.render(scene, camera);
};
//__________ animation
function animation(time){

  controls.rotateLeft(Math.sin(0.0005 * time) * .0025);
   leaves.forEach(function(l,index){
      l.position.y -= .015;
      l.position.z -= .025;

      l.rotation.x += l._own.vel.x * .01;
      l.rotation.z += l._own.vel.z * .01;

      if(l.position.y <= -.5){
        l.position.z = -3 + Math.random()* 6;
        l.position.y = -5 + Math.random()* 14;
      }
    });
};
//__________

//}()); //__eof
