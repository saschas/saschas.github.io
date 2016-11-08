
var canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
document.body.appendChild(canvas);

var c = canvas.getContext("2d");

var pCloud = new PointCloud(canvas,{
	count : 100
});

function loop(){
  requestAnimationFrame(loop);

  pCloud.update();

}

window.onresize = function(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	pCloud.resize();
}

loop();