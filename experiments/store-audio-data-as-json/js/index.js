//////////////////////////////////////////////////////
///// Equalize Context fpr Audio
//////////////////////////////////////////////////////
var context;
if (typeof AudioContext !== "undefined") {
	context = new AudioContext();
} else if (typeof webkitAudioContext !== "undefined") {
	context = new webkitAudioContext();
} else {
    //return;
  }

//////////////////////////////////////////////////////
/////	Some Variables
//////////////////////////////////////////////////////

var $audioData = new Array();
var group;
var currCount = 0;
var $max = 10; 
var onScreen = [];

//////////////////////
// Player Settings
/////////////////////
var $player = $("#player");
var $player_src = $player.get(0);
		$player_src.round_duration = Math.round($player_src.duration);
	
	// Mute Audio
	//	$player_src.muted = true;

//////////////////////
// Timeline
/////////////////////

var $head_navi = $('.audio-navi');
var $timeline = $('.time');
var $duration = $player_src.duration;
var $timeLineWidth = $head_navi.width()-100;

//////////////////////////////////////////////////////
/////	Create the analyser
//////////////////////////////////////////////////////

var analyser = context.createAnalyser();

// Quality of Audio 64 | 128 | 256
		analyser.fftSize = 64;
// THE realtimeData -> Thats the MEAT you want !
var realtimeData = new Uint8Array(analyser.frequencyBinCount);

////////////////////////////////////////////////////
//// 	Source Context
////////////////////////////////////////////////////

var source = context.createMediaElementSource($("#player").get(0));
		source.connect(analyser);

//////////////////////
// connect the context aka 
// source to the analyser
//////////////////////

analyser.connect(context.destination);

var $data = [];
function makeArray($data){
  if($dataArray == undefined){
   var $dataArray = [$data];
  }
  else{
    $dataArray.push($data);
  }
  return $dataArray;
}
////////////////////////////////////////////////////
//// 	Events on the audio
////////////////////////////////////////////////////

$player.on({
	canplay : function() {
		// anything
	},

//////////////////////////////////////////////////////
/////	Timeupdate
//////////////////////////////////////////////////////
	timeupdate: function(event){		
		//	on each timeupdate the analyser collects realtimeData 
		analyser.getByteFrequencyData(realtimeData);
    var $transform_audiData = [];
    for(var i=0;i< realtimeData.length;i++){
      $transform_audiData.push(realtimeData[i]);
    }
     var $array = $transform_audiData;
		$audioData.push($array);    
	},
	play: function(){
      console.clear();
		console.log('Wait for the data to be processed...');
	},
	pause : function(){
		console.log('paused');
    
	},
	ended : function(){
    $('.play').removeClass('on').addClass('off');
   // console.clear();
    
		//end of console realtimeData
		console.group('Ended'+ '\n \n' +
									'Have a look at '+ '\n' +
									'http://bgrins.github.io/devtools-snippets/#console-save' + '\n' +
									'and get the snippet for chrome dev tools to save the data!'  + '\n \n' +
									'CAUTION: You have to enable snippets by ' + '\n' +
									'http://stackoverflow.com/questions/10470711/chrome-developer-tools-what-is-snippets-support'+ '\n \n' +
									'1. run the snippet' + '\n \n' ,
                      '**************************************************'+ '\n' +
                      'FOR USE IN CODEPEN'+ '\n' +
                      'Switch "<top frame>" to "Codepen( index.html)"'+ '\n' +
                      '**************************************************'+ '\n \n' +
									'Store this Array as *global variable*' + '\n' , 
									$audioData ,
									'\n \n'+
									'right click----save as global variable----console.save(temp1)');
		console.groupEnd();
	}
});

//////////////////////////////////////////////////////
/////	Controls
//////////////////////////////////////////////////////

$head_navi.find('.play').bind({
	click : function(){
//////////////////
/////	Toggle Play
//////////////////
		if($player_src.paused){
			$(this).removeClass('off').addClass('on');
			$player_src.play();
		}
		else{
			$(this).removeClass('on').addClass('off');
			$player_src.pause();
		}
	}
});