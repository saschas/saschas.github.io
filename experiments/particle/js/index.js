/*options = 
};*/
//_________________________________ START !
var canvas,c,å,time,options,i=0;
//_________________________________ START !

init(time);
animation(time);
//_________________________________ INIT
function init(time){
  time = 0;
  options = {
      start : {
        x : 2,
        y : 2,
      },
      tick : {
        x : function(i){
         return Math.sin(.5*i)
        },
        y : function(i){
         return Math.cos(.5*i)
        }
      },
    speed : {
      x : function(i){
        return 5;//Math.sin(.2*i*i);
      },
      y : function(i){
        return 5//Math.cos(.2*i*i);
      }
    }
  }
  
  function Å() {
    this.size = {
      x : 100,
      y : 100
    };
    this.resolution = 5000;
    this.formel = options;
    this.mouse = {
      x : 0,
      y : 0
    }
    this.generate = function(opt){
      var POINTS_ = [];
      var x_,y_;
      for(var i = 0;i<this.resolution;i++){
        x_ = window.innerWidth/2 + 0;
        y_ = window.innerHeight/2 + 0;
        POINTS_[i] = {
          x: x_ + opt.start.x,
          y: y_ + opt.start.y,
          direction : {
            x : 1,
            y : 1
          },
          speed : {
            x : opt.speed.x,
            y : opt.speed.y
          },
        }
      }
      return POINTS_;
    }
    this.points = this.generate(this.formel);
    
    this.update_formel = function(formel){
      var options;
      if(typeof formel === "string"){
          options = eval(formel.replace(' ',''));
          this.update_points(options);
          return options;
      }
      else{
        return formel;
      }
      
    };
    this.update_points = function(formel_string){
      options = this.update_formel(formel_string);
      this.points = this.generate(options);
    };
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
    
    return å;
}
/// end of init




//_________________________________ Draw
function draw(time){  c.clearRect(0,0,window.innerWidth,window.innerHeight);
  for(var i=0;i<å.resolution;i++){
    var x_ = window.innerWidth/2;  
    var y_ = window.innerHeight/2;

    var x = å.formel.tick.x(i);
    var y = å.formel.tick.y(i);
    
    å.points[i].x += x * å.points[i].direction.x * å.points[i].speed.x(i);
    å.points[i].y += y * å.points[i].direction.y * å.points[i].speed.y(i);
    
      if( å.points[i].x > x_+å.size.x ||
          å.points[i].x < x_-å.size.x){
          å.points[i].direction.x *= (-1);
      }
    
      if( å.points[i].y > y_+å.size.y ||
          å.points[i].y < y_-å.size.y){
          å.points[i].direction.y *= (-1);
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
//_________________________________ Events
function resizer(){
  canvas.width= window.innerWidth;  
  canvas.height= window.innerHeight;
}

function mousemover(){
  å.mouse
}


window.onresize = resizer;
//_________________________________ HELPER FCTs