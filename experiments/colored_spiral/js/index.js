//__________________________________________ Setup

var ctx = document.createElement('canvas');
		ctx.width = window.innerWidth;
		ctx.height = window.innerHeight;
document.body.appendChild(ctx);

var c = ctx.getContext('2d');


//__________________________________________ CHOOSE TYPE
var easing_type = ["Quadratic.In","Quadratic.Out","Quadratic.InOut","Cubic.In","Cubic.Out","Cubic.InOut","Quartic.In","Quartic.Out","Quartic.InOut","Quintic.In","Quintic.Out","Quintic.InOut","Sinusoidal.In","Sinusoidal.Out","Sinusoidal.InOut","Exponential.In","Exponential.Out","Exponential.InOut","Circular.In","Circular.Out","Circular.InOut","Elastic.In","Elastic.Out","Elastic.InOut","Back.In","Back.Out","Back.InOut","Bounce.In","Bounce.Out","Bounce.InOut"]

function get_easing_type(){
var rand_ease = Math.floor(Math.random()*easing_type.length)+0;
  
var type_h = easing_type[rand_ease].split('.');
var type = TWEEN.Easing[type_h[0]][type_h[1]];
  //FizzyText.easing = type_h[0]+'.'+type_h[1];
  console.log(type_h[0]+'.'+type_h[1]);
  jQuery('.info').attr('data-type',type_h[0]+' '+type_h[1]);
	return type;
}
//__________________________________________ COLORS

function generateColorinRange(color){
    var h = color; // Hue
    var s = 100; // Saturation
    var b = 50; // Brightness
//hsla(120, 100%, 50%, 0.3);
    return 'hsla('+h+','+s+'%,'+b+'%,1)';
}

//__________________________________________ OBJECTS
var spiral_opt = {
		centerx : window.innerWidth/2,
    centery : window.innerHeight/2,
    a : 1,
    b : 1,
	  angle : 0.1,
  easing : 'Ease.In',
  duration:10000,
  length : 720,
  random:50,
  color:10
}
var spiral_anim_start= {
    a : 1,
    b : 1,
	  angle : 0.1,
  length : 1000,
  random:10,
  color:20
}
var spiral_anim_end = {
    a : 20,
    b : 20,
	  angle : .1,
  length : 200,
  random:0,
  color:350
}

function spiral(obj){
  c.moveTo(obj.centerx, obj.centery);
  c.beginPath();
  c.strokeStyle = generateColorinRange(obj.color);
    for (i = 0; i < obj.length; i++) {
        angle = obj.angle * i;
        x = obj.centerx + (obj.a + obj.b * angle) * Math.cos(angle) + Math.random()*obj.random;
        y = obj.centery + (obj.a + obj.b * angle) * Math.sin(angle)+Math.random()*obj.random;
        c.lineTo(x, y);
    }
   c.stroke();
  
  c.beginPath();
    for (i = 0; i < obj.length; i++) {
        angle = obj.angle * i;
        x = obj.centerx + (obj.a + obj.b * angle) * Math.cos(angle) + Math.random()*obj.random;
        y = obj.centery + (obj.a + obj.b * angle) * Math.sin(angle)+Math.random()*obj.random;
        c.lineTo(x+1, y+1);
    }
  	c.strokeStyle = 'rgba(0,0,0,.25)';
   c.stroke();
  
}


//____________________________________________ Events

window.onmousemove = function(e){
  spiral_opt.centerx = e.pageX;
  spiral_opt.centery = e.pageY;
}

window.onmousedown = function(e) {
  console.log(get_easing_type());
}

window.onresize = function(e){
  ctx.width = window.innerWidth;
  ctx.height = window.innerHeight;
}
//__________________________________________ TWEEN SETUP

  var t = new TWEEN.Tween(spiral_opt)
    .to(spiral_anim_start, spiral_opt.duration)
  	.easing(get_easing_type());
	var t2 = new TWEEN.Tween(spiral_opt)
    .to(spiral_anim_end, spiral_opt.duration)
  	.easing(get_easing_type());
  //Loop
  t.chain(t2);
  t2.chain(t);
  //start();
  t.start();
//____________________________________________ Animate
function draw(time){
  c.fillStyle = 'rgba(29,31,32,.03)';
  c.fillRect(0,0,window.innerWidth,window.innerHeight);
  spiral(spiral_opt);
  TWEEN.update(time);
}

//____________________________________________ Animate
function animate(time){
  requestAnimationFrame(animate);
  draw(time);
}

animate();