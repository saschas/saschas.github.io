//____________________________________________
var time = 0;
//_______________________________________________________
(function(console){
console.save = function(data, filename){
    if(!data) {
        console.error('Console.save: No data')
        return;
    }
    if(!filename) filename = 'console.json';
    if(typeof data === "object"){
        data = JSON.stringify(data, undefined, 4)
    }
    var blob = new Blob([data], {type: 'text/json'}),
        e    = document.createEvent('MouseEvents'),
        a    = document.createElement('a')
    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
 }
})(console);

function pointInCircle(x, y, cx, cy, radius) {
  var distsq = (x - cx) * (x - cx) + (y - cy) * (y - cy);
  return distsq <= radius * radius;
}
//_______________________________________________________
var GLOBAL = {
  
  LAST_ : new Date,
  now : new Date,
  then : new Date,
  elapsed : 0,
  timestep : 1000,//60fps / 1000 = 1sek
  fps : 0,
  action : false,
  resolution : 4410,
  changed : false,
  data : generate_starting_points(),
  formel : '//HIT PLAY!\n//Listen to your code!\n//PRO TIP A: Hover the points while playing\n//PRO TIP B: Export your points for later use...i will add an import function in the next few days \n\nwindow.innerHeight/2 + 20* Math.sin(0.00215 * i) * Math.cos(0.15 * i)*10',
  current : null,
  mouse : {
    x : 0,
    y : 0,
    radius: 50
  },
  grid : {
    bool : false,
    count : 50,
    color : '#474747'
  },
}

//_________________________________________

var input_ = document.createElement('textarea');
    //input_.setAttribute('rows',3);
var formel = document.createTextNode(GLOBAL.formel);
    input_.appendChild(formel);
    document.body.appendChild(input_);

var editor = CodeMirror.fromTextArea(input_,{
    lineNumbers: true,
    mode : 'javascript',
    theme :'monokai',
      lineWrapping: true
  });

editor.on("change", function(cm, change) {
  GLOBAL.formel = cm.getValue();
  GLOBAL.data = generate_starting_points();
  stopSound(GLOBAL.current);
  sound_by_array(GLOBAL.data);

});
editor.setSize(window.innerWidth, window.innerHeight)

//_________________________________________
var action_button = document.getElementById('action');
action_button.addEventListener('click',function(){
  GLOBAL.action = !GLOBAL.action;
  c.clearRect(0,0,window.innerWidth,window.innerHeight);
  if(GLOBAL.action){
    sound_by_array(GLOBAL.data);
  }
  if(!GLOBAL.action){
    GLOBAL.data = generate_starting_points();
    stopSound(GLOBAL.current);
  }
},false);
//_________________________________________
var export_button = document.getElementById('export');
export_button.addEventListener('click',function(){  
  console.save(GLOBAL.data);
},false);
//________________________________________
function rand_num(min,max,bool){
  var num = Math.floor(Math.random()*max) + min;
  if(bool || typeof bool === "undefined"){
    num *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
  }
  return num;
}
//________________________________________ LATER ! 

/*(function(){    
  function onChange(event) {
      var reader = new FileReader();
      reader.onload = onReaderLoad;
      //reader.readAsText(event.target.files[0]);
  }

  function onReaderLoad(event){
      var obj = JSON.parse(event.target.result);
      console.log(event.target.result);
      GLOBAL.data = obj;
  }    document.getElementById('file').addEventListener('change', onChange);
}());*/


//________________________________________
function generate_starting_points(){
  var start_array_ = [];
  var custom_function;
  var max = 4410;
  
  if(typeof GLOBAL == "undefined"){
     custom_function_string = "window.innerHeight/2 + 20* Math.sin(0.00215 * i) * Math.cos(0.15 * i)*10";
  }
  else{
    custom_function_string = GLOBAL.formel;
  }
  for(var i=0;i<max;i++){
    var x_ = i*window.innerWidth/max;
    var y_ = eval(custom_function_string);
    start_array_.push({x:x_,y:y_});
  }
  return start_array_;
}

//____________________________________________
var canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

var c = canvas.getContext('2d');
document.body.appendChild(canvas);

//____________________________________________
var å = {
  size : {
    x : window.innerWidth,
    y : window.innerHeight/2
  },
  pos: {
    x : 0,
    y : 0,
    z : 0
  }
}

//____________________________________ STANDARD GRID

