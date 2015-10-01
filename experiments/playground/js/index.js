//_________________________________ Editor
var formel = '';
var input_ = document.getElementById('code');
var editor = CodeMirror.fromTextArea(input_,{
    lineNumbers: true,
    mode : 'javascript',
    theme :'monokai',
    lineWrapping: true,
  readOnly : false
  });

editor.on("change", function(cm, change){
  var value = String(cm.getValue());
      value = value.replace(/\r?\n|\r/g,'').trim();
      å.options = eval(value);
});
editor.setSize(window.innerWidth, window.innerHeight);

//_________________________________ START !
var canvas,c,å,time,options,i=0;

var ui = {
  menu : true,  
  code : true
}

var reset_button = document.getElementById('reset');

reset_button.addEventListener('click',function(){
  switch_gravity();
  switch_gravity();
},false)

function switch_gravity(){
  å.gravity = !å.gravity;
  if(!å.gravity){
    å.points = å.generate(å.options);
    å.points[i].x = å.points[i].start.x;
    å.points[i].y = å.points[i].start.y;
    å.floor_points = floor_pointer(å.size.y.min);
    å.gravity = false;
  }
}

//_________________________________ START !

init(time);
animation(time);
//_________________________________ INIT
function init(time){
  time = 0;
  options = {
      gravity : {
        bool : 0,
        strength : 5
      },
      start : {
        x : function(i){
          return Math.sin(.2*i) * 20;
        },
        y : function(i){
          return Math.cos(.5*i)* 20;
        },
      },
      tick : {
        x : function(i){
         return Math.sin(.0005*i)
        },
        y : function(i){
         return Math.cos(.0005*i)
        }
      },
    speed : {
      x : function(i){
        return 1;
      },
      y : function(i){
        return 1;
      },
    },
    bottom : false
  }
  
  function Å() {
    var that = this;
    this.string = '';
    this.size = {
      x : {
        min : window.innerWidth/2 - 100,
        max : window.innerWidth/2 + 100
      },
      y : {
        min : window.innerHeight/2 - 100,
        max : window.innerHeight/2 + 100
      },
      update : function(){
        that.size.x.min = window.innerWidth/2 - 100;
        that.size.x.max = window.innerWidth/2 + 100;
        
        that.size.y.min = window.innerHeight/2 - 100;
        that.size.y.max = window.innerHeight/2 + 100;
      }
    };
    
    
    this.is_currently_changing = false;
    this.floor = this.size.y.min;
    this.resolution = 1000;
    this.options = options;
    this.gravity_fac = 5;
    
    this.mouse = {
      x : 0,
      y : 0
    };
    this.floor_points = floor_pointer(this.floor);
    this.generate = function(opt){
      var POINTS_ = [];
      var x_,y_;
      for(var i = 0;i<this.resolution;i++){
        x_ = window.innerWidth/2;
        y_ = window.innerHeight/2;
        POINTS_[i] = {
          x: x_ + opt.start.x(i),
          y: y_ + opt.start.y(i),
          start : {
            x : x_ + opt.start.x(i),
            y : x_ + opt.start.y(i)
          },
          direction : {
            x : 1,
            y : 1
          },
          speed : {
            x : opt.speed.x,
            y : opt.speed.y
          },
          bottom : false,
          floor : this.floor
        }
      }
      return POINTS_;
    }
    this.points = this.generate(this.options);
  }
  å = new Å();
//_______ Canvas -> canvas
  canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  document.body.appendChild(canvas);

//_______ Context -> c
  c = canvas.getContext('2d');  
//_________________________________
  var bounding = document.createElement('div');
      bounding.id = "bounding";
      bounding.style.width = å.size.x.max-å.size.x.min + 'px';
      bounding.style.height = å.size.y.max-å.size.y.min + 'px';
      document.body.appendChild(bounding);
//_________________________________
  
var close = document.getElementById('close');
var code_button = document.getElementById('code_button');
  
  close.addEventListener('click',function(event){
    ui.menu = !ui.menu;
    if(!ui.menu){
      this.innerHTML = '+';
      document.body.setAttribute('class','menu-closed');
    }
    else{
      this.innerHTML = 'x';
      removeClass(document.body, 'menu-closed');
    }
  },false);
  
  code_button.addEventListener('click',function(event){
    ui.code = !ui.code;
    if(!ui.code){
      document.body.setAttribute('class','code-closed');
    }
    else{
      removeClass(document.body, 'code-closed');
    }
  },false);
  
    return å;
}
/// end of init


