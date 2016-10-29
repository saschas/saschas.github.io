
/*
	Basic Setup
*/
//(function(){
var main_color = 0x000000;
var time = 0;
var canvas_height = window.innerHeight;
var canvas_width = window.innerWidth;
var floor;
var screenSize = {
  x : 1024,
  y : 468
}
var postprocessing = {};
var scene,renderer,controls;
var texture;
var playBox, rePlayBox;
var explosions = [];
var bounces = [];

var assets = {
  floor : {},
  rohr : {},
  screen : {},
  sounds : {}
}
var gameOptions = {
  playing : false,
  audio : false,
  playerCount : 1,
  playSelect : false,
  menuIndex : 0,
  menuMax : 2,
  alreadyPlayed : false,
  mute : false,
  loaded : false
}

var keyCode = {
  player1 : {
    up : false,
    down : false,
    left : false,
    right : false
  },
  player2 : {
    up : false,
    down : false,
    left : false,
    right : false
  }
}
var keyMap = {
  37 : false,
  38 : false,
  39 : false,
  40 : false,
  65 : false,
  68 : false,
  83 : false,
  87 : false,
  //space / esc
  32 : false,
  27 : false
}

var menu = {
  title : "PONG",
  playTitle : "PLAY"
}

var player = {
  a : {
    points : 0,
    height : 100,
    vel : {
      x : 0,
      y : 0
    },
    bounce : {
      x : 0,
      y : 0,
      multiplier : 0
    },
    size : {
      x : 5,
      y : 100
    },
    pos : {
      x : 10,
      y : screenSize.y / 2
    }
  },
  b : {
    points : 0,
    height : 100,
    vel : {
      x : 0,
      y : 0
    },
    bounce : {
      x : 0,
      y : 0,
      multiplier : 0
    },
    size : {
      x : 5,
      y : 100
    },
    pos : {
      x : screenSize.x - 15 ,
      y : screenSize.y / 2
    }
  }
}

var ball = {
  size : {
    x : 10,
    y : 10
  },
  pos : {
    x : screenSize.x / 2,
    y : screenSize.y / 2
  },
  spin : {
    x : 0,
    y : 0
  },
  vel : {
    x : 1,
    y : 1
  },
  dir : {
    x : 1,
    y : 1
  },
  speed : {
    x : 5,
    y : 5
  }

}
//__________ HelperFunctions

function hashCode(s){
  return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
}
function isInRange(checker,min, max) {
    return (checker >= min && checker <= max);
};
function wrapTexture(tex,wrapSize){
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set( wrapSize,wrapSize);
}

function loaderBar(parent){
  var loadEl = document.createElement('div');
      loadEl.classList.add('loader');

  var loadInner = document.createElement('div');
      loadInner.classList.add('loadInner');

    loadEl.appendChild(loadInner);
  
  parent.appendChild(loadEl);

  this.update = function(progress){
    loadInner.style.width = progress + "%";
  }
  this.remove = function(){
    loadEl.parentElement.removeChild(loadEl);
  }
}


//__________ Loader
var manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total ) {
    loaderBarEl.update(loaded / total * 100 );
      if(loaded == total){
        gameOptions.loaded = true;
        loaderBarEl.remove();
        init();
      }
    };

var loader = new THREE.JSONLoader(manager);
var textureLoader = new THREE.TextureLoader(manager);

var canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    canvas.classList.add("pong");
    document.body.appendChild(canvas);
var c = canvas.getContext("2d");
    c.fillStyle = '#2ca3ff';
    c.strokeStyle = '#2ca3ff';
    c.font="60px VT323";
//___________________________________________________ UI

function createElement(opt){
  var elHolder = null;
  var el = document.createElement(opt.type);
      el.classList.add('element-' + opt.type);

  if("inputType" in opt){
      elHolder = document.createElement("div");
      elHolder.classList.add('element-holder-input');
      el.type = opt.inputType;
      el.name = opt.classer;
      el.checked = opt.checked;
      el.id = opt.type + '-' + hashCode(opt.content);

      elHolder.appendChild(el);
      var label = document.createElement("label");
          label.innerHTML = opt.content;
          label.setAttribute('for',el.id);

    elHolder.appendChild(label);
  }else{
    if("content" in opt){
      el.innerHTML = opt.content;
    }
  }
  if("classer" in opt){
    el.classList.add(opt.classer);
  }
  
  if("cb" in opt){
    el.addEventListener(opt.cbType,function (event) {
      opt.cb(event);
    });
  }

  if(elHolder != null){
    return elHolder;
  }else{
    return el;
  }
}


