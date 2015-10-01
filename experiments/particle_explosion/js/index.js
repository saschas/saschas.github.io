var $stage = $('.stage-content');
var counter = 0;
var colors = ['#ecd078','#d95b43','#c02942','#542437','#53777a'];
var count = {
  x : ($stage.width()/100).toFixed(0),
  y : ($stage.height()/100).toFixed(0),
  size : 40,
  velocity : 10,
  spread : 20
}

var play = true;
var c_pos = null;

//_____________________________________
function resizer(ctx) {
  ctx.width = $stage.width();
  ctx.height = $stage.height();
  count.x = (ctx.width/count.size).toFixed(0);
  count.y = (ctx.height/count.size).toFixed(0);
}
//_____________________________________ Setup canvas
var ctx = document.createElement('canvas');
    resizer(ctx);

$stage.append(ctx);
var c = ctx.getContext('2d');

//_____________________________________ Setup Button

var $stop = $('.action');

$stop.click(function(){
  
});


function velocity(obj){
  var array_ = [];
  for(var i=0;i<counter;i++){
    var rnd = Math.random()*obj.velocity;
    var siner = Math.sin(rnd)*obj.velocity;
    array_.push(siner);
  }
  return array_;
}
//_____________________________________ Draw
var max = 0;
function manipulate_pos(obj,time) {
  var index = 0;
  var color_code = obj.colors;
  var pos = obj.positions;
  var vel = obj.vel;
  
  draw_option = true;
    for(var i=count.x+1;i>0;i--){
      for(var j=count.y+1;j>0;j--){
        var p_type = color_code[index];
        var p_pos = pos[index];
        var vel_ = vel[index];
            p_pos.y += Math.random()*count.spread;
            p_pos.x += vel_;
            
        
        if(draw_option){
          c.fillStyle = colors[p_type];
          c.fillRect(p_pos.x,p_pos.y,count.size,count.size);
        }
        index++;
      }
    }  
  }

//_____________________________________ Draw
function lorem_pixel(){
  counter = 0;
  var color_pos = [];
  var pos = [];
  for(var i=0;i<count.x+1;i++){
    for(var j=0;j<count.y+1;j++){
      var rnd = (Math.random()*(colors.length-1)).toFixed(0);
      c.fillStyle = colors[rnd];
      var x_ = -count.size+(count.size*i);
      var y_ = -count.size+(count.size*j);
      c.fillRect(x_,y_,count.size,count.size);
      color_pos.push(rnd);
      pos.push({x:x_,y:y_});
      counter++;
    }
  }  
  return {colors:color_pos,positions:pos};
}


function draw(time) {
  
  var t = time.toFixed(0);
  
  if(play){
    if(t%3==0){
      c.clearRect(0,0,window.innerWidth,window.innerHeight);
      c_pos = lorem_pixel();
    }
  }
  if(!play){
    c.clearRect(0,0,window.innerWidth,window.innerHeight);
    manipulate_pos(c_pos,time);
  }
}


//_____________________________________ Events
var OptionsText = function() {
  this.cubeSize = 40;
  this.wiggle = 10;
  this.gravity = 10;
  this.start = kickOff;
};
function kickOff() { 
    play = !play;
    c_pos.vel = velocity(count);
    if(!play){
      $(this).text('regenerate');
      }
    else{
      $(this).text('start');
    }
  }

var explosion_time = 0;
setInterval(function(){
  if(explosion_time<3){
    kickOff();
  }
  explosion_time++
},2000);

var text = new OptionsText();
var gui = new dat.GUI();
var size_ = gui.add(text, 'cubeSize', 6, 150);
var x_ = gui.add(text, 'wiggle', -10, 10).step(1);
var y_ = gui.add(text, 'gravity', -20, 20).step(1);
         gui.add(text, 'start');
size_.onChange(function(value) {
  count.size = value;
});
x_.onChange(function(value) {
  count.velocity = value;
  c_pos.vel = velocity(count);
});
y_.onChange(function(value) {
  count.spread = value;
});

  
window.onresize = function(){
  resizer(ctx);
}

//_____________________________________ Animation
var time = 0;
function animation(time) {
  requestAnimationFrame(animation);
  draw(time);  
}

animation(time);