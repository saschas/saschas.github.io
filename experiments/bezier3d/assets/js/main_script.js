
/*
	Basic Setup
*/
//(function(){


function lerp(p0, p1, value ) {
  return ( 1 - value) * p0 + value * p1;
}

//__________ Variables


var d = {
  activeElement : null
}

var factor = 0;
var main_color = 0x1da2d5;
var second_color = 0x222222;
var time = 0;
var canvas_height = window.innerHeight;
var canvas_width = window.innerWidth;

var count = 10;
//__________ scene
var scene = new THREE.Scene();

    scene.fog = new THREE.Fog(main_color,700,1000);

//__________ camera
var camera = new THREE.PerspectiveCamera( 55, canvas_width/canvas_height, 0.1, 5000 );

  camera.position.set(0,0,450);
	scene.add(camera);
//__________ renderer

var renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias:true
    });
    renderer.setSize( canvas_width, canvas_height );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(main_color,1);

    document.body.appendChild( renderer.domElement );




//__________ Adjust
Adjust.init({
  camera : camera,
  scene : scene,
  renderer : renderer
});
//__________ resize

window.onresize = function(){
  canvas_height = window.innerHeight;
  canvas_width = window.innerWidth;
  camera.aspect = canvas_width / canvas_height;
  camera.updateProjectionMatrix();
  renderer.setSize( canvas_width, canvas_height );
  Adjust.resize();
}

//__________ controls

  controls = new THREE.OrbitControls( camera );

  controls.damping = 0.2;
  controls.maxPolarAngle = Math.PI/2;
  controls.minDistance = 300;
  controls.maxDistance = 800;


//__________ light

var ambient = new THREE.AmbientLight(0x666666);
    scene.add(ambient);

var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set( 0, 250, 0 );
    spotLight.angle = Math.PI / 3;
    spotLight.intensity = 1;
    spotLight.castShadow = true;
    scene.add(spotLight);

    spotLight.distance = 1500;

//__________ Active Functions for Adjust


function over (element, detail){
  controls.enabled = false;

  document.body.style.cursor = 'move';
}
//Mouseout Function
function out (element, detail){
  controls.enabled = true;
  d.activeElement = null;
  document.body.style.cursor = 'auto';
}
//Mousedown Function
function activeState (element, detail){
    d.activeElement = element;
}


//__________ cubes

var points = [];

for(var p=0;p<count;p++){
  points.push({
    x : -(count/2) * 20 + p * 20,
    y : Math.cos(p) * 50,
    z : Math.sin(p) * 50,
  })
}

function createSphere(radius, pos,index,max){

  if(max == 2){
    radius += 2;
  }

  var color = (max == true)  ? 0xffffff : second_color;
  var opacity = (max == 2)  ? .5 : 1;
  var sphere = new THREE.Mesh(new THREE.SphereGeometry(radius,12,12), new THREE.MeshLambertMaterial({
    color : color,
    transparent : true,
    opacity : 1
  }));
  sphere.castShadow = true;
  sphere.receiveShadow = true;
  sphere.position.set(pos.x,pos.y,pos.z);

  sphere._own = {
    index : index,
    last : false
  }
  if(max == true||max == 2){
    scene.add(sphere);
    sphere._own.last = true;
  }

  return sphere;
}


//__________ Master
var handlerSpheres = [];

var masterLineGeometry = new THREE.Geometry();

//_ line
var lineMaterial = new THREE.LineBasicMaterial({
  color: 0xffffff,
  opacity : .3,
  transparent : true
});


//handler
for(var i=0;i<points.length;i++){
  handlerSpheres[i] = createSphere(5,points[i],i,true);
  masterLineGeometry.vertices.push(new THREE.Vector3(points[i].x,points[i].y,points[i].z));
  Adjust.addActiveObject(handlerSpheres[i],over,out,activeState,true);
}
//___________________________________________________ 

var line = new THREE.Line( masterLineGeometry, lineMaterial );
    line.update = function(p,index){

      this.geometry.vertices[index].x = p.x;
      this.geometry.vertices[index].y = p.y;
      this.geometry.vertices[index].z = p.z;

      this.geometry.verticesNeedUpdate = true;
    }
scene.add( line );