var holder = createElement({
  type : 'div',
  classer : 'holder'
});

holder.classList.add('start');
var menuHolder = createElement({
  type : 'div',
  classer : 'menu-holder'
});



holder.appendChild(createElement({
  type : 'h1',
  classer : 'title',
  content: menu.title
}));


var playerForm = createElement({
  type : 'form',
  classer : 'choose-playerCount',
});

menuHolder.appendChild(playerForm);


playerForm.appendChild(createElement({
  type : 'input',
  inputType : 'radio',
  classer : 'button-player',
  content: '1 Player',
  checked : true,
  cbType : 'change',
  cb : function () {
    gameOptions.playerCount = 1;
  

    console.log(gameOptions.playerCount);
  }
}));



playerForm.appendChild(createElement({
  type : 'input',
  inputType : 'radio',
  classer : 'button-player',
  content: '2 Player',
  checked : false,
  cbType : 'change',
  cb : function () {
    gameOptions.playerCount = 2;
  

    console.log(gameOptions.playerCount);
  }
}));


menuHolder.appendChild(createElement({
  type : 'button',
  classer : 'button-mute',
  cbType : 'click',
  content: "mute",
  cb : function (event) {

    gameOptions.mute = !gameOptions.mute;

    event.target.classList.toggle("selected");

  }
}));


menuHolder.appendChild(createElement({
  type : 'button',
  classer : 'button-restart',
  cbType : 'click',
  content: "Restart",
  cb : function (event) {

    respawn();
    player.a.points = 0;
    player.b.points = 0;
    holder.classList.add('inGame');

    gameOptions.playing = true;  }
}));


var playerButton = createElement({
  type : 'button',
  classer : 'button-play',
  cbType : 'click',
  content: "Play",
  cb : function (event) {
    if(gameOptions.loaded){
      holder.classList.add('inGame');

      holder.classList.remove('start');
      holder.classList.add('playGame');

      gameOptions.playing = true;  
    }
  }
});
menuHolder.appendChild(playerButton);


var loaderBarEl = new loaderBar(playerButton); 

menuHolder.appendChild(createElement({
  type : 'button',
  classer : 'button-continue',
  cbType : 'click',
  content: "continue",
  cb : function (event) {

    holder.classList.add('inGame');
    gameOptions.playing = true;  
  }
}));



  holder.appendChild(menuHolder);
  document.body.appendChild(holder);


//___________________________________________________ Load Assets
var concrete_tex = textureLoader.load("assets/textures/concrete.jpg");
var concrete_tex_norm = textureLoader.load("assets/textures/concrete_NRM.jpg");
var concrete_tex_aoMap = textureLoader.load("assets/textures/concrete_OCC.jpg");
var concrete_tex_metalness = textureLoader.load("assets/textures/concrete_SPEC.jpg");

var rohr_albedo = textureLoader.load("assets/textures/rohr_albedo.jpg");
var rohr_metallic = textureLoader.load("assets/textures/rohr_metallic.jpg");
var rohr_roughness = textureLoader.load("assets/textures/rohr_roughness.jpg");
var rohr_normal = textureLoader.load("assets/textures/rohr_normal.jpg");

loader.load('assets/json/floor.json',function (geometry,material) {
  assets.floor.geometry= geometry;
  assets.floor.material= material;
});

loader.load('assets/json/rohr.json',function (geometry,material) {
  assets.rohr.geometry= geometry;
  assets.rohr.material= material;
});

loader.load('assets/json/screen.json',function (geometry,material) {
  assets.screen.geometry= geometry;
  assets.screen.material= material;
});

//___________________________________________________ Load Sound Assets
var bufferLoader;
window.AudioContext = window.AudioContext||window.webkitAudioContext;
var audioContext = new AudioContext();

var bufferLoader = new AudioBufferLoader( audioContext );

//load single Buffer
bufferLoader.loadBuffer('dip', "assets/sounds/blub.mp3",function(buffer) {
  assets.sounds.dip = buffer;
});

