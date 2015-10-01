//___________________________________________ Variables
var main_color = 0x000000;
var canvas_height = window.innerHeight;
var canvas_width = window.innerWidth;
//___________________________________________ Scene
var scene = new THREE.Scene();

//___________________________________________ CAmera
var camera = new THREE.PerspectiveCamera( 125, canvas_width/canvas_height, 0.1, 1000 );

  camera.position.set(-5,5,6);
  
scene.add(camera);
//___________________________________________ Renderer

var renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize( canvas_width, canvas_height );
    document.body.appendChild( renderer.domElement );


//___________________________________________ REsize
window.onresize = function(){
  canvas_height = window.innerHeight;
  canvas_width = window.innerWidth;
  camera.aspect = canvas_width / canvas_height;
  camera.updateProjectionMatrix();
  renderer.setSize( canvas_width, canvas_height );
}
//___________________________________________ CONTROLS

  controls = new THREE.OrbitControls( camera );

  controls.damping = 0.2;
  controls.target.set(0,5,0);
  camera.lookAt(new THREE.Vector3(0,5,0));
  controls.update();

//___________________________________________ Light

var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set( 0, 100, 100 );
    spotLight.intensity = 1;
    spotLight.castShadow = true;
    scene.add(spotLight);

//___________________________________________ GUI

var ShaderOptions = function() {
  this.start = 0.25;
  this.end = 1.8;
  this.main_color = '#ffffff';
  this.rim_color = '#000000';
};

  var shader_options = new ShaderOptions();
  var gui = new dat.GUI();

var start_gui = gui.add(shader_options, 'start', -1.0, 1.0);
var end_gui = gui.add(shader_options, 'end', -5.0, 5.0);
var main_color_gui = gui.addColor(shader_options,'main_color');
var rim_color_gui = gui.addColor(shader_options,'rim_color');
start_gui.onChange(function(value) {
	base_material.uniforms['start'].value = value;
});
end_gui.onChange(function(value) {
	base_material.uniforms['end'].value = value;
});
main_color_gui.onChange(function(value) {
	base_material.uniforms['main_color'].value = new THREE.Color(value);
});
rim_color_gui.onChange(function(value) {
	base_material.uniforms['rim_color'].value = new THREE.Color(value);
});

//___________________________________________ Shader
var uniforms = {
   	threshold: {
		type: "f",
		value: shader_options.threshold
	},
	start: {
		type: "f",
		value: shader_options.start
	},
	end: {
		type: "f",
		value: shader_options.end
	},
	time: { 
		type: "f", value: 1.0 
	},
	resolution: { 
		type: "v2", 
		value: new THREE.Vector2() 
	},
	rim_color : {
		type: "c",
		value : new THREE.Color(shader_options.main_color)
	},
	main_color : {
		type: "c",
		value : new THREE.Color(shader_options.rim_color)
	}
}


var shaderMaterial = new THREE.ShaderMaterial({
	uniforms: uniforms,
	attributes: {
		vertexOpacity: { 
			type: 'f', value: [] 
		}
	},
	vertexShader:   $('#vertexshader').text(),
	fragmentShader: $('#fragmentshader').text()
});

//____________________________ SHADER
var base_material = shaderMaterial;
var loader = new THREE.JSONLoader();

loader.load("https://s3-us-west-2.amazonaws.com/s.cdpn.io/61062/minion.json", function ( geometry,material) {
	minion = new THREE.Mesh( geometry,base_material);
	minion.position.set( 0,0,0 );
	minion.scale.set(10,10,10);
	scene.add( minion );
});	

//___________________________________________ Render
var render = function () { 
  requestAnimationFrame( render ); 
  animation();
  renderer.render(scene, camera);
};

//___________________________________________ Animation
function animation(){

   if(typeof minion != "undefined"){
   	minion.rotation.y  -= .005;
   }
};
//___________________________________________ Start
render();