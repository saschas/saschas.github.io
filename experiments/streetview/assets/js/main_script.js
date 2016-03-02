//@codekit-prepend 'data.js';
/*
	Basic Setup
*/
//(function(){

//__________ Variables
(function(console){

console.save = function(data, filename){

    if(!data) {
        console.error('Console.save: No data')
        return;
    }

    if(!filename) filename = 'console.json'

    if(typeof data === "object"){
        data = JSON.stringify(data, undefined, 4)
    }

    var blob = new Blob([data], {type: 'text/json'}),
        e    = document.createEvent('MouseEvents'),
        a    = document.createElement('a')

    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
 }
})(console);


function loadJSON(url,callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', url, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(JSON.parse(xobj.responseText));
          }
    };
    xobj.send(null);  
 }

var dimension = 10;
var offset = 1;
var time = 0;
var manager = new THREE.LoadingManager();
var loader = new THREE.JSONLoader(manager);

/////////////////////////////////////////////////////////////////////////// URLs

var base_url = 'assets/json/';
var base_url_ico = 'assets/ico/';
var base_url_scenes = 'assets/scene/';


var backHolder = document.getElementById('backgroundHolder');

/////////////////////////////////////////////////////////////////////////// 
var main_color = 0x000000;


var canvas_width = backHolder.offsetWidth;
var canvas_height = backHolder.offsetHeight;

/////////////////////////////////////////////////////////////////////////// UI
var infoBox = document.getElementById('info');
var infoHolder = document.getElementById('infoHolder');

infoHolder.addEventListener('mouseover',function(){
  Adjust.disableMouse = true;
 // alert();
});

infoHolder.addEventListener('mouseout',function(){
  Adjust.disableMouse = false;
 // alert();
})
var exportButton = document.getElementById('export');

exportButton.addEventListener('click',function(){
  console.save(places);
})

var rotatePos = document.getElementById('rot-90-pos');
var rotateNeg = document.getElementById('rot-90-neg');


function rotateMesh(el,dir){
  var rotateTarget = (el.info.rot + dir);
    if(rotateTarget == 360){
      rotateTarget = 0;
    }
    if(rotateTarget < 0){
      rotateTarget = 360
    }

    el.rotation.y = rotateTarget * Math.PI / 180;
    el.info.rot = rotateTarget;
    console.log('target:' , places[el.info.coor]);
    places[el.info.coor].rot = rotateTarget;
    el.updateMatrix();
    el.matrixAutoUpdate = false;

    infoBox.innerHTML = '<span>ID: ' + el.info.coor +'</span><span>Type: ' + el.info.obj + '</span><span>rotation: ' + el.info.rot + '</span>';
 
}

rotatePos.addEventListener('click',function(){
  if(global.selected != null){
    rotateMesh(global.selected,90)
  }
});
rotateNeg.addEventListener('click',function(){
  if(global.selected != null){    
    rotateMesh(global.selected,-90)
  }

});


/////////////////////////////////////////////////////////////////////////// Loader
manager.onProgress = function ( item, loaded, total ) {

 // console.log( item, loaded, total );

};

manager.onLoad = function ( item, loaded, total ) {

  //console.log( 'ready' );
  generateCity();
};

/////////////////////////////////////////////////////////////////////////// Helper Functions

function randomRotation(){
  var rot = [0,90,180,270]

 return rot[Math.ceil( Math.random() * (rot.length-1))] ;
}


///////////////////// Load Mesh
function loadTile(name){
  var tileName = name;
    loader.load(base_url + name +'.json', function(geometry,material){
    
    material.forEach(function(m,index){
      m.shading = THREE.FlatShading
    })
    global.models[tileName] = new THREE.Mesh(geometry,new THREE.MeshFaceMaterial(material));
    global.models[tileName].name = tileName;
  });
}


///////////////////// Text label

function createLabel(name,cont){
  var el = document.createElement('div');
  el.dataset.label = name;
  el.classList.add('label');
  el.innerHTML = cont;

  return el;
} 
///////////////////// Grid Coordinates

