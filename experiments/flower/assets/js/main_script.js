
/*
	Basic Setup
*/
var main_color = 0x2174ca;
var canvas_height = window.innerHeight;
var canvas_width = window.innerWidth;


//__________________________________________

function randNum(min,max,bool){
  
  var num = Math.floor(Math.random()*max) + min; // this will get a number between 1 and 99;
  if(bool || typeof bool == "undefined"){
    num *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
  }
  return num;
}

// Check of point is in radius
function pointInCircle(point,target, radius) {
  var distsq = (point.x - target.x) * (point.x - target.x) + (point.y - target.y) * (point.y - target.y) + (point.z - target.z) * (point.z - target.z);
  // returns bool , distance to target origin 
  return [distsq <= radius * radius * radius,distsq];
}



var scene = new THREE.Scene();



//__________________________________________
var camera = new THREE.PerspectiveCamera( 55, canvas_width/canvas_height, 0.1, 1000 );

  camera.position.set(-10,2,22);
  camera.lookAt(new THREE.Vector3(0,50,0));
scene.add(camera);



var helperGeo = new THREE.BoxGeometry(1,1,1);
var cam_helper = new THREE.Mesh(helperGeo,new THREE.MeshBasicMaterial({

}));

cam_helper.visible = false;

scene.add(cam_helper);
cam_helper.add(camera);

//__________________________________________

var renderer = new THREE.WebGLRenderer({ alpha: true,transparent : true }); /// { alpha: true }
    
    renderer.setSize( canvas_width, canvas_height );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    //renderer.setClearColor(main_color,1);

    document.body.appendChild( renderer.domElement );

//__________________________________________

window.onresize = function(){
  canvas_height = window.innerHeight;
  canvas_width = window.innerWidth;
  camera.aspect = canvas_width / canvas_height;
  camera.updateProjectionMatrix();
  renderer.setSize( canvas_width, canvas_height );
}
//__________________________________________

  controls = new THREE.OrbitControls( camera );

  controls.damping = 0.2;
  controls.minPolarAngle = 73 * Math.PI/180;
  controls.maxPolarAngle = 85 * Math.PI/180;
 	//controls.minPolarAngle = 3;
  controls.minDistance = 15;
  controls.maxDistance = 25;
//__________________________________________
var ambient = new THREE.AmbientLight(0xaaaaaa,1);
scene.add(ambient);
var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set( 0, 500, 100 );
    spotLight.intensity = 2;
    spotLight.castShadow = true;
    scene.add(spotLight);
//__________________________________________

var loader = new THREE.JSONLoader();
var texLoader = new THREE.TextureLoader();

var plants = [
	'plant_1',
	'plant_2',
	'plant_3',
	'plant_4',
	'plant_5',
	'plant_6',
	'plant_7',
	'plant_8',
	'gras',
	'dandelion',
	'flower_1',
	'flower_2'
]


var models = {

}
texLoader.load('assets/tex/map.png',function(texture){

	var material = new THREE.MeshPhongMaterial({
		color : new THREE.Color(0xffffff),
		side : THREE.DoubleSide,
		shininess :0,
		map : texture,
		bumpMap : texture,
		bumpScale : -.05,
		transparent : true,
		depthTest : true,
		depthWrite : true,
		alphaTest : .25,
	});	

	function loadPlant(id,name,url){
		var ID = id;
		var name = name;
		loader.load(url,function(geometry){
			var plant = new THREE.Mesh(geometry,material);
				models[name] = plant;
				models[name].id = ID;

				creator(name);
		});
	}


	plants.forEach(function(p,index){
		loadPlant(index,p,'assets/json/'+p+'.json');
	});
});


var plantRadius = 20;

function creator(name){
	switch(name){

		case 'gras':
			createRandomObject(700,name,plantRadius);
		break;
		
		case 'flower_1':
			createRandomObject(200,name,plantRadius);
		break;
		case 'flower_2':
			createRandomObject(200,name,plantRadius);
		break;
		

		default:
			createRandomObject(5,name,plantRadius);
		break;

	}
}


function calculatePointInCircle(r) {
			x = Math.random() * 2 * r - r;
			zlim = Math.sqrt(r * r - x * x);
			z = Math.random() * 2 * zlim - zlim;
    return [x,z];
}


function createRandomObject(count,name,r){
	var group = new THREE.Object3D();
		for(var g=0;g<count;g++){
			var p = calculatePointInCircle(r);
			group.children[g] = models[name].clone();
			group.children[g].position.x = p[0];
			group.children[g].position.z = p[1];
			group.children[g].rotation.y = randNum(0,360,true) * Math.PI / 180;
			var scaler = randNum(.92,1,false);
				group.children[g].scale.set(scaler,scaler,scaler);
		

		}
	scene.add(group);
	return group;
}


var planeMat = new THREE.MeshPhongMaterial({
	color : 0x455029,
	specular : 0x000000,
	shininess : 0,
	side : THREE.DoubleSide,
});

var radius = 22; 
var segments = 32; 
var circleGeometry = new THREE.RingGeometry(0, radius, segments, segments, 0, Math.PI * 2);

var ground = new THREE.Mesh(circleGeometry,planeMat);
		ground.rotation.x = 90 * Math.PI / 180;
		scene.add(ground);
var boundMat = new THREE.MeshPhongMaterial({
	color : 0x111111,
	specular : 0x000000,
	shininess : 0,
	side : THREE.DoubleSide,
	shading : THREE.FlatShading
});
var boundGeometry = new THREE.TorusGeometry( 21.5, 1, 6, 180);
var bound = new THREE.Mesh( boundGeometry, boundMat );
bound.rotation.x = 90 * Math.PI/180;
scene.add( bound );





//__________________________________________
var render = function () { 
  animation();
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame( render ); 
};

//__________________________________________

function animation(){
  cam_helper.rotation.y  += .0005;
};
//__________________________________________

render();