function draw_anyway(time){
  c.clearRect(0,0,window.innerWidth,window.innerHeight);
  //c.fillStyle = '#1d1f20';
  //c.fillRect(0,0,window.innerWidth,window.innerHeight);
  if(GLOBAL.grid.bool){
  c.fillStyle = GLOBAL.grid.color;
  for(var i=0;i<GLOBAL.grid.count;i++){
    if(window.innerWidth < window.innerHeight){
      var master_size = window.innerHeight/50*i
    }
    else{
      var master_size = window.innerWidth/50*i
    }
    c.fillRect(0,master_size,window.innerWidth,1);
    c.fillRect(master_size,0,1,window.innerHeight);
  } 
  }
  for(var i=0;i<GLOBAL.grid.count;i++){
  c.fillRect(GLOBAL.mouse.x+Math.sin(i)*GLOBAL.mouse.radius,GLOBAL.mouse.y + Math.cos(i)*GLOBAL.mouse.radius,1,1);
  }
  c.fillStyle = '#000';
}

//____________________________________ RANDOM

function draw(time){
/* var x_ = window.innerWidth/2 + Math.sin(time) * 10;
 var y_ = window.innerHeight/2 + Math.cos(time) * 10;
  
  c.fillRect(x_,y_,1,1);*/
  //console.log(GLOBAL.data);
  draw_anyway(time);
  c.fillStyle = '#333';
  
    //console.log(time.toFixed(0));
    for(var i=0;i<GLOBAL.resolution;i++){
      var x_ = GLOBAL.data[i].x;
      var y_ = GLOBAL.data[i].y;    
      c.fillRect(x_,y_,1,1);
    }
}

//____________________________________ MANIPULATE SOUND

function fall(time){
  draw_anyway(time);
  c.fillStyle = '#333';
  
    GLOBAL.changed = false;
    GLOBAL.data.forEach(function(point,index){
      if(pointInCircle(point.x, point.y, GLOBAL.mouse.x, GLOBAL.mouse.y,GLOBAL.mouse.radius)){        
        GLOBAL.changed = true;
        if(point.y > GLOBAL.mouse.y){
          point.y +=1;
        }
        else{
          point.y -=1;
        }
      };
      //if(point.y < window.innerHeight/2){
      //  point.y -= .981;
      //}else{
        //point.y += .981;
      //}
      
      c.fillRect(point.x,point.y,1,1);
    });
  // STOP IT
}

window.onresize = function(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  GLOBAL.data = generate_starting_points();
 
}


//____________________________________________
window.AudioContext = window.AudioContext||window.webkitAudioContext;
    context = new AudioContext();

function sound_by_array(array){
  var buffer,source,sound;
  // Caution! Nested!
  buffer = createBuffer(array,function(buffer){
    source = createSource(buffer,function(source){
      sound = startSound(source);
    });
  });
  
  GLOBAL.current = {
    buffer : buffer,
    source : source,
    sound : sound
  }
  return true;
}


function createBuffer(array,cb) {
  var buffer_max = 44100;
  var array_in_buffer_count = Math.floor(Math.abs(buffer_max / array.length));
  var current_buffer_size = array_in_buffer_count * array.length;
  var buffer = context.createBuffer(1, current_buffer_size, current_buffer_size);
  var data = buffer.getChannelData(0);
  var index = 0;
  var internal_counter = 0;
  
  console.log(array_in_buffer_count,current_buffer_size)
    for(j=0;j<array_in_buffer_count;j++){  
      for (i = 0; i < array.length; i++) {
          data[index] = array[internal_counter].y * .005;
        if(index%16*array_in_buffer_count === 0){
          internal_counter++;
        }
        
        index++;
      }
    }
  
  if(typeof cb !== "undefined"){
    cb(buffer);
  }
  return buffer;
}

function createSource(buffer,cb){
  // Create source node
  var source = context.createBufferSource();
  source.loop = true; 
  source.buffer = buffer;
  source.connect(context.destination);  
  cb(source);
  return source;
}
function startSound(source){
  source.start(0);
}

function stopSound(obj){
  obj.source.stop(0);
  obj.source.playbackRate += .1;
  obj = null;
}

document.body.addEventListener('mousedown',function(event){
  GLOBAL.mouse.down = true;
});
document.body.addEventListener('mouseup',function(event){
  GLOBAL.mouse.down = false;
});
document.body.addEventListener('mousemove',function(event){
  GLOBAL.mouse.x = event.pageX;
  GLOBAL.mouse.y = event.pageY;
});


//____________________________________________

function animate(time) {

    requestAnimationFrame(animate);
  //if(time.toFixed(0)%GLOBAL.real_density == 0){
    if(!GLOBAL.action){
      draw(time);
    }
    else{
      fall(time);
    }
  //}
  
  // THIS CODE IS CALLED EVERY 1 SEK
    GLOBAL.now = Date.now();
    GLOBAL.elapsed = GLOBAL.now - GLOBAL.then;
    if (GLOBAL.elapsed > GLOBAL.timestep) {
      GLOBAL.then = GLOBAL.now - (GLOBAL.elapsed % GLOBAL.timestep);
      if(GLOBAL.changed){
        stopSound(GLOBAL.current);
        //RESTART WITH NEW BUFFER
        sound_by_array(GLOBAL.data);
      }
    }        
}



animate(time);