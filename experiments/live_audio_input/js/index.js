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

// Prepare Canvas for first use
var canvas = document.getElementById('c');
// Audio Manipulation
var c = canvas.getContext('2d');
		
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
  canvas.width = å.screen.x;
  canvas.height = å.screen.y;
}
var randomX = 0;
var randomY = 0;
////////////////////////
// the Loop 
//////////////////////////
function update() {
  ////////////////////////
  // update the Data 
  ////////////////////////
  analyser.getByteFrequencyData(frequencyData);
   //Clear the Canvas for the next Frame
   c.fillStyle = 'rgba(240,15,52,0.2)';
   c.fillRect(0,0,å.screen.x,å.screen.y);
   ////////////////////////
  // Barchart
  //////////////////////////
  for(var i=0;i<32;i++){
    if(frequencyData[i]!=0){
  	
      c.beginPath();
      c.lineWidth = 1;
      c.strokeStyle = 'rgba(255,255,255,.1)';
      
      c.lineTo(å.screen.x/2+frequencyData[i],0);
      c.stroke();
      c.lineTo(å.screen.x/2+frequencyData[i],å.screen.y);
      c.stroke();
      
      c.lineTo(å.screen.x/2+frequencyData[i],0);
    	  c.stroke();
      
////////////////////////
// Circle Animation
//////////////////////////
      c.beginPath();
      c.arc(å.mouse.x, å.mouse.y, frequencyData[i]*å.scale, 0, 2 * Math.PI, false);
      c.lineWidth = 1;
      c.strokeStyle = 'rgba(255,255,255,.1)';
      c.stroke();
      
  	}//end of if
}//end of for
  return $loop; //returns loop for canceling
}

function capture(data) {
    //  audio input source microphone
    source = context.createMediaStreamSource(data);
    audio_data = data;

    analyser= context.createAnalyser();

    // Create the array for the data values
    analyser.getByteFrequencyData(frequencyData);
  var realtimeData = new Uint8Array(analyser.frequencyBinCount);
//console.log(frequencyData);
    processor.onaudioprocess = function () {

   // amplitudeArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteTimeDomainData(realtimeData);
	    
    var $transform_audiData = [];
    for(var i=0;i< realtimeData.length;i++){
      $transform_audiData.push(realtimeData[i]);
    }
    var $array = $transform_audiData;
    		$audioData.push($array);
    // draw one column of the display
    $loop = requestAnimationFrame(update);
}
    // Now connect the nodes together
    // Do not connect source node to destination - to avoid feedback
    source.connect(analyser);
    analyser.connect(processor);
    processor.connect(context.destination);
}

function onError(e) {
    console.log(e);
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
    console.log(å.data);
    $('.play-button').removeClass('on');
    $('.article-single-header').removeClass('audio-active');
  }
});