//___________________________________________________ 

var plane = new THREE.Mesh(new THREE.CircleGeometry( 1500, 32 ),new THREE.MeshStandardMaterial({
  color : main_color,
  metalness : .3,
  roughness : .85,
  side : THREE.DoubleSide,
  emissive : 0x222222
}));

plane.rotation.x = 90 * Math.PI / 180;
plane.position.y = -150;
plane.receiveShadow = true;
scene.add(plane);
//___________________________________________________ 


function createSubStep(master){
  var that = this;
  this.subStep = [];

  for(var s=0;s<master.length-1;s++){
    this.subStep.push(createSphere(1,{
      x : 0,
      y : 0,
      z : 0
    },s,master.length));

    this.subStep[s].update = function(factor) {

      var x = lerp(master[this._own.index].position.x,master[this._own.index + 1].position.x , factor);
      var y = lerp(master[this._own.index].position.y,master[this._own.index + 1].position.y , factor);
      var z = lerp(master[this._own.index].position.z,master[this._own.index + 1].position.z , factor);

      this.position.set(x,y,z);
    }
  }

  this.subLineGeometry = new THREE.Geometry();
  this.subStep.forEach(function(sP,index){
    that.subLineGeometry.vertices.push({
      x : sP.position.x,
      y : sP.position.y,
      z : sP.position.z
    });
  });

  this.subLine = new THREE.Line( this.subLineGeometry, lineMaterial );
      scene.add(this.subLine);
      this.subLine.update = function(){
        that.subStep.forEach(function(sP,index){
          this.geometry.vertices[index].x = sP.position.x;
          this.geometry.vertices[index].y = sP.position.y;
          this.geometry.vertices[index].z = sP.position.z;
          this.geometry.verticesNeedUpdate = true;
        }.bind(this));
      }


  this.update = function(fac){
    this.subStep.forEach(function(sP,index) {
      sP.update(fac);
    });
    this.subLine.update(fac);
  }
}

var steps = [];
steps[0] = new createSubStep(handlerSpheres);
for(var l = 1;l<handlerSpheres.length-1;l++){
  steps[l] = new createSubStep(steps[l-1].subStep);
}

//_ line
var bezierLineMaterial = new THREE.LineBasicMaterial({
  color: 0xffffff
});

var bezierGeometry = new THREE.Geometry();

for(var p=0;p<100;p++){
  bezierGeometry.vertices.push(new THREE.Vector3(0,0,0));
}
var bezier = new THREE.Line( bezierGeometry, bezierLineMaterial );
    bezier.castShadow = true;
    
    bezier.update = function(p,index){

      this.geometry.vertices[index].x = p.x;
      this.geometry.vertices[index].y = p.y;
      this.geometry.vertices[index].z = p.z;

      this.geometry.verticesNeedUpdate = true;
    }
scene.add( bezier );

//__________ render
var render = function (time) { 
  requestAnimationFrame( render );
  controls.update();
  Adjust.update();

  animation(time);
  renderer.render(scene, camera);
};

//__________ animation

function animation(time){

  factor = 0.5 + Math.sin(0.0005 * time) * 0.5;


  handlerSpheres.forEach(function(s,index){
    s.position.x += Math.sin(0.00025 * time * (1 + index) ) * .15;
    s.position.y += Math.cos(0.00025 * time * (1 + index) ) * .15;
    s.position.z += Math.cos(0.00025 * time * (1 + index) ) * .15;

    line.update(s.position, s._own.index);
  });


  for(var t = 0;t<100;t++){
    steps.forEach(function(s,index){
      s.update(t * .01);
      if(index == steps.length-1){

        bezier.geometry.vertices[t].x = steps[index].subStep[0].position.x;
        bezier.geometry.vertices[t].y = steps[index].subStep[0].position.y;
        bezier.geometry.vertices[t].z = steps[index].subStep[0].position.z;

      }
    });
  }

  steps.forEach(function(s,index){
    s.update(factor);
  });

  bezier.geometry.verticesNeedUpdate = true;
};

//__________

render(time);





document.addEventListener('mousemove',function(event){

  if(d.activeElement != null){
    line.update(d.activeElement.position, d.activeElement._own.index);
  }
});


//}()); //__eof