function createGrid (dim,offset){
  var gridPos = [];
  for(var z=0;z<dim;z++){
    for(var x=0;x<dim;x++){
      gridPos.push({
        x : -(dim / 2 * offset) + x * offset,
        z : -(dim / 2 * offset) + z * offset,
        empty : true
      })
    }
  }

  return gridPos;

}


/////////////////////////////////////////////////////////////////////////// Globale Options

var global = {
  ready : false,
  models : {},
  selected : null
}
/////////////////////////////////////////////////////////////////////////// Setup


//__________ scene
var scene = new THREE.Scene();

//__________ camera
var camera = new THREE.PerspectiveCamera( 55, canvas_width/canvas_height, 0.1, 1000 );

  camera.position.set(0,20,20);

  scene.add(camera);
//__________ renderer

var renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true
    }); /// { alpha: true }
    renderer.setSize( canvas_width, canvas_height );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(main_color,1);

    backHolder.appendChild( renderer.domElement );






/////////////////////////////////////////////////////////////////////////// MESHES TO LOAD

var tiles = [
  'gras_copy',
  
  //Street

  'street',
  'corner',
  'cross',
  
  //Wood
  'wood_full',
  'wood_half',

  //River
  'river',
  'water',
  'water_half',
  'water_corner',
  'water_small_corner',
  'water_corner_inside',
  'water_quarter',
  'water_s',
  'water_island_1',

  //Buildings
  'house',
  'single_cross',
  'house_large',
  'power_1',

]

/////////////////////////////////////////////////////////////////////////// LOAD MESHES
var places = [];
///////////////////////////////////// Scenes first then all meshes
loadJSON(base_url_scenes + 'scene_2.json',function(data){
  

  places = data;
  
  tiles.forEach(function(t,index){
    loadTile(t);
  });


});




/////////////////////////////////////////////////////////////////////////// CREATE LABELS


function switchElement(el,type){
  //console.log(el.info,type)
  places[el.info.coor] = baseObj(type,el.info.coor,0);

  var mesh = global.models[type].clone();
    mesh.position.x = gridPositions[el.info.coor].x;
    mesh.position.z = gridPositions[el.info.coor].z;

    gridPositions[el.info.coor].empty = false;

    mesh.name = el.info.coor;
    mesh.selected = false;
    
    mesh.info = el.info;


    mesh.rotation.y = el.info.rot * Math.PI / 180;
    
    mesh.updateMatrix();
    mesh.matrixAutoUpdate = false;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add( mesh );

  var ol_index = Adjust.objects.indexOf(el);
  Adjust.objects[ol_index] = mesh;

  //console.log(Adjust.objects.indexOf(el));
 

  //remove old one
  scene.remove(el);
  //set new one
  global.selected = null;
}


/////////////////////////////////////////////////////////////////////////// Buttons

function createOptions(name){
  var el = document.createElement('button');
  var elSpan = document.createElement('span');
  var elImg = document.createElement('img');
  elImg.src = base_url_ico + name + '.png';
  el.dataset.type = name;
  el.classList.add('single_option');
  elSpan.innerHTML =  name ;
  el.appendChild(elSpan);
  el.appendChild(elImg);
  el.addEventListener('click',function(){

     // console.log('click,', global.selected.info.coor,this.dataset.type);
      if(global.selected !=null){
        switchElement(global.selected,this.dataset.type)
      }
      
  })
  return el;
} 

//////////////////////////////// Events for Meshes
/////////////////////////////////Mouseover
function over (el){

  if(global.lastMaterial==null){
    global.lastMaterial = el.material;
    el.material = new THREE.MeshPhongMaterial({
      color: 0xaaaaaa,
      shading:THREE.FlatShading
    });
  }

  

}
/////////////////////////////////Mouseout

function out (el){

  el.material = global.lastMaterial;
  
  global.lastMaterial = null;
}
/////////////////////////////////Mousedown