bufferLoader.loadBuffer('blub', "assets/sounds/dip3.mp3",function(buffer) {
  assets.sounds.blub = buffer;
});


bufferLoader.loadBuffer('blub', "assets/sounds/loose.mp3",function(buffer) {
  assets.sounds.loose = buffer;
});

bufferLoader.loadBuffer('juchu', "assets/sounds/juchu.mp3",function(buffer) {
  assets.sounds.juchu = buffer;
});


function createSource(buffer) {
    var source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    return {
      source: source,
    };
  
}


function playSound(buffer,loop) {
  if(!gameOptions.mute){
  var source = createSource(buffer);
  source.source.loop = loop;
  source.playing = true;
  source.source.start ? source.source.start() : source.source.noteOn(0);

  return source;
  }
}

//___________________________________________________ Init

function init(){

  console.log("init");
  //__________ scene
  scene = new THREE.Scene();
  //__________ camera
  var camera = new THREE.PerspectiveCamera( 55, canvas_width/canvas_height, 0.1, 1000 );

    camera.position.set(10,4,-3);
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
  renderer.domElement.classList.add('pongGame');
  
  document.body.appendChild( renderer.domElement );

  //__________ resize

  window.onresize = function(){
    canvas_height = window.innerHeight;
    canvas_width = window.innerWidth;
    camera.aspect = canvas_width / canvas_height;
    camera.updateProjectionMatrix();
    renderer.setSize( canvas_width, canvas_height );
  }
//_____________  Post Effects

  var renderPass = new THREE.RenderPass( scene, camera );
  var bokehPass = new THREE.BokehPass( scene, camera, {
    focus:    1.,
    aperture: 0.15,
    maxblur:  2.0,

    width: canvas_width,
    height: canvas_height
  } );

  bokehPass.renderToScreen = true;

  var composer = new THREE.EffectComposer( renderer );

  var bloomPass = new THREE.UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight), 
    1, .05, .25
    );
  
  var depthMaterial = new THREE.MeshDepthMaterial();
  depthMaterial.depthPacking = THREE.RGBADepthPacking;
  depthMaterial.blending = THREE.NoBlending;

  var pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter };
  depthRenderTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, pars );

  // Setup SSAO pass
  var ssaoPass = new THREE.ShaderPass( THREE.SSAOShader );
  ssaoPass.renderToScreen = false;
  //ssaoPass.uniforms[ "tDiffuse" ].value will be set by ShaderPass
  ssaoPass.uniforms[ "tDepth" ].value = depthRenderTarget.texture;
  ssaoPass.uniforms[ 'size' ].value.set( window.innerWidth, window.innerHeight );
  ssaoPass.uniforms[ 'cameraNear' ].value = camera.near;
  ssaoPass.uniforms[ 'cameraFar' ].value = camera.far;
  ssaoPass.uniforms[ 'onlyAO' ].value = ( postprocessing.renderMode == 1 );
  ssaoPass.uniforms[ 'aoClamp' ].value = .5;
  ssaoPass.uniforms[ 'lumInfluence' ].value = .050;

  composer.addPass( renderPass );
  composer.addPass( ssaoPass );
  composer.addPass(bloomPass);
  composer.addPass( bokehPass );

  postprocessing.composer = composer;
  postprocessing.bokeh = bokehPass;
  //initPostprocessing(camera);


  //__________ controls

  controls = new THREE.OrbitControls( camera );
  controls.target.set(0,4,-3);
  controls.damping = 0;
  controls.noKeys = true;
  
  controls.minPolarAngle = 80 * Math.PI / 180;
  controls.maxPolarAngle = 99 * Math.PI / 180;

  controls.minAzimuthAngle = 60 * Math.PI / 180; // radians
  controls.maxAzimuthAngle = 120 * Math.PI / 180; // radians
  controls.minDistance = 10;
  controls.maxDistance = 13;

  
  //__________ light

  var ambient = new THREE.AmbientLight(0x999999);
      scene.add(ambient);
