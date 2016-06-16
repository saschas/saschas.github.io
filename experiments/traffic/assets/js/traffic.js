var clock = new THREE.Clock();
var helper;
var time = 0;
var traffic_holder = new THREE.Object3D();
var texture_car_paint = document.getElementById('texture_car');
var schalen = [];
var c;
var å = {
	ready : {
		count:0
	},
	colors : [
		[
		0xE0152F,//base
		0x0992CA,//window
		0x666666,//wheel_border
		0x444444,//wheel
		0xcccccc//wheel
		],
		[
		0xF6AA6E,
		0xDDF2FF,
		0x666666,
		0x444444,
		0xcccccc
		],
		[
		0x00ff2F,
		0x0992CA,
		0x666666,
		0x444444,
		0xcccccc
		],
		[
		0xffff2F,
		0x0992CA,
		0x666666,
		0x444444,
		0xcccccc
		]
	],
	models :{
		truck : "assets/model/truck.json",
		pickup : "assets/model/pickup.json",
		normal : "assets/model/normal.json",
		cabrio : "assets/model/cabrio.json",
		limousine : "assets/model/limousine.json",
		wohnmobil : "assets/model/wohnmobil.json",
	},
	loaded:[],
	size :{
		x : window.innerWidth,
		y : window.innerHeight	
	},
	targetList : []
}

//___________________________________________




//

var manager = new THREE.LoadingManager();
manager.onProgress = function ( item, loaded, total ) {
	if(loaded == total){
		traffic();
		animate(time);
	}
};

var loader = new THREE.JSONLoader(manager);

for(asset in å.models){

	loader.load(å.models[asset],function(geometry,material){
		
		var name = '';
	
			å.loaded.push(geometry);
		
	});

}

//___________________________________________

function getRandomColor() {
    var letters = '0123433333000ccc'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
}

function randomNumber(min, max, bool) {

  var num = Math.floor(Math.random() * max) + min; // this will get a number between 1 and 99;
  if (bool || typeof bool == "undefined") {
    num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
  }
  return num;
}
function get_intensity(n){
	return 100 * n / 255;
}

function clamp(num,min,max){
	if(num<min){
		num = min;
	}
	if(num > max){
		num = max;
	}

	return num;
}

//___________________________________________
	var paint_ = new THREE.MeshPhongMaterial({
		color : å.colors[1][0],
		shading:THREE.FlatShading,
	//	map : å.texture.car
	});
	var glas_ = new THREE.MeshPhongMaterial({
		color : å.colors[1][1],
		shading:THREE.FlatShading,
		//map : å.texture.car,
	});
	var reifen_rahmen_ = new THREE.MeshPhongMaterial({
		color : å.colors[1][2],
		shading:THREE.FlatShading,
		//map : å.texture.car,
	});
	var reifen_ = new THREE.MeshPhongMaterial({
		color : å.colors[1][3],
		shading: THREE.FlatShading,
		opacity : 1
	});

	var reifen_inner = new THREE.MeshPhongMaterial({
		color : å.colors[1][4],
		shading : THREE.FlatShading,
		opacity : 1
	});

	var car_paint_Material = new THREE.MeshFaceMaterial([
		paint_,
		glas_,
		reifen_rahmen_,
		reifen_,
		reifen_inner
	]);


function add_car(geometry,color_id){
	

var car = new THREE.Mesh(geometry,car_paint_Material);
	car.castShadow = true;	
	car.scale.set(1.5,1.5,1.5);
	car.update = function(time){
		this.position.x -= .2 + randomNumber(0.2,.85,false);

		if(this.position.x < -100){
			this.position.x = 160;
		}
	}
	//car.receiveShadow = true;
	
	return car;
}

//___________________________________________ TRAFFIC


function traffic(){
	
	var c = 0;
	var col = 5;
	var row = 10;
	for(var p = 0;p< col;p++){

		for(var t = 0;t< row;t++){
			c++;
			//console.log(å.loaded)
			var car_pool = add_car(å.loaded[randomNumber(0,å.loaded.length,false)],randomNumber(0, å.colors.length, false));
				car_pool.position.x += c * 25 + randomNumber(0,3,false);
				car_pool.position.z += p * 10;
			traffic_holder.add(car_pool);
			if(c > row ) c = 0;

		}

	}
	
	traffic_holder.position.x -= 60;
	traffic_holder.position.z -= 20;
	scene.add(traffic_holder);
	
}
var text_canvas = document.createElement('canvas');
	text_canvas.width = window.innerWidth;
	text_canvas.height = window.innerHeight;
	document.body.appendChild(text_canvas);