//_________________________________ Draw
function draw(time){
  c.clearRect(0,0,window.innerWidth,window.innerHeight);
  var gravity_check = 0;
    if(å.options.gravity.bool == true){
      å.gravity = true;
      å.gravity_fac = å.options.gravity.strength;
    }
    else{
      if(å.gravity===true){
        for(var i=0;i<å.resolution;i++){
          å.points[i].bottom= false;
          å.points[i].floor = å.floor;
        }
        å.floor_points = floor_pointer(å.floor)
      }
      å.gravity = false;
    }
  for(var i=0;i<å.resolution;i++){
    var x = å.options.tick.x(i);
    var y = å.options.tick.y(i);
    
    ///_____________ Draw
    if(!å.gravity){
      å.points[i].x += x * å.points[i].direction.x * å.options.speed.x(i);
      å.points[i].y += y * å.points[i].direction.y * å.options.speed.y(i);
      ///_____________ Switch direction if point hit boundaries
        if( å.points[i].x >= å.size.x.max ||
            å.points[i].x <= å.size.x.min){
            å.points[i].direction.x *= (-1);
        }    
        if( å.points[i].y >= å.size.y.max ||
            å.points[i].y <= å.size.y.min){
            å.points[i].direction.y *= (-1);
        }
      
         
    }
    ///_____________ Gravity
    else{
      if(!å.points[i].bottom){
        å.points[i].y += å.gravity_fac;
        å.points[i].x += 0;
        var x__ = å.points[i].x.toFixed(0);
        
        if(å.points[i].y >= å.floor_points[x__]){
            å.points[i].y = å.floor_points[x__];
            å.floor_points[x__]--;
            å.points[i].bottom = true;
        }
      }
    }
    c.fillRect(å.points[i].x,å.points[i].y,1,1);
  }
}
/// end of draw

//_________________________________ Runtime

function animation(time){
  requestAnimationFrame(animation);
  draw(time);
}

//_________________________________ HELPER FCTs

// Check of point is in radius
function pointInCircle(x, y, cx, cy, radius) {
  var distsq = (x - cx) * (x - cx) + (y - cy) * (y - cy);
  return distsq <= radius * radius;
}


function rand_Num(min,max,bool){
  var num = Math.floor(Math.random()*max) + min; // this will get a number between 1 and 99;
  if(bool){
      num *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
  }
  return num;
}

function floor_pointer(floor){ 
  var floors = {}
  for(var i=0;i<window.innerWidth;i++){
    floors[i] = window.innerHeight - floor;
  }
  return floors;
}

function removeClass(node, cls) {
    if(node && node.className && node.className.indexOf(cls) >= 0) {
        var pattern = new RegExp('\\s*' + cls + '\\s*');
        node.className = node.className.replace(pattern, ' ');
    }
}

//_________________________________ Events
function resizer(){
  canvas.width= window.innerWidth;  
  canvas.height= window.innerHeight;
  å.size.update();
  å.floor_points = floor_pointer(å.floor);
  å.points = å.generate(å.options);
  editor.setSize(window.innerWidth,window.innerHeight);
}

function mousemover(event){
  å.mouse.x = event.pageX;
  å.mouse.y = event.pageY;
}

document.addEventListener('mousemove',mousemover,false);
window.onresize = resizer;