var d = 100;

  var spotLight = new THREE.SpotLight(0x3aaffb);
      spotLight.position.set( 3,10,-5 );
      spotLight.intensity = .2;
      spotLight.angle = Math.PI / 3;
      spotLight.penumbra = .9;
      spotLight.castShadow = true;

      spotLight.shadow.mapSize.width = 512;
      spotLight.shadow.mapSize.height = 512;

      spotLight.shadow.camera.near = 1;
      spotLight.shadow.camera.far = 30;
      spotLight.shadow.camera.fov =camera.fov;

      spotLight.shadow.camera.left = -d;
      spotLight.shadow.camera.right = d;
      spotLight.shadow.camera.top = d;
      spotLight.shadow.camera.bottom = -d;

      scene.add(spotLight);

  var wandLight = new THREE.SpotLight(0xf9efcc);
      wandLight.position.set( -3.5, 4, 2.5 );
      wandLight.target.position.set(.5, 0, 2.5);
      wandLight.target.updateMatrixWorld();
      wandLight.intensity = .4;
      wandLight.angle = Math.PI / 4;
      wandLight.penumbra = .9;
      wandLight.castShadow = true;

      wandLight.shadow.mapSize.width = 512;
      wandLight.shadow.mapSize.height = 512;

      wandLight.shadow.camera.near = 1;
      wandLight.shadow.camera.far = 50;
      wandLight.shadow.camera.fov =camera.fov;

      
      wandLight.shadow.camera.left = -d;
      wandLight.shadow.camera.right = d;
      wandLight.shadow.camera.top = d;
      wandLight.shadow.camera.bottom = -d;

      scene.add(wandLight);

  var wandLight2 = new THREE.SpotLight(0xf9efcc);
      wandLight2.position.set( -3.5, 4, -9.25 );
      wandLight2.target.position.set(.5, 0, -9.25);
      wandLight2.target.updateMatrixWorld();
      wandLight2.intensity = .4;
      wandLight2.angle = Math.PI / 4;
      wandLight2.penumbra = .9;
      wandLight2.castShadow = true;

      wandLight2.shadow.mapSize.width = 512;
      wandLight2.shadow.mapSize.height = 512;

      wandLight2.shadow.camera.near = 1;
      wandLight2.shadow.camera.far = 50;
      wandLight2.shadow.camera.fov =camera.fov;

      wandLight2.shadow.camera.left = -d;
      wandLight2.shadow.camera.right = d;
      wandLight2.shadow.camera.top = d;
      wandLight2.shadow.camera.bottom = -d;

      scene.add(wandLight2);


      // var shadowHelper = new THREE.CameraHelper( frontLight.shadow.camera );
      // scene.add(shadowHelper);


  //__________ Floor

  wrapTexture(concrete_tex,8);
  wrapTexture(concrete_tex_norm,8);
  wrapTexture(concrete_tex_metalness,8);
  wrapTexture(concrete_tex_aoMap,8);

  var box;
  function createFloor(geometry,material) {

    material[0] = new THREE.MeshStandardMaterial({
      color : 0xaaaaaa,
      map : concrete_tex,
      roughness : .7,
      metalness : 0.2,
      aoMapIntensity : 2,
      bumpScale : .05,
      shading : THREE.FlatShading,
      aoMap : concrete_tex_aoMap,
      metalnessMap : concrete_tex_metalness,
      bumpMap : concrete_tex_norm
    });
    floor = new THREE.Mesh(geometry,new THREE.MeshFaceMaterial(material));
    floor.receiveShadow = true;
    floor.castShadow = true;

    scene.add(floor);

  };

  //__________ Rohr

  wrapTexture(rohr_albedo,10);
  wrapTexture(rohr_metallic,10);
  wrapTexture(rohr_roughness,10);
  wrapTexture(rohr_normal,40);

  function createRohr(geometry,material) {

    material.forEach(function (m,index) {
      console.log(m.name,index);
    })

    material[0] = new THREE.MeshStandardMaterial({
      color : 0xcccccc,
      map : rohr_albedo,
      bumpScale : .1,
      roughness : .8,
      metalness : .7,
      metalnessMap : rohr_metallic,
      roughnessMap : rohr_roughness,
      bumpMap : rohr_normal
    });

    
    material[1] = new THREE.MeshStandardMaterial({
      color : 0xffffff,
      emissive : 0x666666
    });
    material[2] = new THREE.MeshStandardMaterial({
      color : 0x333333
    });
    

    var rohr = new THREE.Mesh(geometry,new THREE.MeshFaceMaterial(material))
    rohr.castShadow = true;
    scene.add(rohr);
  };


  //__________ Screen
 
  texture = new THREE.Texture(canvas);

    function createScreen(geometry,material) {
      var screen = new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({
        map : texture,
        transparent : true,
        alphaTest: 0.005,
        side : THREE.DoubleSide
      }));
      var uniforms = { texture:  { value: texture } };
      var vertexShader = document.getElementById( 'vertexShaderDepth' ).textContent;
      var fragmentShader = document.getElementById( 'fragmentShaderDepth' ).textContent;
      screen.customDepthMaterial = new THREE.ShaderMaterial( {
          uniforms: uniforms,
          vertexShader: vertexShader,
          fragmentShader: fragmentShader,
          side: THREE.DoubleSide
      });
      screen.castShadow = true;
      scene.add(screen);

    }

  createFloor(assets.floor.geometry,assets.floor.material);
  createRohr(assets.rohr.geometry,assets.rohr.material);
  createScreen(assets.screen.geometry,assets.screen.material);


  render(time);
}//init();


