var urls = {
  gras : 'assets/json/gras.json',
  hearts : 'assets/json/heart.json',
  flower : 'assets/json/flower.json',
  flowerTexture : 'assets/textures/flower.png'
}

/*
  Helper Functions
*/

function calculatePointInCircle(r) {
      x = Math.random() * 2 * r - r;
      zlim = Math.sqrt(r * r - x * x);
      z = Math.random() * 2 * zlim - zlim;
    return [x,z];
}

function randNum(min, max, bool) {
  var num = Math.random() * max + min; // this will get a number between 1 and 99;
  if (bool || typeof bool == "undefined") {
    num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
  }
  return num;
}


function evaluateInput(input){
    if(input != ""){
      return true;
    }
    else{
      document.body.classList.add('error');
    }
  }

  function encoder(name){
    return encodeURIComponent(name);
  }


function getSpacePosFromMouse(x,y){
  var vector = new THREE.Vector3();

    vector.set(
      ( x/ window.innerWidth ) * 2 - 1,
      - ( y / window.innerHeight ) * 2 + 1,
      0.5);
    vector.unproject( camera );

    var dir = vector.sub( camera.position ).normalize();
    var distance = - camera.position.z / dir.z;
    var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );

    return pos;
}


var urlParam = (function getQueryString() {
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  } 
    return query_string;
}());


/*
  Change flower color
*/

function colorUpdate(jscolor) {
    
    if(typeof flower != 'undefined'){
      flowerColor = jscolor;
      flower.material.materials[1].color = new THREE.Color('#' + flowerColor);
    }
}

/*************************************************
  
*/



/*
	Basic Setup
*/
//(function(){
var flowerColor,floweranimation;
var hearts;
var clock = new THREE.Clock();
var time = 0;

var duration = 3;
var keyframes = 3;
var interpolation = duration / keyframes;
var tween;
var origin = {
  x : 0,
  y : 0,
  z : 0
}

//__________ Variables

var main_color = 0xffffff;
var canvas_height = window.innerHeight;
var canvas_width = window.innerWidth;
var flower;
var card = document.getElementById('greeting_send');
var colorChanger = document.getElementById('colorRange');


//_________________________ Send Card

var name_from = document.getElementById('name_from');
var name_to = document.getElementById('name_to');
var send = document.getElementById('send');

// Receive Message
var toName = document.getElementById('toName');
var fromName = document.getElementById('fromName');


/*
    Loader
*/

var textureLoader = new THREE.TextureLoader();
var loader = new THREE.JSONLoader();

/*
    Scene
*/
var scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xF9DFED,10,90);





//_________________________ CHANGE UI BASED ON RECEIVE OR SEND
/*
  Set Body Class based
  on view
*/
if ('fromName' in urlParam && 'toName' in urlParam && 'flowerColor' in urlParam){

  document.body.className += 'receive';
  toName.innerHTML = urlParam.toName;
  fromName.innerHTML = urlParam.fromName;
  flowerColor = urlParam.flowerColor;

  var long_url = window.location.href;
      long_url = long_url.split('?');
  var title = document.getElementsByTagName('title');

  title[0].innerHTML = 'A flower for '+ urlParam.fromName +' from ' + urlParam.toName; 
  send_own_message.setAttribute('href',long_url[0]);
}
else{



  document.body.className += 'send';
  flowerColor = 'ffffff';
}




colorChanger.addEventListener('change',function(){
  colorUpdate(this.jscolor);
})




//__________ camera
var camera = new THREE.PerspectiveCamera( 55, canvas_width/canvas_height, 0.1, 1000 );

  camera.position.set(25,12,14);
	scene.add(camera);
//__________ renderer

var renderer = new THREE.WebGLRenderer({ 
    alpha: true,
    antialias:true ,
    transparent: true
}); /// { alpha: true }
    renderer.setSize( canvas_width, canvas_height );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    //renderer.setClearColor(main_color,1);

    document.body.appendChild( renderer.domElement );

//__________ resize

window.onresize = function(){
  canvas_height = window.innerHeight;
  canvas_width = window.innerWidth;
  camera.aspect = canvas_width / canvas_height;
  camera.updateProjectionMatrix();
  renderer.setSize( canvas_width, canvas_height );
}

//__________ controls

  controls = new THREE.OrbitControls( camera );
  controls.damping = 0.2;
  controls.target = new THREE.Vector3(0,12.5,0);
  controls.maxPolarAngle = Math.PI/2;
  controls.minPolarAngle = 50 * Math.PI/180;
  controls.minDistance = 15;
  controls.maxDistance = 30;


//__________ light

var ambient = new THREE.AmbientLight(0x666666,1);
   scene.add(ambient);

