function VRPointer(opt){
  this.midPoint = new THREE.Vector2(0,0);
  this.raycaster = new THREE.Raycaster();
  this.camera = opt.camera;
  this.scene = opt.scene;
  this.distanceFromCamera = opt.distanceFromCamera ? opt.distanceFromCamera : 50;
  this.color = opt.color ? opt.color : '#ffffff';
  this.opacity = opt.opacity ? opt.opacity : 0.75;
  this.size = opt.size ? opt.size : 1;
  this.duration = opt.duration ? opt.duration : 100;
  this.intersects = [];
  this.activeElements = opt.activeElements ? opt.activeElements : [];
  this.time = 0;

  this.strokeWidth = opt.strokeWidth ?  (opt.strokeWidth) : 2;

  var size = 256;
  var rangeSize = size - ((this.strokeWidth*10));
  var rangePos = size - (this.strokeWidth*10 / 2);
  var sizeHalf = size / 2;

  var canvas = document.createElement('canvas');  
      canvas.width = size;
      canvas.height = size;
      canvas.style.position = 'absolute';
      canvas.style.display = 'none';
      document.body.appendChild(canvas);
  this.map = new THREE.Texture(canvas);
  this.map.needsUpdate = true;

  var c = canvas.getContext('2d');
  var pointer = new THREE.Mesh(new THREE.PlaneBufferGeometry(this.size,this.size,2,2),new THREE.MeshBasicMaterial({
    transparent:true,
    map : this.map,
    depthWrite : false,
    depthTest : false
  }));
  //___________ pointer
  pointer.name = 'referencePoint';
  pointer.lookAt(this.camera);
  pointer.position.z = - this.distanceFromCamera;
  this.camera.add(pointer);

  this.draw = function(time,duration){

    var radius = sizeHalf - (((this.strokeWidth* 10) / 2));
        c.clearRect(0,0,size,size);
        c.save();
        c.globalAlpha = 1;
        // Create a circle
        c.beginPath();
        c.arc(sizeHalf, sizeHalf, radius, 0, 2 * Math.PI, false);
        
        c.lineWidth = this.strokeWidth * 10;
        c.strokeStyle = this.color;
        c.stroke();
        // Clip to the current path
        c.clip();
        c.fillStyle = this.color;
        c.globalAlpha = this.opacity;

        c.fillRect((this.strokeWidth * 10 / 2),rangePos - Math.floor(time * rangeSize / duration),rangeSize,Math.floor(time * rangeSize / duration));
         // Undo the clipping
        c.restore();

        this.map.needsUpdate = true;
  }

  //draw the circle once
  this.draw(c);
  

  for(var i=0;i<this.activeElements.length;i++){
    this.activeElements[i].time = 0;
    this.activeElements[i].duration = this.activeElements[i].duration ? this.activeElements[i].duration : this.duration;
    this.activeElements[i].hoverElements = null;
  }


  this.checkCollision = function(o) {
      // update the picking ray with the camera and mouse position  
      this.raycaster.setFromCamera( this.midPoint , this.camera ); 
      this.intersects = [];
      // calculate objects intersecting the picking ray
      this.intersects = this.raycaster.intersectObjects( o.elements );
      var point;
      if ( this.intersects.length > 0 ) {
        for(var i=0;i<this.intersects.length;i++){
          point = this.intersects[i].point;
          if (typeof o.hover === "function") { 
            o.hover({
              element : this.intersects[i].object,
              point : point,
              distance : this.intersects[i].distance
            });
          }
        
          if(o.time === o.duration){
            if (typeof o.click === "function") { 
              o.click({
                element : this.intersects[i].object,
                point : point,
                distance : this.intersects[i].distance
              });
            }
          }
          o.time++;
          this.draw(o.time,o.duration);
        }
        o.hoverElements = this.intersects;
      }else{
        o.time = 0;
        if(o.hoverElements !== null){
          this.draw(o.time);

          if (typeof o.out === "function") { 
            o.hoverElements.forEach(function(el) {
              o.out({
                element : el.object,
                point : el.point,
                distance : el.distance
              });
            });
          }
          o.hoverElements = null;
        }
      }
    }

  this.update = function () {
    for(var i=0;i<this.activeElements.length;i++){
      this.checkCollision(this.activeElements[i]);
    }
  }
}