//___________________________________________________ Post Effects
function Explosion(pos,dir) {
  this.count = 50;
  this.isActive = true;
  
  this.createPoints = function (argument) {
    var points = [];
    for(var i=0;i<this.count;i++){
      points.push({
        pos : {
          x : pos.x,
          y : pos.y
        },
        vel : {
          x : -1.5 + Math.random() * 3 ,
          y : dir + Math.random() * 3
        },
        lifetime : 0,
        maxLifetime : 20 + Math.random() * 50
      });
    }

    return points;
  }
  
  var base = this.createPoints();

  this.update = function (context) {
    var lifeSpan = 0;
    c.fillStyle = "#ff9800";
    base.forEach(function (p,index) {

      p.pos.x += p.vel.x;
      p.pos.y += p.vel.y;
      
      if(p.lifetime < p.maxLifetime){
        context.fillRect(p.pos.x,p.pos.y,2,2);
        p.lifetime++;
      }else{
        lifeSpan++;
      }
    });
    c.fillStyle = '#2ca3ff';
    if(lifeSpan == this.count){
      this.isActive = false;
    }
  }
}

function Bounce(pos,dir) {
  this.count = 5;
  this.isActive = true;
  
  this.createRadius = function (argument) {
    var points = [];
    for(var i=0;i<this.count;i++){
      points.push({
        pos : {
          x : pos.x,
          y : pos.y
        },
        rad : 1 ,
        radVel : Math.random() * 50,
        lifetime : 0,
        maxLifetime : 20 + Math.random() * 10
      });
    }

    return points;
  }
  
  var base = this.createRadius();

  this.update = function (context) {
    var lifeSpan = 0;
    //c.fillStyle = "#ff9800";
    //c.strokeStyle = "#ff9800";
    c.setLineDash([0,0]);

    var rad = {}
    if(dir > 0){
      rad.start = 320;
      rad.end = 40;
    }else{
      rad.start = 130;
      rad.end = 230;
    }
    base.forEach(function (p,index) {

      p.rad += p.radVel * .01;
      p.pos.x += dir * .25;



      if(p.lifetime < p.maxLifetime){

        context.beginPath();
        context.arc(p.pos.x, p.pos.y, p.rad, 0,  Math.PI * 2, false);
        context.lineWidth = 1;
        
        context.stroke();

        p.lifetime++;
      }else{
        lifeSpan++;
      }
    });
    c.strokeStyle = '#2ca3ff';
    c.setLineDash([15, 15]);
    if(lifeSpan == this.count){
      this.isActive = false;
    }
  }
}


  c.update = function (t) {
    this.clearRect(0,0,1024,1024);


    //update Points    
    c.fillText( player.a.points,screenSize.x / 4 ,50);
    c.fillText( player.b.points,screenSize.x / 4 * 3 ,50);

    //draw center line
      c.setLineDash([15, 15]);
      c.beginPath();
      c.lineWidth = 2;
      c.moveTo(screenSize.x / 2,0);
      c.lineTo(screenSize.x / 2, screenSize.y );
      c.stroke();

    if(gameOptions.playing){

      if(gameOptions.playerCount == 1){
        //"KI" control
        if(player.a.pos.y < ball.pos.y){
          player.a.pos.y += 4 - Math.random()* 3;
          player.a.vel.y += .75;
        }else{
          player.a.pos.y -= 4 - Math.random()* 3;
          player.a.vel.y -= .75;
        }
      }

      //update player positions
      player.a.pos.y += player.a.vel.y;
      player.b.pos.y += player.b.vel.y;

      player.a.pos.x += player.a.vel.x;
      player.b.pos.x += player.b.vel.x;


      //update player
      ball.pos.x += ball.vel.x * ball.speed.x * ball.dir.x ;
      ball.pos.y += ball.vel.y * ball.speed.y * ball.dir.y ;


    }

    //check player bounds

    player.a.pos.x = player.a.pos.x <=  0  ? 0 : player.a.pos.x ;
    player.a.pos.x = (player.a.pos.x ) >= screenSize.x / 2 ?   screenSize.x / 2 : player.a.pos.x;


    player.b.pos.x = player.b.pos.x <=  ((screenSize.x / 2) + player.b.size.x)  ?  (screenSize.x / 2 + player.b.size.x) : player.b.pos.x ;
    player.b.pos.x = (player.b.pos.x ) >= screenSize.x - player.b.size.x ?   screenSize.x- player.b.size.x : player.b.pos.x;


    player.a.pos.y = (player.a.pos.y ) <= player.a.height / 2 ? (player.a.height / 2) : player.a.pos.y;
    player.a.pos.y = (player.a.pos.y ) >= screenSize.y - player.a.height / 2 ? (screenSize.y - player.a.height / 2) : player.a.pos.y;
    player.b.pos.y = (player.b.pos.y ) <= player.b.height / 2 ? (player.b.height / 2) : player.b.pos.y;
    player.b.pos.y = (player.b.pos.y ) >= screenSize.y - player.b.height / 2 ? (screenSize.y - player.b.height / 2) : player.b.pos.y;


    player.a.bounce.x = Math.sin(0.05 * t) * player.a.bounce.multiplier;
    player.b.bounce.x = Math.sin(0.05 * t) * player.b.bounce.multiplier;

    //draw player A
    c.setLineDash([]);
    c.lineWidth = 5;
    c.beginPath();
    c.moveTo(player.a.pos.x,player.a.pos.y - player.a.height / 2);
    c.bezierCurveTo(player.a.pos.x + player.a.bounce.x,player.a.pos.y - player.a.height / 4,player.a.pos.x + player.a.bounce.x,player.a.pos.y + player.a.height / 4,player.a.pos.x,player.a.pos.y + player.a.height / 2);
    c.stroke();

    //draw player B
    c.setLineDash([]);
    c.lineWidth = 5;
    c.beginPath();
    c.moveTo(player.b.pos.x,player.b.pos.y - player.b.height / 2);
    c.bezierCurveTo(player.b.pos.x + player.b.bounce.x,player.b.pos.y - player.b.height / 4,player.b.pos.x + player.b.bounce.x,player.b.pos.y + player.b.height / 4,player.b.pos.x,player.b.pos.y + player.b.height / 2);
    c.stroke();


    //check ball bounce Right
    //vertical check
    if( isInRange(ball.pos.y , (player.b.pos.y - (player.b.size.y / 2)), (player.b.pos.y + (player.b.size.y / 2)) )){
      if(isInRange(ball.pos.x + ball.size.x/2,player.b.pos.x,player.b.pos.x + player.b.size.x ) ){
            playSound(assets.sounds.blub,false);
            
            player.b.bounce.multiplier = 5;

            ball.dir.x *= -1;
            //ball.vel.y -= (player.b.vel.y * .075);
            bounces.push(new Bounce({
                x : ball.pos.x,
                y : ball.pos.y
            }, -1 ));
      

        }
      
    }


    //check ball bounce Left
    if( isInRange(ball.pos.y , (player.a.pos.y - (player.a.size.y / 2)), (player.a.pos.y + (player.a.size.y / 2)) )){
      if(isInRange(ball.pos.x - ball.size.x/2 , player.a.pos.x , player.a.pos.x + player.a.size.x) ){
     
          playSound(assets.sounds.blub,false);

          player.a.bounce.multiplier = 5;
          ball.dir.x *= -1;
          ball.vel.y -= (player.a.vel.y * .075);
          bounces.push(new Bounce({
              x : ball.pos.x,
              y : ball.pos.y
          }, 1 ));
      }
    } 

    if(ball.pos.x < (ball.size.x / 2) || ball.pos.x > (screenSize.x - ball.size.x / 2) ){
      respawn();
    }
    
    //check ball bounds Y
    if(ball.pos.y >= screenSize.y || ball.pos.y <= 0){
      ball.dir.y *= -1;
      var side = null;
      if(ball.pos.y > screenSize.y / 2){
        side = -1;
      }else{
        side = 1;
      }

      playSound(assets.sounds.dip,false);
      explosions.push(new Explosion({
          x : ball.pos.x,
          y : ball.pos.y
      }, side ));
    }


    //draw ball
    c.fillRect(ball.pos.x-ball.size.x/2,ball.pos.y-ball.size.y/2,10,10);

    explosions.forEach(function (exp,index) {
      if(exp.isActive){
        exp.update(c);
      }else{
        explosions.splice(index, 1);
      }
    });

    bounces.forEach(function (b,index) {
      if(b.isActive){
        b.update(c);
      }else{
        bounces.splice(index, 1);
      }
    });
  }




