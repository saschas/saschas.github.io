var Adjust = { version : 0.01 }
// Object Assign
if ( Object.assign === undefined ) {
  // Missing in IE.
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
  ( function () {
    Object.assign = function ( target ) {
      'use strict';
      if ( target === undefined || target === null ) {
        throw new TypeError( 'Cannot convert undefined or null to object' );
      }
      var output = Object( target );
      for ( var index = 1; index < arguments.length; index ++ ) {
        var source = arguments[ index ];
        if ( source !== undefined && source !== null ) {
          for ( var nextKey in source ) {
            if ( Object.prototype.hasOwnProperty.call( source, nextKey ) ) {
              output[ nextKey ] = source[ nextKey ];
            }
          }
        }
      }
      return output;
    };
  } )();
}

Object.assign( Adjust, {

  dpr : window.devicePixelRatio,
  width : window.innerWidth * this.dpr,
  height : window.innerHeight * this.dpr,
  realWidth : window.innerWidth,
  realHeight : window.innerHeight,
  mouse : new THREE.Vector2(),
  offset : new THREE.Vector3(),
  objects : [],
  half :  {
    width : 0.5  * this.width / this.dpr,
    height : 0.5  * this.height / this.dpr
  },
  raycaster : new THREE.Raycaster(),
  selected : null,
  intersected :null,
  labels : [],

init : function(opt){
  this.camera = opt.camera ? opt.camera : console.warn('camera must be present in order to initialize Adjust');
  this.renderer = opt.renderer ? opt.renderer : console.warn('renderer must be present in order to initialize Adjust');
  this.scene = opt.scene ? opt.scene : console.warn('scene must be present in order to initialize Adjust');

  this.bindEvents();
  var renderSize = this.renderer.getSize();
  this.width = renderSize.width * this.dpr;
  this.height = renderSize.height * this.dpr;
  this.realWidth = renderSize.width;
  this.realHeight = renderSize.height;
  this.resize();
  this.plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry( 200, 200, 8, 8 ),
    new THREE.MeshPhongMaterial( { visible: false } )
  );
  this.scene.add( this.plane );
},

bindEvents : function(){
  window.addEventListener( 'mousemove', this.onMouseMove.bind(this), false );
  window.addEventListener( 'mousedown', this.onMouseDown.bind(this), false );
  window.addEventListener( 'mouseup', this.onMouseUp.bind(this), false );
},

randNum : function(min,max,bool){
  var num = Math.floor(Math.random()*max) + min;
  if(bool || typeof bool == "undefined"){
num *= Math.floor(Math.random()*2) == 1 ? 1 : -1; 
  }
  return num;
},


addPoints : function (elements){
  if(typeof this.elements == 'object'){
    var additionalElements = document.getElementsByClassName(elements);
    var moreObjects = [];
    this.domElementsBool = true;
    for(var i = 0;i<this.elements.length;i++){
        moreObjects.push(this.elements[i]);
    }
    for(var el = 0;el<additionalElements.length;el++){
        moreObjects.push(additionalElements[el]);
    }
    
    this.elements = moreObjects;

  }else{
    if(typeof elements != "undefined"){
        this.elements = document.getElementsByClassName(elements);
  
      this.domElementsBool = true;
    }
    else{
      console.warn('No argument! classname required');
    }
  }
},

removePoints : function (){
  this.domElementsBool = false;

  for(var p=0;p< this.elements.length;p++){
    this.elements[p].style = '';
  }
  this.elements = [];
},



addLabel : function (className) {

  this.updateLabelsBool = true;
  var labels = document.getElementsByClassName(className);

  for(var i=0; i < labels.length;i++){
    this.labels.push(labels[i]);

    this.scene.children.forEach(function(l,index){

      if(l.name == labels[i].dataset.label){
        labels[i]._dirtyCustom = l;
      }

    })
  }
},

updateSingleLabel : function(domElement){
var offsetX = 0;
var offsetY = 0;
var offsetZ = 0;


  if(typeof domElement.dataset.offsetx != 'undefined'){
    offsetX = domElement.dataset.offsetx;
  }
  if(typeof domElement.dataset.offsety != 'undefined'){
    offsetY = domElement.dataset.offsety;
  }
  if(typeof domElement.dataset.offsetz != 'undefined'){
    offsetZ = domElement.dataset.offsetz;
  }
  var vector = new THREE.Vector3();
  var p = {
    x : parseFloat(domElement._dirtyCustom.position.x) - offsetX,
    y : parseFloat(domElement._dirtyCustom.position.y) - offsetY,
    z : parseFloat(domElement._dirtyCustom.position.z) - offsetZ,
  }
  vector.set(p.x,p.y,p.z);

    domElement.dataset.bound = this.pointInFrustum(vector);
    this.convertVector(vector);

    this.domElement(domElement,vector);

  return vector;
},

resize : function (){
  this.dpr = window.devicePixelRatio;
  var renderSize = this.renderer.getSize();
  this.width = renderSize.width * this.dpr;
  this.height = renderSize.height * this.dpr;
  this.realWidth = renderSize.width;
  this.realHeight = renderSize.height;
  this.half.width = 0.5  * this.width / this.dpr;
  this.half.height = 0.5  * this.height / this.dpr
},


transformEl : function(el,pos){
  el.style.webkitTransform = 'translateX(' + pos.x +'px) translateY('+pos.y + 'px) translateZ('+pos.z + 'px)';
  el.style.MozTransform = 'translateX(' + pos.x +'px) translateY('+pos.y + 'px) translateZ('+pos.z + 'px)';
  el.style.OTransform = 'translateX(' + pos.x +'px) translateY('+pos.y + 'px) translateZ('+pos.z + 'px)';
  el.style.transform = 'translateX(' + pos.x +'px) translateY('+pos.y + 'px) translateZ('+pos.z + 'px)';
},

domElement : function (domElement,vector,bound){
  var offsetX = domElement.getBoundingClientRect().width / 2;
  var offsetY = domElement.getBoundingClientRect().height / 2;
  vector.x -= offsetX;
  vector.y -= offsetY;
  vector.z = Math.max((3) - vector.z , 0.1);


  this.transformEl(domElement,vector);
  
  if(typeof bound != 'undefined'){
    domElement.dataset.bound = bound;
  }
},

convertVector : function (v){
  v.project(this.camera);
  v.x = ( v.x * this.half.width) + this.half.width;
  v.y = - ( v.y * this.half.height ) + this.half.height;
  v.z = ( v.z * (this.half.width/this.half.height) / 2) + (this.half.width / this.half.height) * 2;
  return v;
},

element : function (domElement){
  var vector = new THREE.Vector3();

  if(typeof this.width == "undefined"){
    this.init();
  }
  if(Object.keys(domElement.dataset).length == 0){
    console.warn('Missing data Attribute on Element:',domElement);
    return false;
  }
  var p = {
    x : parseFloat(domElement.dataset.x),
    y : parseFloat(domElement.dataset.y),
    z : parseFloat(domElement.dataset.z),
  }
  vector.set(p.x,p.y,p.z);
  domElement.dataset.bound = this.pointInFrustum(vector);
  this.convertVector(vector);
  this.domElement(domElement,vector);
  return vector;
},

setMouse : function(coor){
  
  this.mouse = coor;

  return this.mouse;
},

normalizeMouse : function(coor){


  var vec = {
    x : (coor.x / this.width) * 2 - 1,
    y : (coor.y / this.height) * 2 + 1,
    z : 0.5
  }
  
  return vec;
},

onMouseMove : function( e ) {

  var event = e ? e:event;
  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components
  this.setMouse({
    x : event.clientX,
    y : event.clientY,
    z : 0.5
  });


},

checkSelected : function (){
  if(this.intersected!=null){
    this.selected = this.intersected;
    this.selectedState(this.intersected,this.intersects);
  }
  else{
    this.selected = null;
  }
 
},
uncheckSelected : function (){
  if (this.intersected ) {
    if(typeof this.passivState != 'undefined'){
      this.passivState(this.intersected);
    }
    if(this.intersected._draggable){
      this.plane.position.copy( this.intersected.position );
    }
  }
  this.intersected = null;
  this.selected = null;
},

onMouseDown : function (e){
  var e = e ? e:event;
  this.checkSelected();
},


onMouseUp : function (e){
  var e = e ? e:event;
  this.uncheckSelected();

},

checkPointInRadius : function(point,target, radius,cb) {
  var distsq = (point.x - target.x) * (point.x - target.x) + (point.y - target.y) * (point.y - target.y) + (point.z - target.z) * (point.z - target.z);
  // returns bool , distance to target origin


  var sum = [distsq <= radius * radius * radius,distsq];


  cb(sum[0],sum[1]);

  return sum;
},


update : function(){

  if(this.domElementsBool){
    for(var p=0;p< this.elements.length;p++){
      this.element(this.elements[p]);
    }
  }

  if(this.updateLabelsBool){
    for(var l=0;l< this.labels.length;l++){
      this.updateSingleLabel(this.labels[l]);
    }
  }

  if(this.activeObjectUpdate){
    this.checkMouseCollision();
  }

  if(this.vr){
    for(var i=0;i<this.activeElements.length;i++){
      this.checkCollision(this.activeElements[i]);
    }
  }

},

addActiveObject : function (obj,activState,passivState,selectedState,bool){
  this.activState = activState;
  this.passivState = passivState;
  this.selectedState = selectedState;
  this.activeObjectUpdate = true;
  this.objects.push(obj);

  this.addDraggable(obj,bool);
},


addDraggable : function(obj,bool){
  obj._draggable = bool;
},


checkMouseCollision : function(){
  var vector = new THREE.Vector3();

  vector.set(
      ( this.mouse.x / this.realWidth ) * 2 - 1,
      - ( this.mouse.y / this.realHeight ) * 2 + 1,
      0.5 );


  this.raycaster.setFromCamera( vector, this.camera );

   if ( this.selected !=null) {
    this.intersects = this.raycaster.intersectObject( this.plane );

          if ( this.intersects.length > 0 ) {
              this.plane.position.copy( this.intersected.position );
              this.plane.lookAt( this.camera.position );

            
            if(this.intersected._draggable){

              this.selected.position.copy( this.intersects[ 0 ].point.sub( this.offset ) );
              
            }
          }
    return;
  }

  this.intersects = this.raycaster.intersectObjects( this.objects );

  if ( this.intersects.length > 0 ) {
    if ( this.intersected != this.intersects[ 0 ].object ) {


      if ( this.intersected ) {
        this.passivState(this.intersected,this.intersects);
      }

        this.intersected = this.intersects[ 0 ].object;
       
        this.plane.position.copy( this.intersected.position );
        this.plane.lookAt( this.camera.position );
    }

    if ( this.intersected ) {

      this.activState(this.intersected,this.intersects);
    }
  } else {

    if ( this.intersected ) {
    
      this.passivState(this.intersected,this.intersects);
    }

    this.intersected = null;
    this.selected = null;

  }
},



distanceToCamera : function(p){

    var dx = p.x - this.camera.position.x;
    var dy = p.y - this.camera.position.y;
    var dz = p.z - this.camera.position.z;

    return Math.sqrt((dx*dx)+(dy*dy)+(dz*dz));

},

objInFrustum : function(obj){
  this.camera.updateMatrix(); // make sure camera's local matrix is updated
  this.camera.updateMatrixWorld(); // make sure camera's world matrix is updated
  this.camera.matrixWorldInverse.getInverse( camera.matrixWorld );

  obj.updateMatrix(); // make sure plane's local matrix is updated
  obj.updateMatrixWorld(); // make sure plane's world matrix is updated

  var frustum = new THREE.Frustum();
      frustum.setFromMatrix( new THREE.Matrix4().multiplyMatrices( this.camera.projectionMatrix, this.camera.matrixWorldInverse ) );
  
  return frustum.intersectsObject(obj) ;
},

pointInFrustum : function(p){
  this.camera.updateMatrix(); // make sure camera's local matrix is updated
  this.camera.updateMatrixWorld(); // make sure camera's world matrix is updated
  this.camera.matrixWorldInverse.getInverse( camera.matrixWorld );

  var frustum = new THREE.Frustum();
      frustum.setFromMatrix( new THREE.Matrix4().multiplyMatrices( this.camera.projectionMatrix, this.camera.matrixWorldInverse ) );

  return frustum.containsPoint(p) ;
},

mouseToSpace : function(){

  var pos = this.coorToSpace(this.mouse.x,this.mouse.y);

  return pos;
},


coorToSpace : function(x,y){

  var vector = new THREE.Vector3();

  vector.set(
      ( x / this.realWidth ) * 2 - 1,
      - ( y / this.realHeight ) * 2 + 1,
      0.5 );

  vector.unproject( this.camera );

  var dir = vector.sub( this.camera.position ).normalize();

  var distance = - this.camera.position.y / dir.y;

  var pos = this.camera.position.clone().add( dir.multiplyScalar( distance ) );

  return pos;
},


spaceToCoor : function(position){

  var p = new THREE.Vector3(position.x, position.y, position.z);
  var vector = p.project(this.camera);

  vector.x = (vector.x + 1) / 2 * this.realWidth;
  vector.y = -(vector.y - 1) / 2 * this.realHeight;

  return vector;
},

//__________________________ VR Pointer

VRPointer : function (opt){

  this.pointerCanvas = null;
  this.pointer = null,
  this.pointerCanvasContextcanvas = null;

  this.midPoint = new THREE.Vector2(0,0);
  this.raycaster = new THREE.Raycaster();
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
  


  this.draw = function(time,duration){
    var radius = sizeHalf - (((this.strokeWidth* 10) / 2));
        this.pointerCanvasContext.clearRect(0,0,size,size);
        this.pointerCanvasContext.save();
        this.pointerCanvasContext.globalAlpha = 1;
        // Create a circle
        this.pointerCanvasContext.beginPath();
        this.pointerCanvasContext.arc(sizeHalf, sizeHalf, radius, 0, 2 * Math.PI, false);
        
        this.pointerCanvasContext.lineWidth = this.strokeWidth * 10;
        this.pointerCanvasContext.strokeStyle = this.color;
        this.pointerCanvasContext.stroke();
        // Clip to the current path
        this.pointerCanvasContext.clip();
        this.pointerCanvasContext.fillStyle = this.color;
        this.pointerCanvasContext.globalAlpha = this.opacity;

        this.pointerCanvasContext.fillRect((this.strokeWidth * 10 / 2),rangePos - Math.floor(time * rangeSize / duration),rangeSize,Math.floor(time * rangeSize / duration));
         // Undo the clipping
        this.pointerCanvasContext.restore();

        this.map.needsUpdate = true;
  }

  this.createVRPointerCanvas = function (){
    

    this.pointerCanvas = document.createElement('canvas');  
    this.pointerCanvas.width = size;
    this.pointerCanvas.height = size;
    this.pointerCanvas.style.position = 'absolute';
    this.pointerCanvas.style.display = 'none';
        document.body.appendChild(this.pointerCanvas);
    this.map = new THREE.Texture(this.pointerCanvas);
    this.map.needsUpdate = true;

    this.pointerCanvasContext = this.pointerCanvas.getContext('2d');
    this.pointer = new THREE.Mesh(new THREE.PlaneBufferGeometry(this.size,this.size,2,2),new THREE.MeshBasicMaterial({
      transparent:true,
      map : this.map,
      depthWrite : false,
      depthTest : false
    }));
    //___________ pointer
    this.pointer.name = 'referencePoint';
    this.pointer.lookAt(this.camera);
    this.pointer.position.z = - this.distanceFromCamera;
    this.camera.add(this.pointer);


    //draw the circle once
    this.draw(this.pointerCanvasContext);

    this.vr = true;
  }

  this.removeVRPointer = function() {

    this.camera.remove(this.pointer);
    this.pointerCanvas.parentElement.removeChild(this.pointerCanvas);

    this.pointerCanvas = null;
    this.pointer = null,
    this.pointerCanvasContextcanvas = null;
    this.vr = false;
  }

  this.createVRPointerCanvas(); 

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

   
}
});
