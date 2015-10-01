////////////////////////////////////////
var usr = {
  mouse: {
    x: window.innerWidth/2,
    y: window.innerHeight/2
  }
}
var r = 100;
var $info = $('.info');
var speed = 1;

var radius = 2 * Math.PI / r;
var winkel = 2 * Math.PI / r;//1 / 180 * Math.PI;

var last_x = window.innerWidth/2;
var last_y = window.innerHeight/2;
var tween_r = {
  radius: 100
};

var easing_type = ["Quadratic.In","Quadratic.Out","Quadratic.InOut","Cubic.In","Cubic.Out","Cubic.InOut","Quartic.In","Quartic.Out","Quartic.InOut","Quintic.In","Quintic.Out","Quintic.InOut","Sinusoidal.In","Sinusoidal.Out","Sinusoidal.InOut","Exponential.In","Exponential.Out","Exponential.InOut","Circular.In","Circular.Out","Circular.InOut","Elastic.In","Elastic.Out","Elastic.InOut","Back.In","Back.Out","Back.InOut","Bounce.In","Bounce.Out","Bounce.InOut"]
////////////////////////////////////////

var ctx = document.getElementById('ctx');
ctx.width = window.innerWidth;
ctx.height = window.innerHeight;
var c = ctx.getContext('2d');


////////////////////////////////////////
var FizzyText = function() {
  this.speed = 0.3;
};
var speed_meter;
window.onload = function() {
  var text = new FizzyText();
  var gui = new dat.GUI();
    	speed_meter = gui.add(text, 'speed', 0, 3).step(.01).listen();
  speed_meter.onChange(function(value) {
    speed = value;
  });
};

////////////////////////////////////////

function get_easing_type(){
var rand_ease = Math.floor(Math.random()*easing_type.length)+0;
  
var type_h = easing_type[rand_ease].split('.');
var type = TWEEN.Easing[type_h[0]][type_h[1]];
  FizzyText.easing = type_h[0]+'.'+type_h[1];
  console.log(type_h[0]+'.'+type_h[1]);
  $('.info').attr('data-type',type_h[0]+' '+type_h[1]);
	return type;
}

console.log(get_easing_type);

////////////////////////////////////////
function liner(x, y) {
  	c.beginPath();
    c.moveTo(x, y);
    c.lineTo(last_x, last_y);
    c.lineWidth = 1;
    c.strokeStyle = '#fff';
    c.stroke();
    last_x = x;
    last_y = y;
  }
  ////////////////////////////////////////
function p_x(r, rad) {
  var x = Math.cos(r) * rad.radius;
  return x;
};

function p_y(r, rad) {
  var y = Math.sin(r) * rad.radius;
  return y;
};
//////////////////////////////////
function circle(easing){
  c.fillStyle = 'rgba(29,31,32,1)'; 		  c.fillRect(0,0,window.innerWidth,window.innerHeight);
  TWEEN.removeAll();
  var duration = Math.floor(Math.random()*1000)+100;
	var start_r = {
  	radius : Math.floor(Math.random()*100)+10
	}
  var end_r = {
    radius : window.innerWidth * .4
  }
	tweener(tween_r,start_r,end_r,duration,easing);
}
////////////////////////////////////////
// TWEEN// TWEEN
function tweener(obj,st,en,duration,easing){
  var t = new TWEEN.Tween(obj)
    .to(st, duration)
  	.easing(easing);
	var t2 = new TWEEN.Tween(obj)
    .to(en, duration)
  	.easing(easing);
  //Loop
  t.chain(t2);
  t2.chain(t);
  //start();
  t.start();
}


////////////////////////////////////////
// Event
window.onresize = function() {
  ctx.width = window.innerWidth;
  ctx.height = window.innerHeight;
}

window.onmousedown = function(e) {
  
	circle(get_easing_type());
  
  $('body').addClass('active');
}

////////////////////////////////////////
var t = 0; //Time
function draw(time) {
c.fillStyle = 'rgba(29,31,32,0.05)'; c.fillRect(0,0,window.innerWidth,window.innerHeight);
    t+=speed;
    if (t > 360) {
      t = 0;
    }
    liner(p_x(t,tween_r) + usr.mouse.x, p_y(t, tween_r) + usr.mouse.y);
  TWEEN.update(time);
  }
  ////////////////////////////////////////
function animation(time) {
    requestAnimationFrame(animation);
    
    draw(time);
  }
  ////////////////////////////////////////