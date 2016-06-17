function VRPointer(opt){
  this.midPoint = new THREE.Vector2(0,0);
  this.raycaster = new THREE.Raycaster();
  this.camera = opt.camera;
  this.scene = opt.scene;
  this.distanceFromCamera = opt.distanceFromCamera ? opt.distanceFromCamera : 50;
  this.color = opt.color ? opt.color : '#ffffff';
  this.opacity = opt.opacity ? opt.opacity : 0.75;
  this.size = opt.size ? opt.size : 1;
  this.duration = opt.duration ? opt.duration : 100;
  this.intersects = [];
  this.activeElements = opt.activeElements ? opt.activeElements : [];
  this.time = 0;

  this.strokeWidth = opt.strokeWidth ?  (opt.strokeWidth) : 2;

  var size = 256;
  var rangeSize = size - ((this.strokeWidth*10));
  var rangePos = size - (this.strokeWidth*10 / 2);
  var sizeHalf = size / 2;

  var canvas = document.createElement('canvas');  
      canvas.width = size;
      canvas.height = size;
      canvas.style.position = 'absolute';
      canvas.style.display = 'none';
      document.body.appendChild(canvas);
  this.map = new THREE.Texture(canvas);
  this.map.needsUpdate = true;

  var c = canvas.getContext('2d');
  var pointer = new THREE.Mesh(new THREE.PlaneBufferGeometry(this.size,this.size,2,2),new THREE.MeshBasicMaterial({
    transparent:true,
    map : this.map,
    depthWrite : false,
    depthTest : false
  }));
  //___________ pointer
  pointer.name = 'referencePoint';
  pointer.lookAt(this.camera);
  pointer.position.z = - this.distanceFromCamera;
  this.camera.add(pointer);

  this.draw = function(time,duration){

    var radius = sizeHalf - (((this.strokeWidth* 10) / 2));
        c.clearRect(0,0,size,size);
        c.save();
        c.globalAlpha = 1;
        // Create a circle
        c.beginPath();
        c.arc(sizeHalf, sizeHalf, radius, 0, 2 * Math.PI, false);
        
        c.lineWidth = this.strokeWidth * 10;
        c.strokeStyle = this.color;
        c.stroke();
        // Clip to the current path
        c.clip();
        c.fillStyle = this.color;
        c.globalAlpha = this.opacity;

        c.fillRect((this.strokeWidth * 10 / 2),rangePos - Math.floor(time * rangeSize / duration),rangeSize,Math.floor(time * rangeSize / duration));
         // Undo the clipping
        c.restore();

        this.map.needsUpdate = true;
  }

  //draw the circle once
  this.draw(c);
  

  for(var i=0;i<this.activeElements.length;i++){
    this.activeElements[i].time = 0;
    this.activeElements[i].duration = this.activeElements[i].duration ? this.activeElements[i].duration : this.duration;
    this.activeElements[i].hoverElements = null;
  }


  this.checkCollision = function(o) {
      // update the picking ray with the camera and mouse position  
      this.raycaster.setFromCamera( this.midPoint , this.camera ); 
      this.intersects = [];
      // calculate objects intersecting the picking ray
      this.intersects = this.raycaster.intersectObjects( o.elements );
      var point;
      if ( this.intersects.length > 0 ) {
        for(var i=0;i<this.intersects.length;i++){
          point = this.intersects[i].point;
          if (typeof o.hover === "function") { 
            o.hover({
              element : this.intersects[i].object,
              point : point,
              distance : this.intersects[i].distance
            });
          }
        
          if(o.time === o.duration){
            if (typeof o.click === "function") { 
              o.click({
                element : this.intersects[i].object,
                point : point,
                distance : this.intersects[i].distance
              });
            }
          }
          o.time++;
          this.draw(o.time,o.duration);
        }
        o.hoverElements = this.intersects;
      }else{
        o.time = 0;
        if(o.hoverElements !== null){
          this.draw(o.time);

          if (typeof o.out === "function") { 
            o.hoverElements.forEach(function(el) {
              o.out({
                element : el.object,
                point : el.point,
                distance : el.distance
              });
            });
          }
          o.hoverElements = null;
        }
      }
    }

  this.update = function () {
    for(var i=0;i<this.activeElements.length;i++){
      this.checkCollision(this.activeElements[i]);
    }
  }
}