c = text_canvas.getContext('2d');
c.fillStyle = '#000';
c.fillRect(0,0,window.innerWidth,window.innerHeight);
c.globalCompositeOperation = 'destination-out';
c.beginPath();




function texter(){

	c.lineWidth   = 15;
	c.strokeRect(window.innerWidth/2-200,window.innerHeight/2-50,400,100);


	c.fillStyle="black";
	c.font = "80px Passion One";
	c.fontWeight = '900';
	c.textAlign = "center";
	c.textBaseline = "middle";
	c.fillText("TRAFFIC", window.innerWidth/2, window.innerHeight/2);

}
var points = [];
for(var n=0;n<250;n++){
	points.push({
		x : randomNumber(0,å.size.x / 2  ,false),
		y : randomNumber(0,å.size.y / 2 ,false),
		speed : randomNumber(1,3,false)
	})
}

    c.update = function(time){
    	this.globalCompositeOperation = 'source-over';
    	//
    	this.fillStyle = '#000';
    	this.fillRect(0,0,å.size.x,å.size.y);

    	this.globalCompositeOperation = 'destination-out';
		texter();
		c.rotate(-25*Math.PI/180);
    	for(var l=0;l<points.length;l++){
			points[l].y += points[l].speed;
			
			if(points[l].y > å.size.y * 1.5){
				points[l].y = 0;
			}
			//
		  c.fillRect(points[l].x,points[l].y,12,22);
		 }
		 c.rotate(25*Math.PI/180);

    }




	  //___________________________________________ KICK IT OFF
      
      function start_scene(){
      	container = document.getElementById( 'container' );
      	// _____________________ Renderer

        renderer = new THREE.WebGLRenderer( { antialias: true,transparent:true,alpha: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setClearColor(0x542437);
        container.appendChild( renderer.domElement );
        renderer.shadowMap.enabled = true;

      	//_____________________ Main Scene
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2( 0x542437, 0.008 );

		//_____________________ Camera
        camera = new THREE.PerspectiveCamera( 105, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.x = -31;
        camera.position.y = 10;
        camera.position.z = -28;
        scene.add( camera );

        //___________________________________________ CONTROLS
        controls = new THREE.OrbitControls( camera );
        //controls.damping = 0.2;
		  controls.addEventListener( 'change', render );
		  controls.maxPolarAngle = Math.PI/2;
		  controls.maxDistance = 110;
		
          
         //___________________________________________ LIGHTs 

		var ambient = new THREE.AmbientLight(0xAD6BDF,1);
		scene.add(ambient);

	
		//_____________________RIM LIGHT
			rim_light = new THREE.SpotLight( 0xffffff, 10,550,Math.PI/2 );
			rim_light.position.set(0,500,-10 ).multiplyScalar( 1 );
		
			
			rim_light.castShadow = true;
			rim_light.shadow.mapSize.width = 1024 ;
    	rim_light.shadow.mapSize.height = 1024 ;

			
			var d = 350;
		
			rim_light.shadow.camera.left = -d;
			rim_light.shadow.camera.right = d;
			rim_light.shadow.camera.top = d ;
			rim_light.shadow.camera.bottom = -d;
			rim_light.shadow.camera.near = 0.01;

			scene.add(rim_light);
			
       
       //___________________________________________


		var planeGeo = new THREE.PlaneBufferGeometry(300,300,128);
		var planeMat = new THREE.MeshLambertMaterial({
			color : 0x333333,
			side : THREE.DoubleSide
		})
		var plane = new THREE.Mesh(planeGeo,planeMat);
			plane.rotation.x = 90 * Math.PI / 180;

			plane.receiveShadow = true;
		scene.add(plane);

      }

     

	
//___________________________________________ Event in Space
	window.addEventListener( 'resize', onWindowResize, false );
//___________________________________________ click

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
  å.size.x = window.innerWidth
  å.size.y = window.innerHeight;

}
//___________________________________________ Start



start_scene();
//___________________________________________ RENDER 


function animate(time) {

  requestAnimationFrame( animate );
  controls.update();
  render(time);

}

function render(time) {	
	 var delta = .75 * clock.getDelta();
        
        c.update(time);	
		
        if(traffic_holder.children != "undefined"){
        	traffic_holder.children.forEach(function(car,index){
        		car.update(time);
        	})
        }
  	renderer.render( scene, camera );
}