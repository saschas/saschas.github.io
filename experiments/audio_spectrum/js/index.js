///////////////////////////////////////////////
// create Audiocontext for all modern Browser
///////////////////////////////////////////////
var context;

if(typeof AudioContext !== "undefined"){
  context = new AudioContext();
}
else if (typeof webkitAudioContext !== "undefined"){
  context = new webkitAudioContext();
}
else {
  console.log('sorry AudioContext is not supported! Please view this pen with Chrome')
}

///////////////////////////////////////////////
// create Navigator for all modern Browser
///////////////////////////////////////////////
navigator.getUserMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

///////////////////////////////////////////////
// Variables
///////////////////////////////////////////////

var $loop;         // runtime
var analyser,      // holds the context
    frequencyData, // the data Array -> Uint8Array[1024]
    bufferLength,  // 1024
    processor,
    recorder,
    source;        // the audio source
		
var $player = $("#player");
  // Audio Element
	    $player_source = $player.get(0);
  // Creates the analyser
    analyser = context.createAnalyser();
  // Defines the quality
  // Range [32, 2048]
	    analyser.fftSize = 2048;
  // The real meat of everything
  // here sits the data
    frequencyData = new Uint8Array(analyser.frequencyBinCount);
  
  // Data Count
	  // 1024 = 2048(fftSize) / 2 ~10Hz(?) <~ not sure about that?
    bufferLength = analyser.frequencyBinCount;
  // console.log(bufferLength); 
	   
  //audio Source
    source = context.createMediaElementSource($player_source);
	  // connect the audio source with the analyser
	    source.connect(analyser);

// User Object
var å = {
  	screen : {
      x : window.innerWidth,
      y : window.innerHeight
    },
  mouse : {
    x : window.innerWidth/2,
    y : window.innerHeight/2
  },
  scale : .5
}

///////////////////////////
/// Data Array for capturing
///////////////////////////
var $data = [];
var $audioData = [];
function makeArray($data){
  if($dataArray == undefined){
   var $dataArray = [$data];
  }
  else{
    $dataArray.push($data);
  }
  return $dataArray;
}

///////////////////////////
// clear Timeout aka stop Animation
//////////////////////////
if (!window.cancelAnimationFrame)
  window.cancelAnimationFrame = function (id) {
    clearTimeout(id);
};
////////////////////////
// Set Size for canvas
/////////////////////////
function sizer(){
  å.screen.x = window.innerWidth;
  å.screen.y = window.innerHeight;
}
var randomX = 0;
var randomY = 0;
////////////////////////
// the Loop 
//////////////////////////

function capture(data) {
    //  audio input source microphone
    source = context.createMediaStreamSource(data);
    audio_data = data;

    analyser= context.createAnalyser();

    // Create the array for the data values
    analyser.getByteFrequencyData(frequencyData);
  var realtimeData = new Uint8Array(analyser.frequencyBinCount);
//console.log(frequencyData);
    
    // Now connect the nodes together
    // Do not connect source node to destination - to avoid feedback
    source.connect(analyser);
    analyser.connect(processor);
    processor.connect(context.destination);
}

function onError(e) {
    console.log(e);
}

function update() {

   // amplitudeArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteTimeDomainData(frequencyData);
	    
    var $transform_audiData = [];
    for(var i=0;i< frequencyData.length;i++){
      $transform_audiData.push(frequencyData[i]);
    }
    var $array = $transform_audiData;
    $audioData.push($array);
    // draw one column of the display
    $loop = requestAnimationFrame(update);
}
////////////////////////
// Window event
/////////////////////////
window.onresize = sizer;
// Set the size of canvas at the beginning
sizer();
///////////////////////////////////////////////
// Bind to audio
// if audio is ready to play 
///////////////////////////////////////////////
$("html,body").bind({
  //update the å object
  mousemove : function(e){
    å.mouse.x = e.pageX;
    å.mouse.y = e.pageY;
  }
});

$player.bind({
  progress: function(e){
  //  console.log(e);
  },
  canplaythrough: function() {
    $('.play-button').addClass('canplay');
  },
  play: function(){
    // Kick off the visualisation
    //
    connect();
  },
  pause : function(){
    cancelAnimationFrame($loop);
    console.log($audioData);
  },
  ended :function(){
    $('.play-button').removeClass('on');
  }
});

var capture_setting = { 
    video: false,
    audio: true
}

function connect(){
  processor = context.createScriptProcessor(1024, 1, 1);  navigator.getUserMedia(capture_setting,capture,onError);
  $loop = update();
}

// Disconnect the audio
// Stop capturing
function disconnect(){
 processor.onaudioprocess = null;
 audio_data.stop();
 source.disconnect();
}
//////////////////////////////////////////
    //   Setup three.js
//////////////////////////////////////////
var main_color = 0xE94A49;
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
    spotLight.position.set( 0, 300, 300 );
    spotLight.intensity = 3;
    spotLight.castShadow = true;
    scene.add(spotLight);
var frontLight = new THREE.SpotLight(0xFCD146);
    frontLight.position.set( 0, 50, 400 );
    frontLight.intensity = 0.6;
    scene.add(frontLight);

//////////////////////////////////////////
    //   Sphere Geometry
//////////////////////////////////////////
var cube_geometry = new THREE.BoxGeometry( .5,10,10 );
var cube_material = new THREE.MeshLambertMaterial( {
  color: 0xFCD144,
  opacity:.8,
  transparent:true
});
var cube_fac = window.innerWidth;
var cube_scale = 0.25;
var cube_holder = new THREE.Object3D();
for(var i=0;i<128;i++){
	  var x = -window.innerWidth/2 + (window.innerWidth/128)*i;
	  var y = -6;
	  var z = 0;
  var cube = new THREE.Mesh( cube_geometry, cube_material );
 cube.scale.set(cube_scale,cube_scale,cube_scale);
  cube.position.x = x;
  cube.position.y = y;
  cube.position.z = z;
  cube.receiveShadow = true;
  cube.castShadow = true;
  cube_holder.add(cube);
}

scene.add( cube_holder );

//////////////////////////////////////////
    //    Floor Geometry
//////////////////////////////////////////
var geometry = new THREE.PlaneGeometry( canvas_width * 2,canvas_height*2, 32 );
var material = new THREE.MeshBasicMaterial({
  color: main_color, 
  side: THREE.DoubleSide
});
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
    cube_holder.children.forEach(function(i){
      //console.log(i);
      count++;
      var scaler = frequencyData[count]*.05;

      if(scaler>0){
        if(scaler<.3){scaler=.3}
        data_count++;
   		  i.scale.set(10,scaler,10);        
       }
    });
  }
  scene.rotation.y  -= .0005;
}
///////////////////////////////////////////////
// Controller
// Play and Pause Button
///////////////////////////////////////////////

$('.play-button').click(function(){
  if(!$('.play-button').hasClass('on')){
   connect();
    $('.play-button').addClass('on');
    $('.article-single-header').addClass('audio-active');
  }
  else{
    disconnect();
    å.data = [$audioData];
    $('.play-button').removeClass('on');
    $('.article-single-header').removeClass('audio-active');
  }
});