/*
	Basic Setup
*/
//(function(){

//__________ Variables
var canvas_height, canvas_width;
var renderer;
var floor;
var scene, controls, camera , effect,ambient, spotLight;
var loadingIcon = document.getElementById('loadingStatus');
var vr_pointer;
var time = 0;
var assets = {
  geometry : {},
  textures : {},
  slides : {}
};

var screenObjects = [];
var naviObjects = [];

var colorPalette = {
  piup : new THREE.Color(0x413E4A),
  blue : new THREE.Color(0x586E7C),
  gray : new THREE.Color(0xD3D1D0),
  brown : new THREE.Color(0x8D7966),
  cooler : new THREE.Color(0xA8A39D),
  trajan : new THREE.Color(0xD8C8B8),
}


var base_url = 'assets/json/';
var models = {
  eye : 'eye',
  leinwand : 'leinwand',
  right : 'slide_right',
  left : 'slide_left'

}

//__________ Setup Slides with individual Parameters

var slides = []
var placeHolder = '';
for(var i=0;i<40;i++){
  placeHolder = i<10 ? '0' : '';
  slides.push({
    name : 'slide-' + placeHolder + i,
    bgColor : getRandomStyleColor(colorPalette)
  });
}


//____________________________ Helper Functions
function pickRandomProperty(key,obj) {
    var result;
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1/++count)
           result = obj[prop];
    return result;
}


function getRandomStyleColor(colorPalette){

  var max = Object.keys(colorPalette).length - 1;
  var rand = Math.random() * max;
  return pickRandomProperty(rand,colorPalette);
}

function randNum(e,a,n){
  var t = Math.floor(Math.random()*a)+e;
  return(n||"undefined"==typeof n)&&(t*=1==Math.floor(2*Math.random())?1:-1),t;
}
//____________________________ Loading 
var manager = new THREE.LoadingManager();
var loader = new THREE.JSONLoader(manager);
var tLoader = new THREE.TextureLoader(manager);


manager.onProgress = function ( item, loaded, total ) {
  var status = loaded * 100 / total;

  loadingIcon.style.width = (status) + '%' ;
};
manager.onLoad = function(){
  init();
  document.body.classList.add('ready');
  render(time);
}

//__________ Create VR Buttons


var controls = {
  type : 'orbit',
  orbit :null,
  vr : null,
  effect : null,
  enableButton : createVREnabler(),
  disableButton : createVRDisabler(),
}

//__________ Create VR Buttons

function createVREnabler () {
  var enable_vr_button = document.createElement('button');
      enable_vr_button.className  = 'switch_to_vr';
      enable_vr_button.addEventListener('click',enableVR);
      enable_vr_button.innerHTML = 'Enable VR';
      document.body.appendChild(enable_vr_button);

      return enable_vr_button;
}

function createVRDisabler () {
  var disable_vr_button = document.createElement('button');
      disable_vr_button.className = 'switch_to_orbit hide';
      disable_vr_button.addEventListener('click',disableVR);
      disable_vr_button.innerHTML = 'Disable VR';
      document.body.appendChild(disable_vr_button);

      return disable_vr_button;
}

