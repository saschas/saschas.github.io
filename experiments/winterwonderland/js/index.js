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
  }
}

//_________________________________________Helper

function get_point(max){
  var rnd = Math.random() * max;
  return rnd;
}

function circler(x,y){
  c.fillStyle = 'rgba(29,31,32,1)';
  c.beginPath();
  c.arc(x,y,50,0,2*Math.PI);
  c.fill();
}



//_________________________________________Draw
function draw(){
  
  circler(usr.mouse.x,usr.mouse.y);
  for(i=0;i<100;i++){
	c.fillStyle = '#fff'; c.fillRect(get_point(usr.win.x),get_point(usr.win.y),1,1);
  }
  //c.beginPath();
  //c.lineTo(get_point(usr.win.x),get_point(usr.win.y));
  //c.lineTo(get_point(usr.win.x),get_point(usr.win.y));
  //c.stroke();
}


//_________________________________________Event

window.onresize = function(){
  ctx.width = window.innerWidth;
  ctx.height = window.innerHeight;
}

window.onmousemove = function(e){
  usr.mouse.x = e.pageX;
  usr.mouse.y = e.pageY;
}
//_________________________________________Animate
function animation(time){
  requestAnimationFrame(animation);
  TWEEN.update(time);
	draw(time);
}

animation();