function respawn(){
  
  if(ball.dir.x > 0){
    player.a.points += 1;
    if(gameOptions.playerCount == 2){
      playSound(assets.sounds.juchu,false);
    }else{
      playSound(assets.sounds.loose,false);
    }
  }
  if(ball.dir.x < 0){
    player.b.points += 1;
    if(gameOptions.playerCount == 2){
      playSound(assets.sounds.juchu,false);
      
    }else{
      playSound(assets.sounds.loose,false);
    }
  }

  ball.pos.x = screenSize.x / 2;
  ball.pos.y = screenSize.y / 2 + Math.random() * screenSize.y / 4;

  
  ball.vel.y = Math.random() * .5;

  if(player.a.points >= 10 || player.b.points >= 10){
    gameOptions.playing = true;
  }
}





function handlePlayer() {
  //Player 1

  if(keyCode.player1.left){
    player.b.vel.x -= .25;
  }
  if(keyCode.player1.right){
    player.b.vel.x += .25;
  }
  
  if(keyCode.player1.up){
    player.b.vel.y -= 1;
  }
  if(keyCode.player1.down){
    player.b.vel.y += 1;
  }


  if(keyCode.player2.left){
    player.a.vel.x -= .25;
  }
  if(keyCode.player2.right){
    player.a.vel.x += .25;
  }
  
  if(keyCode.player2.up){
    player.a.vel.y -= 1;
  }
  if(keyCode.player2.down){
    player.a.vel.y += 1;
  }
}