//__________ Make Window Fullscreen
function enableFullScreenMode(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

//__________ Disable Window Fullscreen
function disableFullScreenMode() {
  if(document.exitFullscreen) {
    document.exitFullscreen();
  } else if(document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if(document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}


//__________ Enable VR and establish VR Pointer

function enableVR() {
  console.log('vr enabled');

  controls.orbit.enabled = false;
  
  controls.vr.connect();
  controls.type ='vr';
  
  controls.enableButton.classList.add('hide');
  controls.disableButton.classList.remove('hide');

  Adjust.VRPointer({
    //not optional
    camera : camera,
    scene : scene,

    //optional
    strokeWidth : 4,                  
    midPoint : new THREE.Vector2(0,0),
    distanceFromCamera : 55,          
    color : '#ffffff',                
    opacity : 0.8,                   
    size : 2,                         
    duration : 100,                   

    // active element options
    activeElements : [{                 
      elements : naviObjects,
      hover : function (o){  
        over(o.element);
      },
      out : function(o){     
        out(o.element)
      },
      click : function (o){  
        activeState(o.element);          
      }
    }]
  });

  enableFullScreenMode(document.documentElement);
}

function disableVR() {
  console.log('vr disabled');
  
  controls.orbit.enabled = true;
  controls.vr.disconnect();
  controls.type ='orbit';

  controls.enableButton.classList.remove('hide');
  controls.disableButton.classList.add('hide');
  
  renderer.setSize( canvas_width, canvas_height );
  //remove VRPointer from document
  Adjust.removeVRPointer();
  //Note: No argument is needed to disable fullscreen
  disableFullScreenMode();
}

//________________________________________________ Loading Items

function loadTexture(id,name,url){
  tLoader.load(url,function(t){
      assets.slides[name] = t;
      assets.slides[name]._id = id;
  });
}


function loadModel(name,url){
  loader.load(url,function(geometry){
      assets.geometry[name] = geometry;
  });
}


function loadItems() {
  for(var t = 0;t< slides.length;t++){
    loadTexture(t, slides[t].name , 'dist/textures/slides/' + slides[t].name + '.jpg' );
  }

  tLoader.load('dist/textures/arrow.png', function(arrow) {
    assets.textures.arrow = arrow;
  });

  tLoader.load('dist/textures/eye.png', function(eye) {
    assets.textures.eye = eye;
  });

  for(model in models){
    loadModel(model,base_url + models[model] + '.json');
  }

  return assets;
}

//________________________________________________ Init after loading assets


function init(){
  
  canvas_height = window.innerHeight;
  canvas_width = window.innerWidth;
  //__________ scene
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2( colorPalette.piup ,.01);

  //__________ Background on Dom
  var real_bg_color = new THREE.Color( colorPalette.piup );
  document.body.style.background = '#' + real_bg_color.getHexString();

  //__________ camera
  camera = new THREE.PerspectiveCamera( 85, canvas_width/canvas_height, 0.001, 500 );
  camera.position.set(0,18,0);
  scene.add(camera);
  
  //__________ renderer
  renderer = new THREE.WebGLRenderer({
      alpha : true,
      transparent : true,
      antialias: true
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize( canvas_width, canvas_height );
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor( colorPalette.piup , 1 );
  renderer.domElement.classList.add('render-element');
  document.body.appendChild( renderer.domElement );

  //__________ Init Adjust for events

  Adjust.init({
    camera : camera,
    scene : scene,
    renderer : renderer
  });

  //__________ Ambient

  ambient = new THREE.AmbientLight(0x666666);
  scene.add(ambient);
  //__________ SpotLight

  spotLight = new THREE.SpotLight( 0xffffff );
  spotLight.position.set( -50, 250, 100 );

  spotLight.castShadow = true;
  spotLight.power = Math.PI * 1.2;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;

  spotLight.shadow.camera.near = 2;
  spotLight.shadow.camera.far = 50;
  spotLight.shadow.camera.fov = 55;

  spotLight.shadow.camera.left   = 50;
  spotLight.shadow.camera.right  = 50;
  spotLight.shadow.camera.top    = 50;
  spotLight.shadow.camera.bottom = 50;

  scene.add( spotLight );


  //____ Orbit Controls

  controls.orbit = new THREE.OrbitControls( camera );
  controls.orbit.damping = 0.2;
  controls.orbit.target = new THREE.Vector3(0,camera.position.y,-0.1);

  controls.orbit.minDistance = 0;
  controls.orbit.maxDistance = .1;

  //____ VR Controls
  controls.vr = new THREE.DeviceOrientationControls(camera);

  //____ Split Screen
  effect = new THREE.StereoEffect(renderer);
  effect.focalLength = 55;
  effect.eyeSeparation = 2;
  effect.setSize(canvas_width, canvas_height);

  //____ Floor
  floor = new THREE.Mesh(new THREE.PlaneGeometry(500,500,64,64),new THREE.MeshPhongMaterial({
    color : colorPalette.piup,
    shading : THREE.FlatShading,
    shininess : 1
  }));

  for(var i=0;i< floor.geometry.vertices.length;i++){
    floor.geometry.vertices[i].z += Math.random() * 2;
  }

  floor.geometry.needsUpdate = true;
  floor.rotation.x = -90 * Math.PI / 180;
  floor.position.y = -2;
  floor.receiveShadow = true;
  floor.castShadow = true;

  scene.add(floor);

  //__________ Screen
  assets.screen = leinwand(assets);

  //__________ Eyes
  assets.eye = eye(assets);

  window.onresize = function(){
    canvas_height = window.innerHeight;
    canvas_width = window.innerWidth;
    camera.aspect = canvas_width / canvas_height;
    camera.updateProjectionMatrix();

    renderer.setSize( canvas_width, canvas_height );
    effect.setSize(canvas_width, canvas_height);

    Adjust.resize();
  }  

}//end of init;


//________________________________________________ Screen for Slideshow
function leinwand(assets){
 
  var leinwand = new THREE.Mesh(assets.geometry.leinwand,new THREE.MeshPhongMaterial({
    color :0xffffff,
    side : THREE.DoubleSide,
    map : assets.slides['slide-00']//set first slide
  }));
  leinwand.castShadow = true;
  scene.add(leinwand);


  var right = new THREE.Mesh(assets.geometry.right,new THREE.MeshLambertMaterial({
    color :0xffffff,
    transparent: true,
    opacity : 0,
    map : assets.textures.arrow
  }));

  right.name = 'right';
  naviObjects.push(right);
  scene.add(right);



  var left = new THREE.Mesh(assets.geometry.left,new THREE.MeshLambertMaterial({
    color :0xffffff,
    transparent: true,
    opacity : 0,
    map : assets.textures.arrow
  }));

  left.name = 'left';
  naviObjects.push(left);
  scene.add(left);


  //Add Right and Left as controls for slideshow
  Adjust.addActiveObject(right,over,out,activeState,false);
  Adjust.addActiveObject(left,over,out,activeState,false);

  return leinwand;
}

//________________________________________________ Slideshow logic

function setSlide(id,texture) {
  assets.screen.material.map = texture;
  assets.screen.material.needsUpdate = true;
  assets.screen.material.map._id = id;
}


function changeBGColor(toColor){
  var rColor = renderer.getClearColor();

  var colorStart = { 
    r: rColor.r, 
    g: rColor.g,
    b: rColor.b 
  };

  var colorEnd = { 
    r: toColor.r, 
    g: toColor.g,
    b: toColor.b 
  };
    new TWEEN.Tween(colorStart)
      .to(colorEnd, 1000)
      .onUpdate(function() {
        var color = new THREE.Color(this.r,this.g,this.b);
           
            renderer.setClearColor(color);
            floor.material.color = color;
            scene.fog.color = color;
            document.body.style.background = '#' +color.getHexString();

      }).start();
}

//____________________________ Slideshow logic

function changeSlide(direction){
  var currentSlideID = assets.screen.material.map._id;

  switch(direction){
    case 'left':
      currentSlideID--;
      currentSlideID = (currentSlideID == -1) ? (slides.length-1) : currentSlideID;
    break;
    case 'right':
      currentSlideID++;
      currentSlideID = (currentSlideID == (slides.length)) ? 0 : currentSlideID;
    break;
  }

  var __id_string = 'slide-';
  if(currentSlideID<10){
    __id_string += '0'+currentSlideID;
  }else{
    __id_string += currentSlideID;
  }

  changeBGColor(slides[currentSlideID].bgColor);
  setSlide(currentSlideID,assets.slides[__id_string]);
}

//________________________________________________ Actions on Mouseover mouseout click

function over (el){
  if(el.material.opacity < 1){
    el.material.opacity += .05;
  }
}
//Mouseout Function
function out (el){
  el.material.opacity = 0;
}
//Mousedown Function
function activeState (el){
  changeSlide(el.name);
}

//__________ Actions Keydown

function handleKeys(e) {
  var evt = e ? e:event;
  var direction = null;
  
  switch(evt.keyCode){
    //right arrow
    case 39:
      direction = 'right';
    break;
    //left arrow
    case 37:
      direction = 'left';
    break;
    //A 
    case 65:
      direction = 'left';
    break;
    case 68:
      direction = 'right';
    break;

  }

  if(direction !== null){
    changeSlide(direction);
  }
}

function handleClick(e){
  var evt = e ? e:event;
  if(Adjust.vr){
    if(Adjust.activeElements[0].hoverElements !== null){
      var direction = Adjust.activeElements[0].hoverElements[0].object.name;
      changeSlide(direction);
    }
  }
}


window.addEventListener("keydown", handleKeys);
window.addEventListener("mousedown", handleClick);

//________________________________________________ Eye Setup

function eye(assets){
  //holder for eye instances
  var instanceEye = [];
  var eyeMaterial = new THREE.MeshPhongMaterial({
    skinning : true,
    bumpMap : assets.textures.eye,
    bumpScale : .1,
    map : assets.textures.eye,
    transparent:true,
    side : THREE.DoubleSide,
    shininess: 1,
    alphaTest : .2
  });

  var eye = new THREE.SkinnedMesh( assets.geometry.eye , eyeMaterial );
      eye.name = 'eye';

  for(var i=0;i<60;i++){
    var scaleFac = randNum(.5,3,false);
    var rotEye = randNum(.1,.9,false);
    
    instanceEye[i] = eye.clone();
    instanceEye[i].position.x = randNum(10,160,true);
    instanceEye[i].position.y = randNum(30,50,false);
    instanceEye[i].position.z = -55 + randNum(0,160,true);
    
    instanceEye[i].scale.set(scaleFac,scaleFac,scaleFac);
    instanceEye[i].updateMatrix();
    instanceEye[i].matrixAutoUpdate = false;

    instanceEye[i].update= function() {
      if(Adjust.vr){
        eyefollowPosition(this,camera.children[0]);
      }
      else{
        eyefollowPosition(this,camera);
      }
    }
    scene.add(instanceEye[i]);
  }

  return instanceEye;
}


//________________________________________________ Eye Setup on Frame

function eyefollowPosition(element,target){
  var vector = {};

  if('matrixWorld' in target){
    vector = target.position.clone();
    vector.z += target.position.z;
    vector.y += 18;
    vector.setFromMatrixPosition( target.matrixWorld );
    vector.x -= element.position.x;
    vector.y -= element.position.y;
    vector.z -= element.position.z;


    element.skeleton.bones[0].lookAt(vector);
    element.skeleton.bones[1].lookAt(vector);
    element.skeleton.bones[2].lookAt(vector);
    

  }else{
    vector = target.clone();
  }
}



//__________ render
var render = function (time) { 
  requestAnimationFrame( render );
  TWEEN.update(time);
  Adjust.update();
  animation();
  
};


//__________ load everything

loadItems();
//__________ animation

function animation(time){
  
  if(controls.type != 'vr'){
    controls.orbit.update();
    renderer.render(scene, camera);
  }else{
    controls.vr.update();
    effect.render(scene, camera);    
  }

  //update each eye
  for(var e=0;e<assets.eye.length;e++){
    assets.eye[e].update();
  }
};


//}()); //__eof

