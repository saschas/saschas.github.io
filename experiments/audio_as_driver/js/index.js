///////////////////////////////////////////////
// create Audiocontext for all modern Browser
///////////////////////////////////////////////
var context;
if (typeof AudioContext !== "undefined") {
  context = new AudioContext();
} else if (typeof webkitAudioContext !== "undefined") {
  context = new webkitAudioContext();
} else {
  //return;
}

///////////////////////////
// clear AnimationFrame
//////////////////////////
if (!window.cancelAnimationFrame)
  window.cancelAnimationFrame = function (id) {
    clearTimeout(id);
  };
///////////////////////////////////////////////
// Animation
// update Function
///////////////////////////////////////////////
// setup some Variables 
// for the Data
//////////////////////////

var $audioData = {};
var $loop;
var $rectWidth = 4;
var $offset = 50;
var paint_bar = false;
var analyser,frequencyData,barSpacingPercent,source;
////////////////////////
// the Loop 
//////////////////////////
function update() {

  $loop = requestAnimationFrame(update);
      return $loop; //returns loop for canceling
  };
 
////////////////////////
// Initial Setup for the audio
/////////////////////////
function init(el){
  analyser = context.createAnalyser();
  analyser.fftSize = 512;
  frequencyData = new Uint8Array(analyser.frequencyBinCount);
  barSpacingPercent = analyser.frequencyBinCount;

  source = context.createMediaElementSource(el);
  source.connect(analyser);
  analyser.connect(context.destination);
  return true;
}
///////////////////////////////////////////////
var main_color = 0x10BAE7;
var canvas_height = window.innerHeight;
var canvas_width = window.innerWidth;
//////////////////////////////////////////
    //   Scene
//////////////////////////////////////////
var scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( main_color, 0.0025 );

//////////////////////////////////////////
    //   Camera
//////////////////////////////////////////
var camera = new THREE.PerspectiveCamera( 75, canvas_width/canvas_height, 0.1, 1000 );
    camera.lookAt(new THREE.Vector3(0,50,0));
    camera.position.set(0,50,200);
//////////////////////////////////////////
    //   Renderer
//////////////////////////////////////////
var renderer = new THREE.WebGLRenderer({ alpha: true }); /// { alpha: true }
    renderer.setSize( canvas_width, canvas_height );
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;
    renderer.setClearColor(main_color,1);
$('.main').append( renderer.domElement );


//////////////////////////////////////////
    //   Resize
//////////////////////////////////////////
window.onresize = function(){
  canvas_height = window.innerHeight;
  canvas_width = window.innerWidth;
  camera.aspect = canvas_width / canvas_height;
  camera.updateProjectionMatrix();
  renderer.setSize( canvas_width, canvas_height );
}
//////////////////////////////////////////
    //   Controls
//////////////////////////////////////////
  controls = new THREE.OrbitControls( camera );
  controls.damping = 0.2;
  controls.maxPolarAngle = Math.PI/2;
  controls.minPolarAngle = 1;
  controls.minDistance = 100;
  controls.maxDistance = 220;
  controls.enabled = true;
//////////////////////////////////////////
    //    Light Setup
//////////////////////////////////////////
var spotLight = new THREE.SpotLight(0xFCD146);
    spotLight.position.set( 0, 300, -300 );
    spotLight.intensity = 3;
    spotLight.castShadow = true;
    scene.add(spotLight);
var frontLight = new THREE.SpotLight(0xFCD146);
    frontLight.position.set( 0, 50, 400 );
    frontLight.intensity = 0.6;
    scene.add(frontLight);

//////////////////////////////////////////
    //    Line Setup
//////////////////////////////////////////
var line_material = new THREE.LineBasicMaterial({
    color: 0x70B5F2, 
  	  linewidth: 5, 
    fog:true
});

var line_geometry = new THREE.Geometry();
for(var i=0;i<256;i++){
  var vec_3 = new THREE.Vector3( -window.innerWidth/2 + (window.innerWidth/256)*i, 0, 0 );
  line_geometry.vertices.push(vec_3);
}
var line = new THREE.Line( line_geometry, line_material );
scene.add( line );
//////////////////////////////////////////
    //    Particles
//////////////////////////////////////////
var particles = new THREE.Geometry();
// Cross Origin
// loading the image from a different url
// causes Security issues that you can fix like this

