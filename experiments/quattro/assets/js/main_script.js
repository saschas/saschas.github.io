
/*
	Basic Setup
*/


//(function(){
var contains = function(needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
    var findNaN = needle !== needle;
    var indexOf;

    if(!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;

            for(i = 0; i < this.length; i++) {
                var item = this[i];

                if((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle) > -1;
};
//__________ Variables
var time = 0;
var main_color = 0xffffff;
var canvas_height = window.innerHeight;
var canvas_width = window.innerWidth;
var manager = new THREE.LoadingManager();
var nextButton = document.getElementById('next');
var startButton = document.getElementById('startButton');
var startDirectButton = document.getElementById('playDirect');
var startTutButton = document.getElementById('showTut');


var gameHolder = document.getElementById('gameHolder');
var sortMode = document.getElementsByClassName('sort');


var gamePos,gamePosW, gamePosB;
var tutorialHolder = document.getElementById('tutorial');

for(var b = 0;b<sortMode.length;b++){
  sortMode[b].addEventListener('click',function(){
    console.log(this.dataset.sortmode);

    global.teamOrder = this.dataset.sortmode;
    var team1 = [];
    var team2 = [];


    global.stones.team[1].forEach(function(s,i){
     // var opt = getTeam(s.info);
      s.__resetInfo();

      if(s.info.properties.team==1){
        team1.push(s);
      }
      else{
        team2.push(s);
      }
      //console.log(opt.team);
      //s.info.properties.team = opt.team;
    });
    global.stones.team[2].forEach(function(s,i){
      s.__resetInfo();
      if(s.info.properties.team==1){
        team1.push(s);
      }
      else{
        team2.push(s);
      }
      // var opt = getTeam(s.info)
      //s.info.properties.team = opt.team;
    });

      
    global.stones.team[1] = team1;
    global.stones.team[2] = team2;


    //console.log(global.stones.team[1]);
    init();
  },false);
}

function startTut(){
  slider.slide('right');
}

function startOption(){
  slider.slide(7);
}
function startGame(){
  tutorialHolder.classList.add('inGame');
   round();
}


startDirectButton.addEventListener('click',startOption)
startButton.addEventListener('click',startGame);
startTutButton.addEventListener('click',startTut);

var spielbrett;
var turnElement = document.getElementById('turn');
var global = {
  KITeam: 1,
  stones : {
    team : {
      1 : [],
      2 : []
    },
  },
  grid : {

  },
  gamePos :[],
  potRow : [], //potential next Fields (name)
  lastSelected : null,
  lastSelectedM : null,
  turn : 'KI',
  teamOrder : 'color',
  currStoneToPlace : null,
  currFieldToPlace : null,
  lastMat : null,
  edges : {}
}
var base_url = 'assets/json/';




manager.onProgress = function(mesh,loaded,index){
  console.log(mesh,loaded,index);
}

manager.onLoad = function(){
  init(); // START GAME

  new TWEEN.Tween(cam_helper.rotation)
        .to({ y: Math.PI/2 }, 2000).easing(TWEEN.Easing.Cubic.Out).start();
  new TWEEN.Tween(camera.position)
        .to({ x:0,y: 25,z:35 }, 2000).easing(TWEEN.Easing.Cubic.Out).start();
}


var slider = slidr.create('tutGallery', {
  after: function(e) { 
    if(e.in.slidr == 7){
      console.log('slide 7');

      tutorialHolder.classList.add('noBackground')
    }
    console.log('in: ' + e.in.slidr); },
  before: function(e) { console.log('out: ' + e.out.slidr); },
  breadcrumbs: true,
  controls: 'border',
  direction: 'horizontal',
  fade: false,
  keyboard: true,
  overflow: true,
  theme: '#222',
  timing: { 'cube': '0.5s ease-in' },
  touch: true,
  transition: 'fade'
});


slider.start();




var texture_base,cubemap;

var loader = new THREE.JSONLoader(manager);
//__________ scene
var scene = new THREE.Scene();
    //scene.fog = new THREE.Fog(main_color,20,50);
//__________ camera

var cam_helperGeo = new THREE.BoxGeometry(1,1,1);
var cam_helper = new THREE.Mesh(cam_helperGeo,new THREE.MeshBasicMaterial({visible:false}));

scene.add(cam_helper);

var camera = new THREE.PerspectiveCamera( 45, canvas_width/canvas_height, 0.1, 5000 );

  camera.position.set(0,25,35);
	cam_helper.add(camera);


Adjust.init({
  camera : camera,
  holder : gameHolder
})


//__________ renderer

sky_texture_base = 'assets/textures/skybox/';

    urls = [
      sky_texture_base +"px.png", sky_texture_base +"nx.png",
      sky_texture_base +"py.png", sky_texture_base +"ny.png",
      sky_texture_base +"pz.png", sky_texture_base +"nz.png"
    ];
    
    cubemap = THREE.ImageUtils.loadTextureCube(urls); // load textures
    cubemap.format = THREE.RGBFormat;
    cubemap.premultiplyAlpha = true;


//__________ Cube

// var skyGeo = new THREE.BoxGeometry(20,20,20);
// var skyMat = new THREE.MeshLambertMaterial({
//   color : 0xffffff,
//   map : cubemap
// });

// var sky = new THREE.Mesh(skyGeo,skyMat);
// scene.add(sky);

var renderer = new THREE.WebGLRenderer({ 
      alpha: true ,
      antialias: true

    }); /// { alpha: true }
    renderer.setSize( canvas_width, canvas_height );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(main_color,1);

    gameHolder.appendChild( renderer.domElement );

//__________ resize

window.onresize = function(){
  canvas_height = window.innerHeight;
  canvas_width = window.innerWidth;
  camera.aspect = canvas_width / canvas_height;
  camera.updateProjectionMatrix();
  renderer.setSize( canvas_width, canvas_height );
}

//__________ controls

  controls = new THREE.OrbitControls( camera );

  controls.damping = 0.2;
  controls.enabled = true;
  controls.maxPolarAngle = Math.PI/2;
  //controls.minPolarAngle = 1;
  //controls.minDistance = 100;
  //controls.maxDistance = 220;


//__________ light
var ambient = new THREE.AmbientLight(0x666666,1);
scene.add(ambient);


var hemiLight = new THREE.HemisphereLight( 0x333333, 0x00ff00, 0.6 );
 // scene.add(hemiLight);
// var spotLight = new THREE.SpotLight(0xffffff);
//     spotLight.position.set( -50, 500, -50 );
//     spotLight.intensity = 1;
//     spotLight.castShadow = true;

//     spotLight.shadowMapWidth = 1024;
//     spotLight.shadowMapHeight = 1024;
//     var l = 50;
//     spotLight.shadowBias = -.00001;
//     spotLight.shadowCameraLeft = l;
//     spotLight.shadowCameraRight = -l;
//     spotLight.shadowCameraTop = l;
//     spotLight.shadowCameraBottom = -l;
//     camera.add(spotLight);


var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-20,30, 0);
    spotLight.shadowBias = -.000001;
    spotLight.intensity = 1.3;
    spotLight.castShadow = true;
    spotLight.shadowMapWidth = 1024;
    spotLight.shadowMapHeight = 1024;
    spotLight.shadowCameraNear = 1;
    spotLight.shadowCameraFar = 5000;
var l = 10;
    spotLight.shadowCameraLeft = l;
    spotLight.shadowCameraRight = -l;
    spotLight.shadowCameraTop = l;
    spotLight.shadowCameraBottom = -l;

    camera.add(spotLight);


//__________________________________________________

function generateGrid(pos,count,gap){
  var po = [];
  var internalCounter = 0;
  for(var z = 0;z < count;z++){
    for(var x = 0;x < count;x++){

      po.push({
        x : pos.x + -(gap * 1.5) + (x * gap),
        z : pos.z + -(gap * 1.5) + (z * gap),
        empty : true,
        props : null,
        id : internalCounter
      });

      internalCounter++;
    }
  }

  return po;
}



//____________________________________________________________


var groundGeo = new THREE.PlaneBufferGeometry(230,120,32,32);

var groundMat = new THREE.MeshPhongMaterial({
  color : main_color,
  envMap : cubemap,
  transparent:true,
  opacity:.2,
  side : THREE.DoubleSide
});

var window_left = new THREE.Mesh(groundGeo,groundMat);

window_left.rotation.y = -90 * Math.PI / 180;
window_left.position.y = 50;
window_left.position.x = 110;
 //mirrorCubeCamera.position = ground.position;
window_left.receiveShadow = true;
window_left.castShadow = true;

var window_right = window_left.clone();
window_right.position.x = -110;
scene.add(window_left);
scene.add(window_right);


//__________ cubes


var stonesToLoad = [
  'q_t_e',
  'q_t_f',
  'r_t_e',
  'r_t_f',
  'q_s_e',
  'q_s_f',
  'r_s_e',
  'r_s_f',
]

//__________________________________________________ Next Button 

nextButton.addEventListener('click',function(){

  checkGrid();

  switch(global.turn){
    case 'USER':
      if(global.currFieldToPlace === null){
        console.log('please select field for your stone');
      }else{

        console.log('placed = > next Player KI');
        resetStone();
        round();
      }

    break;

    case 'USERchoose':
      if(global.currStoneToPlace!=null){
        global.turn = 'KI';
        round();
      }
      else{
        console.log('please choose a stone for KI!');
        
      }

    break;
    // case 'KI':
    //   console.log(round);
    // break;

  }
  
});


//__________________________________________________
function getEmpty(){

  var buildSuccessEmpty = []
  global.potRow.forEach(function(p,index){
    p.forEach(function(val){
      if(!contains.call(buildSuccessEmpty,val) && gamePos[val].empty){
        buildSuccessEmpty.push(val);
      }
    })
  })

  console.log('buildSuccessEmpty',global.potRow,buildSuccessEmpty);

  // var emptyFields = [];
  // gamePos.forEach(function(t){
  //     if(t.empty){
  //       emptyFields.push(t.id);
  //     }
  // });

  return buildSuccessEmpty;

}
function KIsetStone(){


  var potentialNextFields = getEmpty();

  //console.log('KIsetStone',potentialNextFields,global.currStoneToPlace);
  var nextField = potentialNextFields[Math.ceil( Math.random() * potentialNextFields.length-1 )];

  //makeStoneActive(global.currStoneToPlace)


  //console.log('placeStoneOnField',global.gamePos[nextField].id);

  //console.log(global.gamePos[nextField],global.currStoneToPlace);




  placeStoneOnField(global.gamePos[nextField]);


}


function gameWin(i,reason){

  console.log('Winner is',global.turn, i,reason);

  switch (reason){
    //filled
    case 'e':
      turnElement.innerHTML = ('Winner is ' + global.turn + ' because all stones in row ' + i +' have empty holes.');
    break; 
    case 'f':
      turnElement.innerHTML = ('Winner is ' + global.turn + ' because all stones in row ' + i +'  have filled holes');
    break; 
    //color
    case 'b':
      turnElement.innerHTML = ('Winner is ' + global.turn + ' because all stones in row ' + i +' are black.');
    break;
    case 'w':
      turnElement.innerHTML = ('Winner is ' + global.turn + ' because all stones in row ' + i +' are white.');
    break;
    //height
    case 's':
      turnElement.innerHTML = ('Winner is ' + global.turn + ' because all stones in row ' + i +' are small.');
    break;
    case 't':
      turnElement.innerHTML = ('Winner is ' + global.turn + ' because all stones in row ' + i +' are tall.');
    break; 
    case 'q':
      turnElement.innerHTML = ('Winner is ' + global.turn + ' because all stones in row ' + i +' are cubic.');
    break;
    case 'r':
      turnElement.innerHTML = ('Winner is ' + global.turn + ' because all stones in row ' + i +' are round.');
    break;
  }

  restart();

}




function restart() {


  showWin();

    var team1 = [];
    var team2 = [];


    global.stones.team[1].forEach(function(s,i){
     // var opt = getTeam(s.info);
      s.__resetInfo();

      if(s.info.properties.team==1){
        team1.push(s);
      }
      else{
        team2.push(s);
      }
      //console.log(opt.team);
      //s.info.properties.team = opt.team;
    });
    global.stones.team[2].forEach(function(s,i){
      s.__resetInfo();
      if(s.info.properties.team==1){
        team1.push(s);
      }
      else{
        team2.push(s);
      }
      // var opt = getTeam(s.info)
      //s.info.properties.team = opt.team;
    });

      
    global.stones.team[1] = team1;
    global.stones.team[2] = team2;


  var index = 0;
  for(st in global.stones.team[1]){
    new TWEEN.Tween(global.stones.team[1][st].position)
        .to({ 
          x: gamePosW[index].x, 
          y : -.5,
          z: gamePosW[index].z 
        }, 1000).start();
      global.stones.team[1][st].tutMode = false;
      gamePos.forEach(function(p,index){
        p.empty = true;
        p.props = null;
      });
    index++;
  }

  for(st in global.stones.team[2]){
    new TWEEN.Tween(global.stones.team[2][st].position)
        .to({ 
          x: gamePosB[index].x, 
          y : -.5,
          z: gamePosB[index].z 
        }, 1000).start();

    global.stones.team[1][st].tutMode = false;
    global.stones.team[2][st].position.y = -.5;

      gamePos.forEach(function(p,index){
        p.empty = true;
        p.props = null;
      });
    index++;
  }


  gamePos.forEach(function(p,index){

    global.gamePos[index].rotation.x = -90 * Math.PI / 180;
    global.gamePos[index].position.x = p.x;
    global.gamePos[index].position.y = 0;
    global.gamePos[index].position.z = p.z;
    global.gamePos[index].name = index;
    global.gamePos[index].info = {
      type : 'gamePos',
      id : index,
      empty : true,
      props : {}
    };
  });


  console.log(global.currStoneToPlace,global.currFieldToPlace,global.turn);



}





function checkGrid(){

  /************************************************************/
  
  var colRowMatrix = [];
  
  var emptyFields = [];
  var checkProperties = [
  'color',
  'filled',
  'height', 
  'shape'
  ]

  function collectSingleProperty(collection,ids){
    var masterColl = {};
    masterColl._ids = ids;
    

    var collectionResult = collection.map(function(obj){
      //wenn ein feld belegt ist sind die props > object
      //console.log(obj);
      if(obj.props!=null){         
         for(key in obj.props){
           //only if Property is relevant
           if(contains.call(checkProperties,key)){

             var _dirty_key = obj.props[key];
            //wenn der key schon existiert
                if (masterColl.hasOwnProperty(_dirty_key)) {
                  masterColl[_dirty_key] += 1;


                  if(masterColl[_dirty_key] == 4){
                    gameWin(ids,_dirty_key);
                    return;
                  }
                }else{
                  masterColl[_dirty_key] = 1;                
                }
            }
          }
      }

       return obj;
    });
   
    return masterColl;
  }

  function checkRowH(num){
    var rowH = [];
    var internal = num;
    var __ids = []
    for(var i=num; i< (num + 4);i++){
      rowH.push(gamePos[i]);    
      __ids.push(i);  
    }
    return collectSingleProperty(rowH, __ids);
  }

  function checkRowV(num){
    var rowV = [];
    var internal = num;
    var __ids = []
    for(var i=num;i< 16;i+=4){
      rowV.push(gamePos[i]);      
      __ids.push(i);  
    }
    return collectSingleProperty(rowV,__ids);
  }

  var crossX = collectSingleProperty([
      gamePos[0],
      gamePos[5],
      gamePos[10],
      gamePos[15],
    ],[0,5,10,15]);
  var crossY = collectSingleProperty([
      gamePos[3],
      gamePos[6],
      gamePos[9],
      gamePos[12],
    ],[3,6,9,12]),
    

  colRowMatrix = [
    checkRowH(0),
    checkRowH(4),
    checkRowH(8),
    checkRowH(12),

    checkRowV(0),
    checkRowV(1),
    checkRowV(2),
    checkRowV(3),
    crossX,
    crossY
    
    //0,5,10,15
  ]

 //console.log(colRowMatrix[0][0],global.currStoneToPlace.info.properties)

//  Object {
//   q: 1, 
//   s: 2, 
//   e: 2, 
//   b: 2, 
//   r: 1
// } , name

// w,
// f,
// s,
// r

var successMatrixStone = {};
var minMax = 0;

var properties = global.currStoneToPlace.info.properties;
global.potRow = [];
for(prop in global.currStoneToPlace.info.properties){
  colRowMatrix.map(function(rowCol){
      //if own stone has properties in rowCol
      if(rowCol.hasOwnProperty(properties[prop])){
        if(minMax <= rowCol[properties[prop]]){

          console.log(rowCol);
          minMax = rowCol[properties[prop]];
         
          if(!contains.call(global.potRow,rowCol._ids)){


            global.potRow.push(rowCol._ids)
            console.log(global.potRow );
          }
        }

      }
    
  });
  
  
}

/************************************************************/
}





function placeStoneOnField(field){
  //reset Field in case el changed
  if(global.currFieldToPlace != null){
    
    gamePos[global.currFieldToPlace.info.id].props = null;
    gamePos[global.currFieldToPlace.info.id].empty = true;
    
    global.currFieldToPlace.info.empty = true;
    global.currFieldToPlace.info.props = {};
  }

  //set active Field
  global.currFieldToPlace = field;
  //set stone Position
  var diffMax = Math.abs(global.currStoneToPlace.position.z - field.position.z) / 2;
  new TWEEN.Tween({
    x : global.currStoneToPlace.position.x,
    z : global.currStoneToPlace.position.z,
  }).to(field.position, 1000).start().onUpdate(function(){

          var wayToGo = Math.abs(field.position.z-this.z);
          global.currStoneToPlace.position.x = this.x;
          global.currStoneToPlace.position.z = this.z;

          if(wayToGo > diffMax ){
            global.currStoneToPlace.position.y += .1
          }
          else{
            if(global.currStoneToPlace.position.y>0.2){
              global.currStoneToPlace.position.y -= .1
            }
          }

        }).onComplete(function(){
          
          if(global.turn == 'KI'){
            checkGrid();
            resetStone();

            getNextRandomStone(2);
            global.turn = 'USER';

            turnElement.innerHTML = 'Place your stone';
            turnElement.dataset.turn = global.turn;
            round();


          }

        });


  //global.currStoneToPlace.position.copy(field.position);

  global.currStoneToPlace.info.properties.placed = true;

  //set Field Options -> Array [index] = {props,empty,x,y}
  gamePos[global.currFieldToPlace.info.id].props = global.currStoneToPlace.info.properties;
  gamePos[global.currFieldToPlace.info.id].empty = false;
  //set field props directly
  field.info.empty = false;
  field.info.props = global.currStoneToPlace.info.properties;
}


function resetStone(){
  var el = global.currStoneToPlace;
  global.edges[el.info.name+ '_' + el.info.properties.color].material.visible = false;
  global.currStoneToPlace.material.materials[0].specular = global.lastMat;
  global.currStoneToPlace.material.materials[0].shininess = 60;
  global.currStoneToPlace = null;
  global.currFieldToPlace = null;
  global.lastMat = null;
  global.lastSelected = null;
  global.lastSelectedM = null;
}


//Mouseover Function
function over (el){
  //console.log(el);
  
  switch(el.info.type){
    case 'gamePos':
      if(el.info.empty){
        new TWEEN.Tween({opacity:0})
        .to({ opacity: .5 }, 400).easing(TWEEN.Easing.Cubic.Out).onUpdate(function(){
          el.material.opacity = this.opacity;
        }).start();
        el.position.y = .1;
      }
    break;
  }

}
//Mouseout Function
function out (el){
 
  switch(el.info.type){
    case 'gamePos':
        el.material.opacity = 0;
        el.position.y = 0;
      
    break;
  }
}
//Mousedown Function
function activeState (el){

  switch(el.info.type){
    case 'stone':
      switch (global.turn){
        case 'USERchoose':          
            if(el.info.properties.team == global.KITeam && !el.info.properties.placed){
              if(global.currStoneToPlace!=null){
                resetStone();
              }
              makeStoneActive(el);
            }else{
              turnElement.innerHTML = 'not the right team or already placed';
              turnElement.dataset.turn = global.turn;
              console.log('not the right team or already placed');
            }
        break; 

      }
      if(global.currStoneToPlace===null){
        switch(global.turn){  
          case 'USER':
            turnElement.innerHTML = 'Place your stone';
            turnElement.dataset.turn = global.turn;
            console.log('USERs turn');
          break;
          case 'KI':
            turnElement.innerHTML = 'KIs turn';
            turnElement.dataset.turn = global.turn;
            console.log('KIs turn');
          break;
        }
      }else{

        //turnElement.innerHTML = global.turn;

        console.log('place stone')
      }
    break;
    //Click on a Gamefield
    case 'gamePos':
      // Based on Turn
      switch(global.turn){  
        case 'USER':
          
          if(global.currStoneToPlace !=null){
            placeStoneOnField(el);
          }else{
            console.log('please choose a stone for KI')
          }
        break;
        case 'KI':
          console.log('KIs turn');
        break;
      }

    break;
  }
}


function makeStoneActive(el){
    global.currStoneToPlace = el;
    global.lastMat = new THREE.Color(0x222222);//global.currStoneToPlace.material.materials[0].color;
    global.currStoneToPlace.material.materials[0].specular = new THREE.Color(0xff0000);
    global.currStoneToPlace.material.materials[0].shininess = 0;
    global.currStoneToPlace.selected = true;
    global.edges[el.info.name+ '_' + el.info.properties.color].material.visible = true;
    console.log(global.edges[el.info.name+ '_' + el.info.properties.color].material.visible = true);
}


function getNextRandomStone(teamNo){

  var potentialNextFields = [];
  global.stones.team[teamNo].forEach(function(s,index){
    if(!s.info.properties.placed){
      potentialNextFields.push(s);
    }
  });
  if(potentialNextFields.length === 0){
    console.log('UNENTSCHIEDEN');

    return;
  }
  var rand = Math.ceil(Math.random() * potentialNextFields.length-1);
  var teamNo_ = teamNo;

    makeStoneActive(potentialNextFields[rand]);
    return global.currStoneToPlace;

} 



function round(){
  console.log('round',global.currStoneToPlace);
  if(global.currStoneToPlace != null){
    switch(global.turn){
      case 'KI':
        new TWEEN.Tween(cam_helper.rotation)
        .to({ y: Math.PI }, 1000).start();
        KIsetStone();
      break;

      case 'USER':
      break;
    }

    console.log('currStoneToPlace is', global.currStoneToPlace);
  }else{

    switch(global.turn){
      case 'KI':

        // KI searches for next Stone based on Team
        getNextRandomStone(2);
        //place Camera
        new TWEEN.Tween(cam_helper.rotation)
        .to({ y: Math.PI }, 1000).start();
        new TWEEN.Tween(camera.position)
        .to({ x:0,y:20,z: 10 }, 1000).start();

        global.turn = 'USER';


        //restart round
        round();
      break;
      case 'USER':
      //rotate Camera to KI 
        new TWEEN.Tween(cam_helper.rotation)
        .to({ y: 0 }, 1000).start();
         new TWEEN.Tween(camera.position)
        .to({ x:0,y:20,z: 10 }, 1000).start();
        global.turn = 'USERchoose';
        turnElement.innerHTML = 'CHOOSE A STONE FOR KI';
        turnElement.dataset.turn = global.turn;
        console.log('USER CAN CHOOSE STONE FOR KI');
      break;
    }
  }



}///




function getTeam(opt){
  console.log(opt);
      var team = 0;
      switch (global.teamOrder){
        case 'color':
          if(opt.color === 'w'){
            team = 1;
          }else{
            team = 2;
          }
        break;
        case 'height':
          if(opt.height === 't'){
            team = 1;
          }else{
            team = 2;
          }
        break;

        case 'filled':
          if(opt.filled === 'f'){
            team = 1;
          }else{
            team = 2;
          }
        break;
        case 'shape':
          if(opt.shape === 'r'){
            team = 1;
          }else{
            team = 2;
          }
        break;

      }

      opt.team = team;
      return opt;
    }
    function getProperties(name,color){
      var props = name.split('_');

      var properties = {
        shape : props[0],
        height : props[1],
        filled : props[2],
        color : color,
        placed : false
      }

      var realProps = getTeam(properties);

      return realProps;
    }


    ///


var textureLoader = new THREE.TextureLoader();
var base_url_texture = 'assets/textures/';
function loadPieces(name) {
  var piece = name;
  textureLoader.load(base_url_texture+'wood_bump.jpg',function(bumpT){
  textureLoader.load(base_url_texture+'wood.jpg',function(texture){
  loader.load(base_url + piece + '.json',function(geometry){
    
    var base_w = new THREE.Mesh(geometry,new THREE.MeshFaceMaterial([
      new THREE.MeshPhongMaterial({
        color : 0xffffff,
        map : texture,
        bumpMap : bumpT,
        bumpScale : .1,
        envMap : cubemap,
        reflectivity : .1,
        shininess : 60,
      })
      ]));

    var base_b = new THREE.Mesh(geometry,new THREE.MeshFaceMaterial([
      new THREE.MeshPhongMaterial({
        color : 0x222222,
        map : texture,
        bumpMap : bumpT,
        bumpScale : .1,
        envMap : cubemap,
        reflectivity : .1,
        shininess : 60,
      })
      ]));
    var baseMesh_w = base_w.clone();
    var baseMesh_b = base_b.clone();


    

    baseMesh_b.name = piece + '_b';    
    baseMesh_b.info = {
      type : 'stone',
      name : piece,
      properties : getProperties(piece,'b')
    }

    baseMesh_b.__resetInfo = function(){
      this.info.type = 'stone';
      this.info.name = piece;
      this.info.properties = getProperties(piece,'b');
    }
    baseMesh_w.name = piece + '_w';
    baseMesh_w.info = {
      type : 'stone',
      name : piece,
      properties : getProperties(piece,'w')
    }
    baseMesh_w.__resetInfo = function(){
      this.info.type = 'stone';
      this.info.name = piece;
      this.info.properties = getProperties(piece,'w');
    }

    baseMesh_w.receiveShadow = true;
    baseMesh_w.castShadow = true;

    baseMesh_b.receiveShadow = true;
    baseMesh_b.castShadow = true;


    //global.stones.w[piece] = baseMesh_w;
    //global.stones.b[piece] = baseMesh_b;
    var nameB = piece + '_w';
    var nameW = piece + '_b';

    

    global.edges[nameW] = new THREE.EdgesHelper(baseMesh_b,0xffffff);
    global.edges[nameB] = new THREE.EdgesHelper(baseMesh_w,0x000000);

    global.edges[nameW].material.linewidth = 3;
    global.edges[nameW].material.opacity = .5;
    global.edges[nameW].material.transparent = true;
    global.edges[nameW].material.visible = false;

    global.edges[nameB].material.linewidth = 3;
    global.edges[nameB].material.opacity = .5;
    global.edges[nameB].material.transparent = true;
    global.edges[nameB].material.visible = false;


    global.edges[nameW].name = piece + '_w';
    global.edges[nameB].name = piece + '_b'; 
    scene.add(global.edges[nameW]);
    scene.add(global.edges[nameB]);

    global.stones.team[baseMesh_w.info.properties.team].push(baseMesh_w);
    global.stones.team[baseMesh_b.info.properties.team].push(baseMesh_b);


    //Add Object to activeObjects
    Adjust.addActiveObject(baseMesh_w,over,out,activeState,false);
    Adjust.addActiveObject(baseMesh_b,over,out,activeState,false);
  });//end of loader

  });//end of textureLoader
});//end of textureLoader bump
}
  

  ///________________________________________________________________________

  
  textureLoader.load(base_url_texture+'spielbrett_spec.jpg',function(spec){
  textureLoader.load(base_url_texture+'spielbrett_normal.jpg',function(bump){
    textureLoader.load(base_url_texture+'spielbrett.jpg',function(texture){
      loader.load(base_url + 'spielbrett.json',function(geometry,material){
        material.forEach(function(m,index){
          m.color = new THREE.Color(0xcccccc);
          m.shading = THREE.FlatShading;
          m.map = texture;
          m.bumpMap = bump;
          m.bumpScale = .03;
          m.specularMap = spec;
          m.shininess = 80;
          m.envMap = cubemap;
          m.specular = new THREE.Color(0xaaaaaa);
        })
        spielbrett = new THREE.Mesh(geometry,new THREE.MeshFaceMaterial(material));
        spielbrett.receiveShadow = true;
        spielbrett.castShadow = true;

        scene.add(spielbrett);
      });
    });
  });
  });

  ///________________________________________________________________________

  
  textureLoader.load(base_url_texture+'room_spec.jpg',function(room_spec){
    textureLoader.load(base_url_texture+'room.jpg',function(room){
        loader.load(base_url + 'room.json',function(geometry,material){
          material.forEach(function(m,index){
            m.color = new THREE.Color(0xffffff);
            m.shading = THREE.FlatShading;
            m.shininess = 10;
            m.specularMap = room_spec;
            m.map = room;
            m.bumpMap = room;
            m.bumpScale = .01;
            m.envMap = cubemap;

          })
          room = new THREE.Mesh(geometry,new THREE.MeshFaceMaterial(material));
          room.receiveShadow = true;
          room.castShadow = true;

          scene.add(room);
        });
    });
  });


///________________________________________________________________________

  
  textureLoader.load(base_url_texture+'desk.jpg',function(desk){
        loader.load(base_url + 'desk.json',function(geometry,material){
          material.forEach(function(m,index){
            m.color = new THREE.Color(0xffffff);
            m.shading = THREE.FlatShading;
            m.shininess = 10;
            m.map = desk;
            m.bumpMap = desk;
            m.bumpScale = .1;
            m.specularMap = desk;
            m.envMap = cubemap;

          })
          desk = new THREE.Mesh(geometry,new THREE.MeshFaceMaterial(material));
          desk.receiveShadow = true;
          desk.castShadow = true;

          scene.add(desk);
        });
    });


  ///________________________________________________________________________

  
  textureLoader.load(base_url_texture+'sky.jpg',function(room){
      loader.load(base_url + 'sky.json',function(geometry,material){
        material.forEach(function(m,index){
          m.color = new THREE.Color(0xffffff);
          m.emissive = new THREE.Color(0xaaaaaa);
          m.shading = THREE.SmoothShading;
          m.shininess = 0;
          m.map = room;
          m.envMap = cubemap;
          m.specular = new THREE.Color(0x000000);
        })
        sky = new THREE.Mesh(geometry,new THREE.MeshFaceMaterial(material));
        
        scene.add(sky);
      });
  });



  ///________________________________________________________________________



stonesToLoad.forEach(function(p,index){
  loadPieces(p);
});

var ico_url = 'assets/textures/ico/';
function createLabel(name,content){
var el = document.createElement('div');
    el.classList.add('label');
    el.dataset.label = name;
    el.dataset.offsety = -2;

var ico = document.createElement('img');
    ico.classList.add('ico_stone')
var props = document.createElement('div');
    props.classList.add('props');

    ico.src = ico_url + name +'.png';//+'_'+content.properties.color;
    el.appendChild(ico);
    var spanEl = [];
    var i =0;
    var translation = '';
    for(key in content.properties){
      if(key != 'team' && key != 'placed'){
        spanEl[i] = document.createElement('span');

        switch (content.properties[key]){
          case 'q':
            translation = 'cube';
          break;
          case 'r':
            translation = 'round';
          break;
          case 'e':
            translation = 'not filled';
          break; 
          case 'f':
            translation = 'filled';
          break;
          case 's':
            translation = 'small';
          break;
          case 't':
            translation = 'tall';
          break; 
          case 'b':
            translation = 'black';
          break; 
          case 'w':
            translation = 'white';
          break;
        }
        spanEl[i].innerHTML = key + ' : ' + translation;
        props.appendChild(spanEl[i]);
      }
      i++
    }
    el.appendChild(props);
    //el.innerHTML = content;
    return el;
}


function _updateStone(t){
  this.rotation.x += Math.sin(t);
}



gamePos = generateGrid({x:0,z:0},4,1.3);
gamePosW = generateGrid({x:0,z:8},4,1.3);
gamePosB = generateGrid({x:0,z:-8},4,1.3);

function init(){

  
  
  var index = 0;
  for(st in global.stones.team[1]){
    

    new TWEEN.Tween(global.stones.team[1][st].position)
        .to({ 
          x: gamePosW[index].x, 
          y : -.5,
          z: gamePosW[index].z 
        }, 1000).start();


    //global.stones.team[1][st].position.x = gamePosW[index].x;
    //global.stones.team[1][st].position.z = gamePosW[index].z;
    //global.stones.team[1][st].position.y = -.25;

    global.stones.team[1][st].tutMode = false;
    if(global.stones.team[1][st].parent === null){
      scene.add(global.stones.team[1][st]);
      tutorialHolder.appendChild(createLabel(global.stones.team[1][st].info.name+ '_w',global.stones.team[1][st].info));
      global.stones.team[1][st].update = function(t){

        this.rotateY(0.01);
       //this.rotateY(Math.sin(0.0005  * t))
      };
    }
    else{
      //global.stones.team[1][st].__resetInfo();

      gamePos.forEach(function(p,index){
        p.empty = true;
        p.props = null;
      });
      //console.log(global.stones.team[1][st].__resetInfo)
    }
    index ++;

  }

  for(st in global.stones.team[2]){
    
    new TWEEN.Tween(global.stones.team[2][st].position)
        .to({ 
          x: gamePosB[index].x, 
          y : -.5,
          z: gamePosB[index].z 
        }, 1000).start();

    global.stones.team[1][st].tutMode = false;
    global.stones.team[2][st].position.y = -.5;
    if(global.stones.team[2][st].parent === null){
      scene.add(global.stones.team[2][st]);
      tutorialHolder.appendChild(createLabel(global.stones.team[2][st].info.name + '_b',global.stones.team[2][st].info));
      global.stones.team[2][st].update = function(t){
        this.rotateY(0.01);
        //this.rotateY(Math.sin(0.0005  * t))
      };
    }
    else{
      gamePos.forEach(function(p,index){
        p.empty = true;
        p.props = null;
      });
      //global.stones.team[1][st].__resetInfo();
    }
    index ++;
  }


  Adjust.addLabel('label');

  gamePos.forEach(function(p,index){

    var gamePosMat = new THREE.MeshBasicMaterial({transparent:true,opacity:0});
    var gamePosGeo = new THREE.PlaneBufferGeometry(1,1,1,1);
    global.gamePos[index]= new THREE.Mesh(gamePosGeo,gamePosMat);
    global.gamePos[index].rotation.x = -90 * Math.PI / 180;
    global.gamePos[index].position.x = p.x;
    global.gamePos[index].position.y = 0;
    global.gamePos[index].position.z = p.z;
    global.gamePos[index].name = index;
    global.gamePos[index].info = {
      type : 'gamePos',
      id : index,
      empty : true,
      props : {}
    };

    Adjust.addActiveObject(global.gamePos[index],over,out,activeState,false);
    scene.add(global.gamePos[index]);
  });



  
}


//__________ render
var render = function (time) { 
  requestAnimationFrame( render ); 
  animation(time);
  TWEEN.update(time)
  Adjust.update();
  controls.update();
  renderer.render(scene, camera);
};

//__________ animation

function animation(time){


  if(typeof global.stones.team != 'undefined'){
    global.stones.team[1].forEach(function(t,index){
     // t.forEach(function(s,index){
        if(t.tutMode){
          t.update(t);
        }
     // });
    });
    global.stones.team[2].forEach(function(t,index){
     // t.forEach(function(s,index){
        if(t.tutMode){
          t.update(t);
        }
     // });
    });
  }
  // scene.rotation.y  -= .0005;
};

//__________

document.body.classList.add('ready');
  render();



//}()); //__eof

