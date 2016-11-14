/*
	Mandala
*/
try {
    var isFileSaverSupported = !!new Blob;
} catch (e) {}

var time = 0;
var stage = {
  x : window.innerWidth,
  y : window.innerHeight,
  dpr : window.devicePixelRatio
}

stage.x = stage.x < stage.y ? stage.x : stage.y;
stage.y = stage.y < stage.x ? stage.y : stage.x;


var bgCanvasElement = document.createElement('canvas');
var bgCanvas = bgCanvasElement.getContext('2d');
    bgCanvasElement.style.display = 'none';
document.body.appendChild(bgCanvasElement);


var mouse = {
  x : 0,
  y : 0,
  active : false,
  currentShape : [],
  ui : false,
}
var shapes = [];

var canvas = document.createElement('canvas');
    bgCanvasElement.width  = canvas.width = stage.x * stage.dpr;
    bgCanvasElement.height = canvas.height = stage.y * stage.dpr;

document.body.appendChild(canvas);


var c = canvas.getContext('2d');
var MandalaOptions = function() {
  this.sliceFactor = 6;
  this.slices = Math.pow(2,this.sliceFactor);
  this.drawColor = '#ffffff';
  this.backgroundColor = '#333333';
  this.thickness = 1;
  this.grid = false;
  this.center = true;
  this.transparentBG = true;
  this.clear = function(){
    shapes = [];
  };
  this.saveAsPNG = function(){
    c.clearRect(0,0,stage.x * stage.dpr, stage.y * stage.dpr);
      drawMandala(time);
      drawKaleido();
      bgCanvas.drawImage(canvas,0,0);
    bgCanvasElement.toBlob(function(blob) {
      saveAs(blob, "my_personal_mandala.png");
    });
  }
};

  var mandala = new MandalaOptions();
  var gui = new dat.GUI();
      gui.add(mandala, 'sliceFactor',1,8).onChange(function(value){
        this.object.slices = Math.pow(2,Math.floor( value));
      }).step(1);
      gui.add(mandala, 'grid');
      gui.add(mandala, 'center');
      gui.add(mandala, 'thickness', 1, 50).step(1);
      gui.add(mandala, 'transparentBG').onChange(function (value) {
        if(value){
          bgCanvas.clearRect(0,0,stage.x * stage.dpr, stage.y * stage.dpr);
        }else{
            bgCanvas.beginPath();
            bgCanvas.arc(stage.x * stage.dpr / 2,stage.y * stage.dpr / 2,stage.x, 0, Math.PI * 2 );
            bgCanvas.clip();
            bgCanvas.closePath();
            bgCanvas.fillStyle = mandala.backgroundColor;
            bgCanvas.fillRect(0,0,stage.x*stage.dpr,stage.y*stage.dpr);
        }
      });
      gui.addColor(mandala, 'backgroundColor').onChange(function(value){
        bgCanvas.fillStyle = mandala.backgroundColor;
        bgCanvas.fillRect(0,0,stage.x*stage.dpr,stage.y*stage.dpr);
        document.body.style.backgroundColor = value;
      });
      gui.addColor(mandala, 'drawColor');
      gui.add(mandala, 'clear');
      gui.add(mandala, 'saveAsPNG');

      gui.close();

    //set initial bg color
    document.body.style.backgroundColor = mandala.backgroundColor;
  
    //set initial bg color for bg canvas
    bgCanvas.beginPath();
    bgCanvas.arc(stage.x * stage.dpr / 2,stage.y * stage.dpr / 2,stage.x, 0, Math.PI * 2 );
    bgCanvas.clip();
    bgCanvas.closePath();
    if(!mandala.transparentBG){
      bgCanvas.fillStyle = mandala.backgroundColor;
      bgCanvas.fillRect(0,0,stage.x*stage.dpr,stage.y*stage.dpr);
    }

function drawStroker(pos,deg,rad){

  var x = Math.sin( deg * Math.PI / 180) * rad;
  var y = Math.cos( deg * Math.PI / 180) * rad;
    c.moveTo(pos.x,pos.y);
    c.lineTo(pos.x,pos.y);
    c.lineTo(pos.x + x,pos.y + y);
    c.stroke();
}



//__________ animation

