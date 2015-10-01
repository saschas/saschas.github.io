// NOTE: requestAnimationFrame by Paul Irish is already in loaded
// HELPER FUNCTION: cancelAnimationFrame for pause
if (!window.cancelAnimationFrame){
 window.cancelAnimationFrame = function (id) {
    clearTimeout(id);
  };
}
///////////////////////////////////////////////
// create Audiocontext for all modern Browser
///////////////////////////////////////////////
var context;

if (typeof AudioContext !== "undefined") {
  context = new AudioContext();
} else if (typeof webkitAudioContext !== "undefined") {
  context = new webkitAudioContext();
} else {
  console.log('Oh,sorry but something went wrong creating the AudioContext.');
}
///////////////////////////
// Some Variables at the start
//////////////////////////

var $loop;
// Store the HTML audio Element in a Variable 
var $player = $('#player');
var $player_el = $player.get(0);


var source = context.createMediaElementSource($player_el);
$player_el.crossOrigin = 'anonymous';
  // Analyser
  // Creates the actual Analyser
var analyser = context.createAnalyser();
  // Quality of analyser between 32 - 2048
  analyser.fftSize = 128;
  // that holds to store the Audio Data
var frequencyData = new Uint8Array(analyser.frequencyBinCount);
  //console.log(frequencyData);
  // Source + Analyser 
  // Connects the Analyser with the real audio Source
    source.connect(analyser);

  // Destination
  analyser.connect(context.destination);
var å = {
    screen : {
      x : window.innerWidth,
      y : window.innerHeight
    },
  mouse : {
    x : window.innerWidth/2,
    y : window.innerHeight/2
  },
  scale : 0.25,
  paint_bar : false
};


// Play Button
var $playbutton = $('.play-button');

var $body = $("html,body");
// Prepare Canvas for first use  
var canvas = document.getElementById('c');
var c = canvas.getContext('2d');

////////////////////////
// Set Size for canvas
/////////////////////////
function sizer(){
  //update object
  å.screen.x = window.innerWidth;
  å.screen.y = window.innerHeight;
  //update canvas size
  canvas.width = å.screen.x;
  canvas.height = å.screen.y;
}

//Call the size function to setup sizes
sizer();
// onresize
window.onresize = sizer;
  
////////////////////////
// Initial Setup for the audio
/////////////////////////


////////////////////////////////////////////////
// Render Loop (with requestAnimationFrame)
////////////////////////////////////////////////
function update() {
  //request the next Frame
  $loop = requestAnimationFrame(update);
  
  // Analyser Data
  // update frequencyData for current Frame
  analyser.getByteFrequencyData(frequencyData);
  //console.log(frequencyData)

  //Clear the Canvas for the next Frame
   c.fillStyle = 'rgba(251,205,66,.1)';
   c.fillRect(0,0,å.screen.x,å.screen.y);

  ////////////////////////
  // Barchart
  //////////////////////////
  for(var i=0;i<frequencyData.length;i++){
    //stores the current data in a variable
    var data_single = frequencyData[i];
    //if the data is not zero(minimum Value);
    if(data_single !== 0){
      
      ////////////////////////
        // Barchart
        ////////////////////////// 

        var data_count = frequencyData.length;
        c.fillStyle = '#000';
        
        var barwidth = window.innerWidth/data_count;
        for(var i=0;i<data_count;i++){
          if(frequencyData[i]!=0 && å.paint_bar){
            c.font = "12px serif";
            c.fillStyle = 'rgba(0,0,0,1)';
            c.fillRect(barwidth*i,å.screen.y*2,barwidth,-frequencyData[i]);
            c.fillStyle = 'rgba(251,205,66,1)';
            c.fillText(frequencyData[i],barwidth*i + 15,canvas.height);
            c.fillStyle = 'rgba(0,0,0,1)';
            c.fillRect((window.innerWidth-(barwidth*i)),å.screen.y,barwidth,-frequencyData[i]);
            c.fillStyle = 'rgba(251,205,66,1)';
            c.fillText(frequencyData[i],(window.innerWidth-(barwidth*i)) + 15,canvas.height);
          }
        }
       ////////////////////////
        // Path Animation
        // frequencyData is the Array
        //////////////////////////
         
        c.beginPath();
        c.strokeStyle = '#000';
        for(var i=0;i<data_count;i++){
          if(frequencyData[i]!=0){
            c.lineTo((å.screen.x/2)+ (å.screen.x/2)/frequencyData.length*i, (å.screen.y/2) + frequencyData[i]);
          }
        }
        c.stroke();
        ////////////////////////
        // 2nd Path Animation
        //////////////////////////     
        c.beginPath();
        for(var i=0;i<data_count;i++){
          if(frequencyData[i]!=0){
            c.lineTo((å.screen.x/2) - (å.screen.x/2)/frequencyData.length*i, (å.screen.y/2) + frequencyData[i]);
          }
        }
        c.strokeStyle = '#000';
        c.stroke();
       ////////////////////////
        // 3nd Path Animation
        ////////////////////////// 
        c.beginPath();
        c.strokeStyle = '#000';
        for(var i=0;i<data_count;i++){
          if(frequencyData[i]!=0){
            c.lineTo((å.screen.x/2)+ (å.screen.x/2)/frequencyData.length*i, (å.screen.y/2) - frequencyData[i]);
          }
        }
        c.stroke();

        ////////////////////////
        // 4nd Path Animation
        //////////////////////////  
        c.beginPath();
        c.strokeStyle = '#000';
        for(var i=0;i<data_count;i++){
          if(frequencyData[i]!=0){
            c.lineTo((å.screen.x/2) -(å.screen.x/2)/frequencyData.length*i,(å.screen.y/2) - frequencyData[i]);
          }
        }
        c.stroke();
  
      }//end of if
  }//end of for
  //returns loop for canceling
  return $loop; 
}
///////////////////////////////////////////////
// Update Mouse position in Object 
///////////////////////////////////////////////
$body.bind({
  mousemove : function(e){
    å.mouse.x = e.pageX;
    å.mouse.y = e.pageY;
  }
});
///////////////////////////////////////////////
// Player Settings
///////////////////////////////////////////////


$player.bind({
  progress: function(e){
    
  },
  canplaythrough: function() {
    
    $playbutton.addClass('canplay');
    $loop = update();
    //this.audioInit = init(this);
    $player_el.play();
    $(this).addClass('on');
  },
  play: function(){
    
    
    
  },
  pause : function(){
    //stop the animationFrame Loop
    cancelAnimationFrame($loop);
  },
  ended :function(){
    $playbutton.removeClass('on');
  }
});

///////////////////////////////////////////////
// Controller
// Play and Pause Button
///////////////////////////////////////////////

$playbutton.click(function(){
  if($player_el.paused){
    $player_el.play();
    $(this).addClass('on');
  }
  else{
    $player_el.pause();
    $(this).removeClass('on');
  } 
});