var canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.body.appendChild(canvas);

var c = canvas.getContext('2d');

//_______________________________________
var base = {
  x : 0,
  y : 0
}

var å = {
  mouse : {
    x : 0,
    y : 0,
    radius : 20
  },
  target : [
    {
      x : 0,
      y : 0,
      radius : window.innerWidth/2,
      speed : 500
    }
  ],
  grid : {
    x : Math.round(window.innerWidth/8),
    y : Math.round(window.innerHeight/8)
  },
  color : {
    in : '#fff',
    mid : '#fff',
    out : '#1e9af0'
  }
}
å.p = generate_points();

function generate_points(){
    var p = [];
  var counter = 0;
    for(var j=0;j<å.grid.y;j++){      
      for(var i=0;i<å.grid.x;i++){       
        p[counter] = {
          origin : {
            x : (window.innerWidth / å.grid.x) * i,
            y : (window.innerHeight / å.grid.y) * j,
          },
          x : (window.innerWidth / å.grid.x) * i,
          y : (window.innerHeight / å.grid.y) * j,
          vel : {
            x : 1,
            y : 1
          },
          trail : {
            x : .02,
            y : .02
          },
          dist : {
            x : 0,
            y : 0
          },
          speed : {
            in : {
              x : .75,
              y : .75
            },
            out : {
              x : .75,
              y : .75
            }
          },
          size : {
            x : 2,
            y : 2
          }
        }
        counter++;
      }
    }
    
    return p;
}



//_______________________________________

function draw(time){
  c.clearRect(0,0,window.innerWidth,window.innerHeight);
  
  // Paths Points
  for(var i=0;i<å.grid.x * å.grid.y;i++){ 
    
       for(var k =0;k<å.target.length;k++){
    
      if(pointInCircle(å.target[k].x, å.target[k].y, å.p[i].origin.x, å.p[i].origin.y, å.target[k].radius)){
        å.p[i].dist.x = 1-Math.abs(å.target[k].x-å.p[i].x) / å.target[k].radius;
        å.p[i].dist.y = 1-Math.abs(å.target[k].y-å.p[i].y) / å.target[k].radius;
        
        if(å.p[i].x > å.target[k].x){
           å.p[i].vel.x = -å.p[i].speed.in.x * å.p[i].dist.y;
        }
        else{
           å.p[i].vel.x = +å.p[i].speed.in.x * å.p[i].dist.y;
        }
        if(å.p[i].y > å.target[k].y){
           å.p[i].vel.y = -å.p[i].speed.in.y * å.p[i].dist.x;
        }
        else{
           å.p[i].vel.y = +å.p[i].speed.in.y * å.p[i].dist.x;
        }
        
        å.p[i].x += å.p[i].vel.x;
        å.p[i].y += å.p[i].vel.y;
        c.fillStyle = å.color.in;
      }
    else{
      å.p[i].dist.x = 1-Math.abs(å.target[k].x-å.p[i].x) / å.target[k].radius;
      å.p[i].dist.y = 1-Math.abs(å.target[k].y-å.p[i].y) / å.target[k].radius;
      
      if(å.p[i].x > å.p[i].origin.x){        
        å.p[i].x -= (å.p[i].x - å.p[i].origin.x)/ å.target[k].radius * å.p[i].speed.out.x;
      }
      else{
        å.p[i].x += (å.p[i].origin.x - å.p[i].x )/ å.target[k].radius * å.p[i].speed.out.x;
      }
      if(å.p[i].y > å.p[i].origin.y){
        å.p[i].y -= (å.p[i].y - å.p[i].origin.y)/ å.target[k].radius * å.p[i].speed.out.y;
      }
      else{
        å.p[i].y += (å.p[i].origin.y - å.p[i].y )/ å.target[k].radius * å.p[i].speed.out.y;
      }
      
      
      
      if(Math.abs(å.p[i].origin.x - å.p[i].x ) < å.p[i].trail.x && Math.abs(å.p[i].y - å.p[i].origin.y) <  å.p[i].trail.y){
        c.fillStyle = å.color.out;
      }
      else{
        c.fillStyle = å.color.mid;
      }
     
    }
    
        c.fillRect(å.p[i].x - å.p[i].size.x/2,å.p[i].y-å.p[i].size.y/2,å.p[i].size.x,å.p[i].size.y);
         
  }
     
  }
  
  
}
//_______________________________________
var time = 0;
function animate(time){
  requestAnimationFrame(animate);
  å.target[0].x = window.innerWidth/2 + Math.sin(time / å.target[0].speed)*å.target[0].radius * .5;
  
  å.target[0].y = window.innerHeight/2 + Math.cos(time / å.target[0].speed)*å.target[0].radius * .5;
  
  draw(time);
}

animate(time);
//_______________________________________

window.onresize = function(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  å.grid.x = Math.round(window.innerWidth/10);
  å.grid.y = Math.round(window.innerWidth/10);
  å.p = generate_points();
}

document.addEventListener('mousemove',function(event){
  å.mouse.x  = event.pageX;
  å.mouse.y  = event.pageY;  
});


//_______________________________________ HELPER
// Check of point is in radius
function pointInCircle(x, y, cx, cy, radius) {
  var distsq = (x - cx) * (x - cx) + (y - cy) * (y - cy);
  return distsq <= radius * radius;
}