var user_opt = {
  offset : -5,
  screen :{
    x : window.innerWidth,
    y : window.innerHeight
  },
  mouse :{
    x :window.innerWidth/2,
    y :window.innerHeight/2
  },
  step : function(dir,count){
    var step = dir / count;
    return step;
  },
  aspect :function(){
    return window.innerWidth/window.innerHeight;
  }
}

////////////////////////////////////////////
// Canvas Setup
var canvas = document.getElementById('canvas');
    canvas.width = user_opt.screen.x;
    canvas.height = user_opt.screen.y;
var c = canvas.getContext('2d');


function stroker(c,count){
    c.lineWidth = 1;
    // top
    c.beginPath();
    c.moveTo(user_opt.step(user_opt.screen.x*count,2), user_opt.offset);
    c.lineTo(user_opt.mouse.x, user_opt.mouse.y);
    c.stroke();
  
    c.beginPath();
    c.moveTo(user_opt.offset,user_opt.step(user_opt.screen.y*count,2));
    c.lineTo(user_opt.mouse.x, user_opt.mouse.y);
    c.stroke();
    
    c.beginPath();
    c.moveTo(user_opt.step(user_opt.screen.y*count,2), user_opt.screen.y+user_opt.offset*-1);
    c.lineTo(user_opt.mouse.x, user_opt.mouse.y);
    c.stroke();
  
    c.beginPath();
    c.moveTo(user_opt.screen.x+user_opt.offset*-1, user_opt.step(user_opt.screen.y*count,2));
    c.lineTo(user_opt.mouse.x, user_opt.mouse.y);
    c.stroke();
  
    c.beginPath();
    c.fillStyle = '#fff';
    c.arc(user_opt.mouse.x,user_opt.mouse.y,50,0,2*Math.PI);
    c.fill();
    c.stroke();
}

//////////////////////////////////////////
    //   Three Setup
//////////////////////////////////////////

var main_color = 0xffffff;
var scene = new THREE.Scene();
    //scene.fog = new THREE.FogExp2(main_color, 0.0045 );

//////////////////////////////////////////
    //   Camera
//////////////////////////////////////////
var camera = new THREE.PerspectiveCamera( 75, user_opt.aspect(), 0.1, 1000 );
    camera.lookAt(new THREE.Vector3(0,50,0));
    camera.position.set(0,50,200);
//////////////////////////////////////////
    //   Renderer
//////////////////////////////////////////
var renderer = new THREE.WebGLRenderer({ alpha: true }); /// { alpha: true }
    renderer.setSize( user_opt.screen.x, user_opt.screen.y );
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;
    renderer.setClearColor(main_color,1);
    renderer.className= 'canvas_three';
$('body').append( renderer.domElement );



//////////////////////////////////////////
    //   Controls
//////////////////////////////////////////

  controls = new THREE.OrbitControls( camera );
  controls.damping = 0.2;
  controls.maxPolarAngle = Math.PI/2;
  controls.minPolarAngle = 1;
  controls.minDistance = 100;
  controls.maxDistance = 220;
  controls.enabled = false;
  $('canvas').on( "mouseenter", function(e) {
    controls.enabled = true;
  });
  $('canvas').on( "mouseleave", function(e) {
    controls.enabled = false;
  });
//////////////////////////////////////////
    //    Light
//////////////////////////////////////////
var spotLight = new THREE.SpotLight(0xff0000);
    spotLight.position.set( 0, 10, 10 );
    //spotLight.intensity = 12;
    spotLight.castShadow = true;
    scene.add(spotLight);

var ambientLight = new THREE.AmbientLight();
    scene.add(ambientLight)

//////////////////////////////////////////
    //   Terrain
//////////////////////////////////////////

function terrain_obj(){
  this.terrain_geometry =  new THREE.PlaneGeometry(user_opt.screen.x*2,user_opt.screen.y*2, 64,64);
  this.terrain_material = new THREE.MeshBasicMaterial({
	  color: 0xffffff

	});
  this.terrain_wire_material = new THREE.MeshBasicMaterial({
	  color: 0x000000,
	  wireframe: true,
	  transparent: true
	});
  this.terrain_wire = null;
  this.generate = function(){
     for(var i=0;i<this.terrain_geometry.vertices.length;i++){
        this.terrain_geometry.vertices[i].z = Math.random() * 20;
     }
   this.terrain =  new THREE.Mesh(this.terrain_geometry,this.terrain_material);
   this.terrain_top =  new THREE.Mesh(this.terrain_geometry.clone(),this.terrain_material);
   this.terrain_bottom =  new THREE.Mesh(this.terrain_geometry.clone(),this.terrain_wire_material);
   this.terrain_wire =  new THREE.Mesh(this.terrain_geometry.clone(),this.terrain_wire_material);
   this.terrain.rotation.x = -Math.PI / 2;
   this.terrain.position.y = -20;
    
   this.terrain_top.rotation.x = Math.PI / 2;
   this.terrain_top.position.y = 130;
    
   this.terrain_bottom.rotation.x = Math.PI / 2;
   this.terrain_bottom.position.y = 129;
    
   this.terrain_wire.rotation.x = -Math.PI / 2;
   this.terrain_wire.position.y = -19.9;
   this.terrain.receiveShadow = true;
   this.terrain.castShadow = true;

   scene.add(this.terrain,this.terrain_wire,this.terrain_top,this.terrain_bottom);
   return this;
  };
  this.generate();
}
var terrain_bottom = terrain_obj();


//////////////////////////////////////////
    //    Event Binding
//////////////////////////////////////////

$('body').bind({
  mousemove : function(e){
    user_opt.mouse.x = e.clientX;
    user_opt.mouse.y = e.clientY;
  }
});

//////////////////////////////////////////
    //   Resize
//////////////////////////////////////////


window.onresize = function(){
  user_opt.screen.x = window.innerWidth;
  user_opt.screen.y = window.innerHeight;
  canvas.width = user_opt.screen.x;
  canvas.height = user_opt.screen.y;
  canvas_height = user_opt.screen.x;
  canvas_width = user_opt.screen.y;
  camera.aspect = canvas_width / canvas_height;
  camera.updateProjectionMatrix();
  renderer.setSize( user_opt.screen.x, user_opt.screen.y );
}


function draw(){
  console.log('i');
  for(var i =0;i<10;i++){
    stroker(c,i);
  }
  scene.rotation.y= user_opt.mouse.x * Math.PI/180;
 // spotLight.position.set( user_opt.mouse.x/1 , 100, 100 );
}

function animation(){
  renderer.render(scene, camera);
  c.clearRect(0,0,user_opt.screen.x,user_opt.screen.y);
  draw();  
  requestAnimationFrame(animation);
}

animation();