function drawKaleido(){
  var index = 0;
  for(var i=0;i < Math.ceil(Math.sqrt(mandala.slices));i++){
    index = ((i) == 0) ? 1 : Math.pow( 2 , i);
    c.save();
        c.translate(stage.x * stage.dpr / 2, stage.y * stage.dpr / 2);
        c.rotate(((360 / mandala.slices) * index * Math.PI / 180));
        c.translate(-stage.x * stage.dpr / 2, -stage.y * stage.dpr / 2);
        c.drawImage(canvas, 0,0);
    c.restore();
  }
}


function drawHelper(){
  c.strokeStyle = '#eee';
  c.lineWidth = 1;
  for(var l=0;l< mandala.slices;l++){
    c.beginPath();
    drawStroker({
      x : stage.x * stage.dpr / 2,
      y : stage.y * stage.dpr / 2
    },l * (360 / mandala.slices), stage.y * stage.x);
    c.closePath();
  }
}

function drawMandala(time){
  c.strokeStyle = '#000';

  if(mouse.currentShape.length > 1){
    c.beginPath();

    c.strokeStyle = mouse.currentShape[0].color;
    c.lineWidth = mouse.currentShape[0].thickness;

      for(var s=1;s< mouse.currentShape.length;s++){
        if(s == 1){
          c.moveTo(mouse.currentShape[s].x,mouse.currentShape[s].y);
        }
        c.lineTo(mouse.currentShape[s].x,mouse.currentShape[s].y);
      }
    c.stroke();
    c.closePath();
  }

  shapes.forEach(function (s,index) {
    c.beginPath();
    s.forEach(function(stroke,i){      
        c.strokeStyle = s[0].color;
        c.lineWidth = s[0].thickness;
        c.lineTo(stroke.x,stroke.y);
    });
    c.stroke();
    c.closePath();
  });

};


function mousemove(event){
  mouse.x = (event.clientX - canvas.offsetLeft) * stage.dpr;
  mouse.y = (event.clientY - canvas.offsetTop) * stage.dpr;

  if(mouse.active){
    mouse.currentShape.push({
      x : mouse.x,
      y : mouse.y
    });
  }
}

function touchmove(event){
  event.preventDefault();
  if(event.touches.length > 0){
    mouse.x = (event.touches[0].clientX - canvas.offsetLeft) * stage.dpr;
    mouse.y = (event.touches[0].clientY - canvas.offsetTop) * stage.dpr;

    if(mouse.active){
      mouse.currentShape.push({
        x : mouse.x,
        y : mouse.y
      });
    }
  }
}
function mouseup(event){
  mouse.active = false;
  shapes.push(mouse.currentShape);
}

function mousedown(event){
  mouse.ui = (event.target.nodeName === "CANVAS") ? false : true;
  
  mouse.active = mouse.ui ? false: true;
  mouse.currentShape = [{
    color : mandala.drawColor,
    thickness : mandala.thickness
  }];
}


window.addEventListener('mousemove',mousemove);
window.addEventListener('touchmove',touchmove);

window.addEventListener('touchstart',mousedown);
window.addEventListener('mousedown',mousedown);

window.addEventListener('touchend',mouseup);
window.addEventListener('mouseup',mouseup);


window.onresize = function(){
  stage.x = window.innerWidth;
  stage.y = window.innerHeight;
  stage.x = stage.x < stage.y ? stage.x : stage.y;
  stage.y = stage.y < stage.x ? stage.y : stage.x;

  bgCanvasElement.width  = canvas.width = stage.x * stage.dpr;
  bgCanvasElement.height = canvas.height = stage.y * stage.dpr;
}

//__________ render
var render = function (time) { 
  requestAnimationFrame( render );
    c.clearRect(0,0,stage.x * stage.dpr, stage.y * stage.dpr);
    
      drawMandala(time);
      drawKaleido();

    if(mandala.grid){
      drawHelper();
    }
    if(mandala.center){
      c.fillStyle = '#fff';
      c.fillRect(stage.x *stage.dpr / 2 - (1 * stage.dpr / 2), stage.y * stage.dpr / 2 - (1 * stage.dpr / 2), 1 * stage.dpr,1 * stage.dpr);
    }
};

//__________
render(time);