THREE.ImageUtils.crossOrigin = true;
// Particle Material
var pMaterial = new THREE.PointCloudMaterial({
      color: 0x136099,
      size: 1,
      transparent:true,
      opacity:.25,
      map : THREE.ImageUtils.loadTexture(
        "https://s3-us-west-2.amazonaws.com/s.cdpn.io/61062/gradient.png"
      )
    });
// make 10.000 of Particles
for(var i=0;i<10000;i++){
  var x = (Math.random() - 0.5 ) * 400;
  var y = (Math.random() - 0.5 ) * 400;
  var z = (Math.random() - 0.5 ) * 400;
  particles.vertices.push(new THREE.Vector3(x,y,z));
}
// make 10.000 of Particles
var particleSystem = new THREE.PointCloud(particles,pMaterial);
scene.add(particleSystem);
//////////////////////////////////////////
    //   Sphere Geometry
//////////////////////////////////////////
var sphere_geometry = new THREE.SphereGeometry( 0, 16, 16 );
var sphere_material = new THREE.MeshLambertMaterial( {
  color: 0x0C345A,
  opacity:.5,
  transparent:true
});
var sphere_fac = window.innerWidth;
var sphere_scale = 0.25;
var sphere_holder = new THREE.Object3D();
for(var i=0;i<256;i++){
	  var x = (Math.random() - 0.5 ) * sphere_fac;
	  var y = -6;
	  var z = (Math.random() - 0.5 ) * sphere_fac;
  var sphere = new THREE.Mesh( sphere_geometry, sphere_material );
 sphere.scale.set(sphere_scale,sphere_scale,sphere_scale);
  sphere.position.x = x;
  sphere.position.y = y;
  sphere.position.z = z;
  sphere.receiveShadow = true;
  sphere.castShadow = true;
  sphere_holder.add(sphere);
}
	  
scene.add( sphere_holder );

//////////////////////////////////////////
    //    Floor Geometry
//////////////////////////////////////////
var geometry = new THREE.PlaneGeometry( canvas_width * 2,canvas_height*2, 32 );
var material = new THREE.MeshBasicMaterial( {color: 0x0F2B5A, side: THREE.DoubleSide} );
var floor = new THREE.Mesh( geometry, material );
	floor.rotation.x = 90 * Math.PI/180;
floor.position.y = -5;
floor.receiveShadow = true;
scene.add( floor );

//////////////////////////////////////////
//   Render
//////////////////////////////////////////
var render = function () { 
  render_loop = requestAnimationFrame( render ); 
  animation();
  renderer.render(scene, camera);
  return render_loop;
};
render();
//////////////////////////////////////////
    //    Animation
//////////////////////////////////////////
var data_count = 0;
var global_count = 0;

function animation(){
  //Get the frequencyData of audio
  if(analyser){
    global_count++;
    analyser.getByteFrequencyData(frequencyData);
    var data_count = frequencyData.length;
    var count = 0;
    sphere_holder.children.forEach(function(i){
      //console.log(i);
      count++;
      var scaler = frequencyData[count]*.0025;
      
      if(scaler>0){
        if(scaler<.3){scaler=.3}
        data_count++;
        line.geometry.vertices[count].y = frequencyData[count]*0.15;
        //console.log(frequencyData[count]);
        line.geometry.verticesNeedUpdate = true;
      		  i.scale.set(scaler,scaler,scaler);
        i.position.y += .2;
        i.scale.x -=.1;
        i.scale.y -=.1;
        i.scale.z -=.1;
        if(i.position.y>150){
          i.position.y = -15;
        }
        
       }
    });
  }
  scene.rotation.y  -= .0005;
}

///////////////////////////////////////////////
// Bind to audio
// if audio is ready to play 
///////////////////////////////////////////////

$("#player").bind({
  progress: function(e){
   // console.log(e);
  },
  canplaythrough: function() {
    $('.play-button').addClass('canplay');
  },
  play: function(){
    console.log(this.audioInit);
    if(this.audioInit===undefined){
      this.audioInit = init(this);        
    }
    $loop = update();
  },
  pause : function(){
    cancelAnimationFrame($loop);
  },
  ended :function(){
    $('.play-button').removeClass('on');
  }
});
///////////////////////////////////////////////
// Controller
// Play and Pause Button
///////////////////////////////////////////////
var render_loop = null;
$('.play-button').click(function(){
  if($('#player').get(0).paused){
    $('#player').get(0).play();
    $(this).addClass('on');
  }
  
  else{
    $('#player').get(0).pause();
    $(this).removeClass('on');
  } 
});