function handleKeyMap(){

  keyCode.player1.left = keyMap[37];
  keyCode.player1.right = keyMap[39];
  keyCode.player1.up = keyMap[38];
  keyCode.player1.down = keyMap[40];

  keyCode.player2.left = keyMap[65];
  keyCode.player2.right = keyMap[68];
  keyCode.player2.up = keyMap[87];
  keyCode.player2.down = keyMap[83];

  if(keyMap[32] || keyMap[27]){

    if( gameOptions.playing){
      gameOptions.playing = !gameOptions.playing;

      holder.classList.toggle("inGame");
    }
  }


}



window.addEventListener('keydown',function(event) {
  keyMap[event.keyCode] = true;
  
});

window.addEventListener('keyup',function(event) {
 keyMap[event.keyCode] = false;
});




//__________ render
var render = function (time) { 
  requestAnimationFrame( render );
  animation(time);

  controls.update();
  handleKeyMap();
  handlePlayer();
  
  postprocessing.composer.render( 0.1 );
};


//__________ animation

function animation(time){
  texture.needsUpdate = true;


  player.a.bounce.multiplier *= .99;
  player.b.bounce.multiplier *= .99;

  player.a.vel.x *= .9;
  player.b.vel.x *= .9;
  player.a.vel.y *= .9;
  player.b.vel.y *= .9;
  
  c.update(time);
  
};




//}()); //__eof

