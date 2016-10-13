function normalizeVec(vec){
  var d = Math.sqrt( (vec.x * vec.x) + (vec.y * vec.y) );

  var dx = vec.x / d;
  var dy = vec.y / d;

  return {
    x : dx, 
    y : dy
  }
}

function normalize(floater){
  var d = Math.sqrt( (floater * floater) );

  var dfloater = floater / d;

  return dfloater;
}


function getCoor(a,b,t){
  var x = Math.sin(0.008 * a - (opt.mouse.pos.x*.005) + t * 2 ) ;
  var y = Math.cos(0.008 * b - (opt.mouse.pos.y*.005) + t * 2 ) ;

  return {
    x : x,
    y : y
  }
}

//______________________________________________ Variables
var stage = {
  x : window.innerWidth * window.devicePixelRatio,
  y : window.innerHeight * window.devicePixelRatio
}

var canvas = document.createElement('canvas');
canvas.width = stage.x;
canvas.height = stage.y;
document.body.appendChild(canvas);

var c = canvas.getContext("2d");
    c.fillStyle = '#aaa';
    c.strokeStyle = '#fff';

var grid = [];
var opt = {
  index : 0,
  count : 25,
  mouse : {
    start : {
      x : 0,
      y : 0,
    },
    delta : {
      x : 0,
      y : 0
    },
    pos : {
      x : 0,
      y : 0
    },
    down : false
  }
}


for(var x = 0; x < Math.floor(stage.x / opt.count) + 1; x++){
  for(var y = 0; y < Math.floor(stage.y / opt.count) + 1; y++){
    grid.push({
      x : x * opt.count,
      y : y * opt.count,
      vel : {
        x : 0,
        y : 0
      }
    });
  }
}

//______________________________________________ draw

function draw(time){
  var i = 0;
  for(var x = 0;x < Math.floor(stage.x / opt.count) + 1;x++){
    for(var y = 0;y < Math.floor(stage.y / opt.count) + 1;y++){
      var shiftedTime = i  + time;
      var timeFactor = shiftedTime / 6000 % Math.PI * 2;

      var point = getCoor( grid[i].x, grid[i].y , timeFactor);
      var pressureColor =  (Math.abs( point.x ) + Math.abs( point.y ) )* 120;
      
      c.strokeStyle = 'hsl(' + pressureColor + ',100%,50%)';
      grid[i].vel.x = point.x * 20;
      grid[i].vel.y = point.y * 20;

      c.beginPath();
      c.moveTo(grid[i].x,grid[i].y);
      c.lineTo(grid[i].x,grid[i].y);
      c.lineTo(grid[i].x + grid[i].vel.x  ,grid[i].y + grid[i].vel.y );
      c.stroke();
      c.closePath();
      i++;
    }
  }
}


//______________________________________________ events

document.body.addEventListener("mousedown",function(event){
  opt.mouse.down = true;
  opt.mouse.start.x = event.pageX;
  opt.mouse.start.y = event.pageY;
});

document.body.addEventListener("mousemove",function(event){
  opt.mouse.pos.x = event.pageX;
  opt.mouse.pos.y = event.pageY;

  if(opt.mouse.down){
    opt.mouse.delta.x = opt.mouse.pos.x - opt.mouse.start.x;
    opt.mouse.delta.y = opt.mouse.pos.y - opt.mouse.start.y;
  }
});

document.body.addEventListener("mouseup",function(event){
  opt.mouse.down = false;

  opt.mouse.delta.x = 0;
  opt.mouse.delta.y = 0; 
  
});

window.onresize = function() {
  stage.x = window.innerWidth*window.devicePixelRatio;
  stage.y = window.innerHeight*window.devicePixelRatio;
  grid = [];
  for(var x = 0; x < Math.floor(stage.x / opt.count) + 1; x++){
    for(var y = 0; y < Math.floor(stage.y / opt.count) + 1; y++){
      grid.push({
        x : x * opt.count,
        y : y * opt.count,
        vel : {
          x : 0,
          y : 0
        }
      });
    }
  }
}


//______________________________________________ render
var render = function (time) { 
  requestAnimationFrame( render );
  c.clearRect(0,0,stage.x,stage.y);

  draw(time);
};

render();