function activeState (el){
  //console.log(el.position);

  new TWEEN.Tween(controls.target)
    .to({ x: el.position.x, z: el.position.z }, 1000).start();
  
  if(global.selected === el){

      el.position.y = 0;
      el.updateMatrix();
      el.matrixAutoUpdate = false;
      el.selected = false;
      global.selected = null;
      infoBox.innerHTML = '';
    }
    else{
      if(global.selected != null){
        //reset selected
        global.selected.position.y = 0;
        global.selected.updateMatrix();
        global.selected.matrixAutoUpdate = false;
        global.selected.selected = false;
        infoBox.innerHTML = '';
      }
      //console.log('not the same');

      el.selected = true;
      global.selected = el;
      el.position.y = .1;
      el.updateMatrix();
      el.matrixAutoUpdate = false;
      infoBox.innerHTML = '<span>ID: ' + el.info.coor +'</span><span>Type: ' + el.info.obj + '</span><span>rotation: ' + el.info.rot + '</span>';
    }
 
  
  //console.log(el.info);
}


///////////////////////////////// City generator
function addSingleTile(opt){

  var mesh = global.models[opt.obj].clone();
    mesh.position.x = gridPositions[opt.coor].x;
    mesh.position.z = gridPositions[opt.coor].z;

    gridPositions[opt.coor].empty = false;

    mesh.name = opt.coor;
    mesh.selected = false;
    
    mesh.info = opt;


    mesh.rotation.y = opt.rot * Math.PI / 180;
    
    mesh.updateMatrix();
    mesh.matrixAutoUpdate = false;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add( mesh );
      
      //Add Object to activeObjects
    Adjust.addActiveObject(mesh,over,out,activeState,false);

    return mesh;
}

function generateCity(){

  var labelHolder = document.createElement('div');
      labelHolder.classList.add('labels');

  var optionsHolder = document.createElement('div');
      optionsHolder.classList.add('options');

    tiles.forEach(function(tile,index){
        optionsHolder.appendChild(createOptions(tile));
    });
  

  // Create Models

  // for(var p=0;p<gridPositions.length;p++){
  //   addSingleTile({
  //     obj : 'gras',
  //     coor : p,
  //     rot : randomRotation()
  //   });
    
  // }

  places.forEach(function(obj,index){
   addSingleTile(obj);
   labelHolder.appendChild(createLabel(obj.coor,obj.coor));     

  });
  document.body.appendChild(labelHolder);
  infoHolder.appendChild(optionsHolder);

  Adjust.addLabel('label');
}

///////////////////////////////// Create GridPositions



var gridPositions = createGrid(dimension,offset);



//__________ resize

window.onresize = function(){

  canvas_width = backHolder.offsetWidth;
  canvas_height = backHolder.offsetHeight ;

  camera.aspect = canvas_width / canvas_height;
  camera.updateProjectionMatrix();
  renderer.setSize( canvas_width, canvas_height );


  // Adjust
  Adjust.resize();
}



// Adjust
Adjust.init({
  camera : camera,
  holder : backHolder
});

//__________ controls

  controls = new THREE.OrbitControls( camera );

  controls.damping = 0.2;
  controls.maxPolarAngle = Math.PI/2;
  //controls.minPolarAngle = 1;
  controls.minDistance = 5;
  controls.maxDistance = 35;


//__________ light
var ambient = new THREE.AmbientLight(0xaaaaaa,1);
    scene.add(ambient);


var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set( 10,0,10 );
    spotLight.intensity = 1;
    spotLight.castShadow = true;
    spotLight.shadowMapWidth = 1024;
    spotLight.shadowMapHeight = 1024;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 5000;
    spotLight.shadowBias = -0.0001;
    var l = 50;

    spotLight.shadow.camera.left = l;
    spotLight.shadow.camera.right = -l;
    spotLight.shadow.camera.top = l;
    spotLight.shadow.camera.bottom = -l;
    camera.add(spotLight);



//__________ render
function render(time) { 
  requestAnimationFrame( render ); 
  animation(time);

  controls.update();
  renderer.render(scene, camera);
};

//__________ animation

function animation(time){
  TWEEN.update(time);
  Adjust.update();
};

//__________

render(time);



//}()); //__eof

