//_________________________________________Setup
var ctx = document.createElement('canvas');
		ctx.width = window.innerWidth;
		ctx.height = window.innerHeight;
		
		//append
		document.body.appendChild(ctx);

var c = ctx.getContext('2d');
//_________________________________________Variables

var usr = {
  win : {
    x : window.innerWidth,
    y : window.innerHeight
  },
  mouse : {
    x : window.innerWidth/2,
		y : window.innerHeight/2
  },
  size : {
    x : 1,
    y : 1
  },
  velocity : {
    x : 10,
    y : 10
  }
}

//_________________________________________Helper

function get_point(i,opt){
  var radWinkel = i / 180 * Math.PI;
  
  var x = Math.cos( radWinkel ) * opt.velocity.x;
  var y = Math.sin( radWinkel ) * opt.velocity.y;

  return [x,y];
}
var raster = [];
var point = 0;
for(i=0;i<window.innerWidth;i++){
    for(j=0;j<window.innerHeight;j++){
      point++;
      raster.push([i,j]);
    }
  }


function circler(x,y){
  c.fillStyle = 'rgba(29,31,32,1)';
  c.beginPath();
  c.arc(x,y,50,0,2*Math.PI);
  c.fill();
}

function p_x(r, rad) {
  var x = Math.cos(r) * rad;
  return x;
};

function p_y(r, rad) {
  var y = Math.sin(r) * rad;
  return y;
};

function generateColorinRange(color){
    var h = color; // Hue
    var s = 100; // Saturation
    var b = 50; // Brightness
//hsla(120, 100%, 50%, 0.3);
    return 'hsla('+h+','+s+'%,'+b+'%,1)';
}

/***********************************************/
// Check of point is in radius
function pointInCircle(x, y, cx, cy, radius) {
  var distsq = (x - cx) * (x - cx) + (y - cy) * (y - cy);
  return distsq <= radius * radius;
}
//_________________________________________Draw
var t = 0;
var spread = {
  spreader : 10,//distance for hovered points
  resolution : 500,// How many Points on Canvas
  color:100,// BG Color Change Range
  size : 10,// Cursor Radius
  p_size : 1//Particle Background Size
}

function draw(time){
  
  t++;if(t<360){t=0;}
  c.fillStyle = 'rgba(29,31,32,1)'; 
  c.fillRect(0,0,window.innerWidth,window.innerHeight);
  //circler(usr.mouse.x,usr.mouse.y);
  c.fillStyle = '#fff';
  
  for(i=0;i<raster.length;i++){
    if(i%spread.resolution=== 0){
      
      var base = raster[i];
      var distance = pointInCircle(usr.mouse.x, usr.mouse.y,base[0] , base[1], spread.size);
      //console.log(distance);
      if(distance){
        var rnd_num = Math.floor(Math.random()*spread.spreader)-spread.spreader;
        c.fillStyle = generateColorinRange(Math.floor(Math.random()*40)+10);
        c.fillRect(base[0],spread.spreader+base[1]+rnd_num,5,5);
      }
      else{
        c.fillStyle =  generateColorinRange(spread.color);
        c.fillRect(base[0],base[1],spread.p_size,spread.p_size);
      }
  		
    }
  }
  
}
//_________________________________________Tween
function tweener(obj,st,en,duration){
  
  var t = new TWEEN.Tween(obj)
    .to(st, duration)
  	.easing(TWEEN.Easing.Quadratic.In);
	var t2 = new TWEEN.Tween(obj)
    .to(en, duration)
  	.easing(TWEEN.Easing.Quadratic.Out);
  //Loop
  t.chain(t2);
  t2.chain(t);
  //start();
  t.start();
}
/***********************************************/
//________________________________________Options
var s_size = {
  spreader :10, //distance for hovered points
  resolution : 30, // How many Points on Canvas
  color:200, // BG Color Change Range
  size : 10, // Cursor Radius
  p_size : 2 //Particle Background Size
}

var e_size = {
  spreader : 20,
	resolution : 30,
  color:250,
  size : 100,
  p_size : 1 
}
/***********************************************/
tweener(spread,s_size,e_size,1000);

//_________________________________________Event

window.onresize = function(){
  ctx.width = window.innerWidth;
  ctx.height = window.innerHeight;
  raster = [];
  point = 0;
  for(i=0;i<window.innerWidth;i++){
      for(j=0;j<window.innerHeight;j++){
        point++;
        raster.push([i,j]);
      }
    }
}

window.onmousemove = function(e){
  usr.mouse.x = e.pageX;
  usr.mouse.y = e.pageY;
  
}

//_________________________________________Animate
function animation(time){
  requestAnimationFrame(animation);
  TWEEN.update();
	draw(time);
}

animation();