var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set( 0, 500, 500 );
    spotLight.intensity = 1;
    spotLight.castShadow = true;
    spotLight.shadowCameraNear = 10;
    spotLight.shadowCameraFar = 1500;

    spotLight.shadowBias = 0.0001;
    spotLight.shadowDarkness = .8;

    spotLight.shadowMapWidth = 1024;
    spotLight.shadowMapHeight = 1024;
    scene.add(spotLight);

//__________ cubes


textureLoader.load(urls.flowerTexture,function(texture){
  //Flower

  function applyTexture(material,morph){

    console.log(flowerColor);
    material.forEach(function(m,index){
      m.color = new THREE.Color(0xffffff);
      m.specular = new THREE.Color(0xFDFFCB);
      m.shininess = .01;
      m.map = texture;
      m.side = THREE.DoubleSide;
      m.bumpMap = texture;
      m.bumpScale = 0.2;
      m.needsUpdate = true;
      m.transparent =true;
      m.depthTest = true;
      m.depthWrite = true;

      m.alphaTest = 0.35;
      if(morph){      
        m.morphTargets = true;
        m.skinning = true;
      }
    });

    return material;
  }

  loader.load(urls.flower,function(geometry,material){
    material = applyTexture(material,true);

    material[1].color = new THREE.Color('#'+flowerColor);
    material[1].color = new THREE.Color('#'+flowerColor);
    material[1].alphaTest = .8;


    var flowerMaterial = new THREE.MeshFaceMaterial(material);
      flower = new THREE.SkinnedMesh(geometry,flowerMaterial);
      flower.castShadow = true;
      floweranimation = new THREE.MorphAnimation(flower);

      scene.add(flower);

      flower.morphTargetInfluences[1] = .9;
      flower.scale.set(0,0,0);

      flower.update = function(time){

        this.skeleton.bones[4].rotation._x += (camera.rotation._x - this.skeleton.bones[4].rotation._x) * .25;
        this.skeleton.bones[4].rotation._y += (camera.rotation._y - this.skeleton.bones[4].rotation._y) * .25;
        this.skeleton.bones[4].rotation._z += (camera.rotation._z - this.skeleton.bones[4].rotation._z) * .25;
        // //console.log(x,y,z)
        this.skeleton.bones[4].rotation.x = this.skeleton.bones[4].rotation._x;
        this.skeleton.bones[4].rotation.y = this.skeleton.bones[4].rotation._y;
        this.skeleton.bones[4].rotation.z = this.skeleton.bones[4].rotation._z;

      }

      grow = new TWEEN.Tween({
        x : 0
      }).to({ 
            x: 1
          }, 1500).easing(TWEEN.Easing.Quadratic.In).onUpdate(function() {

            flower.scale.set(this.x,this.x,this.x);
            
          }).onComplete(function(){
            document.body.className +=' halm';
          });

      tween = new TWEEN.Tween({
        x : .9
      }).to({ 
            x: 0
          }, 1500).easing(TWEEN.Easing.Bounce.Out).onUpdate(function() {

            flower.morphTargetInfluences[1] = this.x;
            
          }).onComplete(function(){
            document.body.className +=' complete';
          });
      
      grow.chain(tween);
        grow.start();

      



      render(time);
  });
/*
  ******************************************** Hearts
*/
  loader.load(urls.hearts,function(geometry,material){
    material[0].shininess = 1;
    material[0].color = new THREE.Color(0xF7541C);
    material[0].specular = new THREE.Color(0xED8B69);
    material[0].opacity = 0.5;
    material[0].transparent = true;
    material[0].blending = THREE.AdaptiveBlending;


    hearts = new THREE.Group();
    var heartMat = new THREE.MeshFaceMaterial(material);
    var heart = new THREE.Mesh(geometry,heartMat);

    hearts.add(heart);

    for ( var i = 0; i < 50; i ++ ) {
      hearts.children[i] = new THREE.Mesh( geometry , heartMat );
      hearts.children[i]._own = {
        indexer : 0,
        max : Math.random() * 50 + 150,
        random : {
          x : randNum(0.01,0.05,true),
          y : randNum(0.01,0.05,false),
          z : randNum(0.01,0.05,true),
        },
        last : {
          x : 0,
          y : 0,
          z : 0
        }
      }


        hearts.children[i].rotation.x = randNum(0,10,true) * Math.PI / 180;
        hearts.children[i].rotation.y = randNum(0,360,true) * Math.PI / 180;
        hearts.children[i].rotation.z = randNum(0,10,true) * Math.PI / 180;
      var scaler = randNum(0.9,1.1,false);
     // hearts.children[i].scale.set(scaler,scaler,scaler);
      hearts.children[i].update = function(time){

        var percentage = Math.max(((100 * this._own.indexer/this._own.max) * .01), .01);
        this.scale.set(percentage,percentage,percentage);
        this.rotateY(0.01);
        if(this._own.indexer == 0){
          this._own.last.x = origin.x;
          this._own.last.y = origin.y;
          this._own.last.z = origin.z;
        }

        else{
          this._own.last.x += this._own.random.x;
          this._own.last.y += this._own.random.y;
          this._own.last.z += this._own.random.z;
        }
        
         this.position.set(this._own.last.x,this._own.last.y,this._own.last.z);

        if(this._own.indexer <= this._own.max){
          this._own.indexer++;
        }
        else{
          this._own.indexer = 0;
        }

      }    
    }


    
    scene.add(hearts);


  });
/*
  ******************************************** Gras
*/
  loader.load(urls.gras,function(geometry,material){
  
    var grasMaterial = new THREE.MeshFaceMaterial(applyTexture(material,false));
    var p;
      for ( var i = 0; i < 50; i ++ ) {
          var gras = new THREE.Mesh( geometry , grasMaterial );
            p = calculatePointInCircle(12)
              gras.position.x = p[0];
              gras.position.z = p[1];
              gras.rotation.y = randNum(0,360,false) * Math.PI / 180;
              gras.updateMatrix();
              gras.matrixAutoUpdate = false;
              //gras.castShadow = true;
              gras.receiveShadow = true;
              scene.add( gras );
      }
  });
});

