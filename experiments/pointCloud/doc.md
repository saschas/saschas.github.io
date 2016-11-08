#pointCloud

### Installation

```html

<!--element-->
<canvas id="canvasElement"></canvas>
<!--load script-->
<script src="pointCloud.min.js" type="text/javascript"></script>
```

```js

//Javascript

//get Canvas Element
var canvas = document.getElementById('canvasElement');

//initialization with options
var pointCloud = new PointCloud(canvas,{
	//how many Points at start
    count : 50,
	//checker radius for points 
    radius : 150,
	//mouse click add extra points
    mouseAdd : true,
	//how many points a click should add
    mouseAddPointCount : 5,
	//radius for each point
    circleRadius : 2,
	//clear context on tick
    autoClear : true,
	//draw circles for points
    drawCircle : true,
	//color of circles
    circleColor : '#666',
	//draw lines
    drawLines : true,
	//draw background
    drawBackground : true,
	//background color
    background : '#222',
	//speed of points
    speed : .5,
	//color for circles & lines (color for circles if circles == null)
    setLineColor : function(normalizedDistance){
      return 'hsl(' + (255 - (normalizedDistance * 255)) + ', 100%,50%)';
    }
  });

//Loop
function loop(){
  requestAnimationFrame(loop);

  //update pointCloud each frame
  pointCloud.update();

}

loop();
```

###Methods

####.generateCloud()
Generates a new PointCloud


####.generateSinglePoint(pos)
Adds a single Point to PointCloud. If `pos`(Object) is defined a point is spawned at position.

####.resize()
resize pointCloud