/*
  ************************************************ GROUND
*/
var planeMat = new THREE.MeshPhongMaterial({
  color : 0x455029,
  specular : 0x000000,
  shininess : 0,
  side : THREE.DoubleSide,
});


var radius = 21; 
var segments = 32; 
var circleGeometry = new THREE.RingGeometry(0, radius, segments, segments, 0, Math.PI * 2);

var ground = new THREE.Mesh(circleGeometry,planeMat);
    ground.rotation.x = 90 * Math.PI / 180;
    ground.receiveShadow = true;
    scene.add(ground);

var boundMat = new THREE.MeshPhongMaterial({
  color : 0xffffff,
  specular : 0xeeeeee,
  shininess : 0,
  side : THREE.DoubleSide,
  shading : THREE.FlatShading
});
var boundGeometry = new THREE.TorusGeometry( 21.5, 4 , 8, 180);
var bound = new THREE.Mesh( boundGeometry, boundMat );
bound.rotation.x = 90 * Math.PI/180;
scene.add( bound );

/*
  ************************************************ Particles
*/

var particles = new THREE.Geometry();

var pMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: .1,
      sizeAttenuation : false,
      transparent:true,
      opacity:.25,
    });


for(var i=0;i<10000;i++){
  var x = (Math.random() - 0.5 ) * 40;
  var y = (Math.random() - 0.5 ) * 40;
  var z = (Math.random() - 0.5 ) * 40;
  particles.vertices.push(new THREE.Vector3(x,y,z));
}

var particleSystem_1 = new THREE.Points(particles,pMaterial);
scene.add(particleSystem_1);

/*
  ************************************************ Render
*/


//__________ render
var render = function (time) { 
  requestAnimationFrame( render ); 
  animation(time);
  controls.update();

  TWEEN.update( time );
  renderer.render(scene, camera);
};

//__________ animation

function animation(time){
  
  var delta = .75 * clock.getDelta();

  if(typeof hearts != 'undefined'){
    hearts.children.forEach(function(h,i){
      h.update(time);
    });
  }

  flower.update(time);
  THREE.AnimationHandler.update( delta/interpolation );
  // scene.rotation.y  -= .0005;
};

//__________


document.body.addEventListener('mousemove',function(event){
  
  var pos = getSpacePosFromMouse(event.pageX,event.pageY);

  origin.x = pos.x;
  origin.y = pos.y;
  origin.z = pos.z;
});




//_______________________________ UI


card.addEventListener('mouseenter',function(){
  controls.enabled = false;
});

card.addEventListener('mouseleave',function(){
  controls.enabled = true;
});


// GENERATE URL PARAMS

send.addEventListener('click',function(event){
event.preventDefault(event);
  var fromName = name_from.value;
  var toName = name_to.value;



  if(evaluateInput(fromName) && evaluateInput(toName)){
    document.body.classList.remove('error');
    var shareURL = window.location + '?&fromName=' + encoder(fromName) + '&toName='+ encoder(toName) + '&flowerColor=' + encoder(flowerColor);
    send.setAttribute('aria-label',shareURL);

    new Clipboard('#send', {
      text: function(trigger) {
          document.body.className += ' linkCopied';
          return trigger.getAttribute('aria-label');
      }
    });
  
  }


});





//}()); //__eof

