/*


  TABLE OF CONTENT

  |--global variables
  |
  |--team settings
  |
  |--helper functions
  |
  |--threejs setup
  |
  |--init adjust 
  |
  |--game logic
  |
  |--game init after geometry is loaded
  |
  |--load geometry
  |
  |--render setup
  |
  |--events
  |
  |--kick off


*/

//(function(){
//__________________________________________ Global variables
var renderer,
    //Main Color
    loader,
    //Scene Setup
    scene,camera,renderer,controls,
    //Lights
    spotLight,
    //Objects
    stone;

    var main_color = 0xffffff;
    var last_color = null;
    var canvas_height = window.innerHeight;
    var canvas_width = window.innerWidth;

var excludeFields = [
  
  0,1,2,3,4,5,7,8,9,10,11,12,
  13,14,15,16,17,20,21,22,23,24,25,
  26,27,28,29,30,34,35,36,37,38,
  39,40,41,42,47,48,49,50,51,
  78,77,90,91,102,103,104,105,,115,116,
  117,128,129,
  130,142,155,169,170,171,172,177,178,179,180,181,
  182,183,184,185,186,190,191,192,193,194,
  195,196,197,198,199,202,203,204,205,206,207,
  208,209,210,211,212,213,215,216,217,218,219,220

]


//__________________________________________ TEAM SETTINGS
/**
  Start Positions and colors 
  for Teams
*/

// Holds the stones when geometry is loaded
// teamHolder.TEAMNAME

var gameOptions = {
  readyForNextPlayer : false
}

var teamHolder = {}
var fieldHolder = {};

var teamOptions = {
  team1 : {
    coor : [6,18,19,31,32,33,43,44,45,46,56,57,58,59,60],
    color : 0xff0000
  },
  team2 : {
    coor : [160,161,162,163,164,173,174,175,176,187,188,189,200,201,214],
    color : 0x00ff00
  }
}

document.body.dataset.team = 'team2';
//__________________________________________ Helper Functions


function createPositions() {
  var pos = [];
  var index = 0;
  for(var z =0;z<17;z++){
    for(var x =0;x<13;x++){
      pos[index] = {
        x : x * 1.28 - 7.65, 
        y : 0,
        z : z * 1.095 - 8.75
      }
      if(z % 2){
        pos[index].x += .64;
      }

      index++;
    }
  }
  return pos;
}


//Create Single Label
function createLabel(name,index,pos){
  
  var planeGeo = new THREE.PlaneBufferGeometry(1,1,1,1);
  var planeMaterial = new THREE.MeshBasicMaterial
  var el = document.createElement('div');  
      el.dataset.x = pos.x;
      el.dataset.y = pos.y;
      el.dataset.z = pos.z;
      el.dataset.id = index;
      el.dataset.empty = true;
      el.classList.add(name);
      el.innerHTML = index;

      if(excludeFields.indexOf(index) > -1){
        el.classList.add('noGamePosition');
      }
      document.body.appendChild(el);
      //click on field
      el.addEventListener('click', function (){
        var _id = parseFloat(this.dataset.id);

                if(activeElement != null && this.dataset.markAsPotential==='true'){


                  console.log(_id,activeElement.customProperties.gameID, gameOptions.potentials);



                  resetGameFields();
                  var ol_pos = activeElement.position;

                  function distance(start,target){
                    var _x = Math.abs(start.x - target.x);
                    var _z = Math.abs(start.z - target.z);

                      return (_x + _z).toFixed(2);
                  } 
                  var max_dist = distance(activeElement.position,gamePositions[_id]);
                  var dist;
                  console.log(dist);
                  new TWEEN.Tween(activeElement.position)
                    .to(gamePositions[_id], 1000).onUpdate(function() {
                      //activeElement.position += .01
                      dist = distance(activeElement.position,gamePositions[_id]);

                      //activeElement.position.y += 1;
                      console.log(100 - (dist * 100 / max_dist).toFixed(2));
                      //console.log(this,gamePositions[activeElement.customProperties.gameID])
                    }).onComplete(function() {
                      if(activeElement!=null){

                        fieldHolder[activeElement.customProperties.gameID].dataset.empty = true;
                        fieldHolder[_id].dataset.empty = false;
                        activeElement.customProperties.gameID = _id;
                        activeElement.material.color = activeElement.customProperties.last_color;
                        //
                        checkWin();
                        activeTeam = changeTeam(activeElement.customProperties.team);                    

                      }        
                    }).start();
                }
        
      },false);

      return el;
  
}



//Create LabelGrid
function createGrid(pos){
  pos.forEach(function (coor,index){
    fieldHolder[index] = createLabel('gameCoordinate',index,coor);
  });
  //Make label active
  Adjust.addPoints('gameCoordinate');
}

//__________________________________________ THREEJS Setup

//__________ scene

  scene = new THREE.Scene();
//__________ camera
var camera_helper = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial({
  transparent: true,
  opacity : 0
}));

scene.add(camera_helper);

  camera = new THREE.PerspectiveCamera( 15, canvas_width/canvas_height,12, 100 );
  camera.position.set(0,50,-50);
	camera_helper.add(camera);
//__________ renderer

  renderer = new THREE.WebGLRenderer({ 
      alpha: true ,
      antialias: true
  });
  renderer.setSize( canvas_width, canvas_height );
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(main_color,1);

  document.body.appendChild( renderer.domElement );

//__________________________________________ INIT ADJUST

Adjust.init(camera);




//__________ controls

  controls = new THREE.OrbitControls( camera );
  controls.damping = 0.2;
  controls.enabled = true;

//__________ Ambientlight
  
var ambient = new THREE.AmbientLight(0x333333,1);
    scene.add(ambient);
//__________ light

  spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set( 0, 10, 0 );
  spotLight.intensity = 1;
  spotLight.castShadow = true;
  camera.add(spotLight);

//__________ Loader

loader = new THREE.JSONLoader();

//__________ CREATE GAME POSITIONS


var gamePositions = createPositions();

//CREATE Labels based on gamePositions;
  createGrid(gamePositions);

//__________________________________________ GAME LOGIC

var activeElement = null;
var activeTeam = "team1";
var potentials = [];
var noPotentials = [];

function getPotentials(ID){
  var potentialFields = [];

  function getfields(ID){
    var corrector = 1 - Math.ceil(ID/13) % 2;

    var pot = [
      ID-1, //31
      ID+1, //33
      ID-14 + corrector, //18
      ID-13 + corrector, //19
      ID+12 + corrector, //44
      ID+13 + corrector // 45
    ];
    return pot;
  }
 

  function evaluateNeighbor(baseID,toProof,arr) {
    arr.forEach(function(fieldID,index) {
      if(fieldID>0&&fieldID<220 && fieldHolder[fieldID].dataset.empty === "true"){
        var checker = fieldID-baseID;
        checker = Math.abs(checker);

        if(excludeFields.indexOf(fieldID) == -1){
          if(Math.abs(checker) == 2 || checker == 25 || checker == 27){
            if(potentialFields.indexOf(fieldID) === -1){
              fieldHolder[fieldID].dataset.markAsPotential = 'true';
              potentialFields.push(fieldID);
              evaluateFields(fieldID,true);                  
            }
          }
        }
      }
    });

  }
  function evaluateFields(ID,bool){
    var fields = getfields(ID);

    fields.forEach(function(id,index) {
      if(id>0&&id<220 && excludeFields.indexOf(id) == -1){

        //first attemnd
        if(!bool){
          //check if potential field is empty
          //if yes mark it as potiential and check  
          if(fieldHolder[id].dataset.empty === "true"){
            fieldHolder[id].dataset.markAsPotential = 'true';
            potentialFields.push(id);
            //evaluateFields(id);
          }else{
            evaluateNeighbor(ID,id,getfields(id));
          }
        }else{

          if(fieldHolder[id].dataset.empty === "false" && excludeFields.indexOf(id) == -1){
            
            evaluateNeighbor(ID,id,getfields(id));

          }

        }
      }
    });
  }
  evaluateFields(ID,false);
  return potentialFields;
}


/**

  Switch Teams
*/
function changeTeam(toTeam){
      var currentRot = camera_helper.rotation.y;
        switch (toTeam){
          case 'team1':
            new TWEEN.Tween({y: 0 }).to({y:Math.PI}, 2000).easing(TWEEN.Easing.Quintic.InOut).onUpdate(function(){
               camera_helper.rotation.y = this.y;
            }).onComplete(function() {
                
                activeTeam = 'team2';
            }).start();
              document.body.dataset.team = activeTeam ;
            return 'team2';
          break;
          case 'team2':
            new TWEEN.Tween({y: Math.PI }).to({y: 0 }, 2000).easing(TWEEN.Easing.Quintic.InOut).onUpdate(function(){
              camera_helper.rotation.y = this.y;

            }).onComplete(function() {
                activeTeam = 'team1';
            }).start();
              document.body.dataset.team = activeTeam;
            return 'team1';
          break;
        }

    activeElement = null;
}
/**

  Check if team wins
*/
//Helper Functions
function checkTeam(team,againstTeam){
  function getSum(total, num) {
    return total + num;
  }
  
  var winArr = team.children.map(function(el,index) { 
    if(againstTeam.coor.indexOf(el.customProperties.gameID) > -1){
      return +1;
    }else{
      return 0;
    }
  });
  return winArr.reduce(getSum);
}





//Check if one Team reaches all 15 Points

function checkWin() {
  teamOptions.team1.points = checkTeam(teamHolder['team1'],teamOptions['team2']);
  teamOptions.team2.points = checkTeam(teamHolder['team2'],teamOptions['team1']);

  //console.log(teamOptions.team1.points);
  //console.log(teamOptions.team2.points);
  for( team in teamOptions){

    switch(teamOptions[team].points){
      case 1:
      break;
      case 2:
      break;
      case 15:
        alert('you win the game',activeTeam);
      break;
      default:
        gameOptions.readyForNextPlayer = true;
        if (teamOptions[team].poins > 1) {
          console.log('Congrats reached your home base! Go on to win the game!');
        };
     break;
    }
  }
}



function resetGameFields(){
  gameOptions.potentials = null;
  for(field in fieldHolder){
    fieldHolder[field].dataset.markAsPotential = 'false';
  }
  
}





//__________ GAME LOGIC


// var reset = document.getElementById('reset');


// reset.addEventListener('click',function (){


// for(team in teamHolder){
//   teamHolder[team].children.forEach(function(stone,index){
//     console.log(stone.customProperties,index, gamePositions[teamOptions[team].coor[index]]);
     
//     new TWEEN.Tween(stone.position)
//     .to(gamePositions[teamOptions[team].coor[index]], 1000)
//     .onUpdate(function() {

      
//       activeElement = null;
//       last_color = null
      
//       stone.customProperties.gameID = teamOptions[stone.customProperties.team].coor[index];
//       resetGameFields();
//       fieldHolder[stone.customProperties.gameID].dataset.empty = false;

//       // fieldHolder.forEach(function(field,index) {
        
//       // });
//       //changeTeam('team2');
//         //console.log(this.x, this.y, this.z);
//     })
//     .start();
//   });
// }

// });

//__________________________________________ GAME INIT AFTER GEOMETRY IS LOADED
/**

  INITIAL SETUP STONES FOR PLAYERS

*/

function initPlayer(team,geometry,material) {

  var playerMeshBase = new THREE.Mesh(geometry);  
    teamHolder[team] = new THREE.Object3D();
      team.name = team;

  // Create Stone and set to position
  teamOptions[team].coor.forEach(function (coor,index){
      var p = gamePositions[coor];
      var stone = playerMeshBase.clone();

      fieldHolder[coor].dataset.empty = false;

      //Must have an individual Material
        stone.material = new THREE.MeshPhongMaterial({
          color : teamOptions[team].color
        });

        //Set position of stone based of the IDcoordinate
        stone.position.set(p.x,p.y,p.z);
        //Custom Properties
        stone.customProperties = {
          gameID: coor,
          team : team,
          active : false
        };
        stone.name = team + index;

        //Add Object to activeObjects
        Adjust.addActiveObject(stone,over,out,activeState,false);

        //add to holder
        teamHolder[team].add(stone);
  });

  scene.add(teamHolder[team]);
  return team;
}

//__________________________________________ Load Geometry

// Load Stone Geometry
// when loaded init stones
loader.load('assets/json/stone.json',function(geometry,material){
    initPlayer('team1',geometry,material)
    initPlayer('team2',geometry,material)
});


// Load Board
loader.load('assets/json/board.json',function(geometry,material){
    material[0].shading = THREE.FlatShading;
    material[0].shininess = 5;
    material[0].bumpScale = .05;

  var board = new THREE.Mesh(geometry,new THREE.MeshFaceMaterial(material));
    scene.add(board);
});

//__________________________________________ RENDER SETUP

//__________ render
function render() { 
  requestAnimationFrame( render ); 
  animation();
  TWEEN.update();
  controls.update();
  Adjust.update();
  renderer.render(scene, camera);
};

//__________ CALLED EVERY TICK

function animation(){

};

//__________________________________________ EVENTS

//__________ resize

window.onresize = function(){
  canvas_height = window.innerHeight;
  canvas_width = window.innerWidth;
  camera.aspect = canvas_width / canvas_height;
  camera.updateProjectionMatrix();
  renderer.setSize( canvas_width, canvas_height );

  Adjust.resize();
}


//__________ States of stones

function over (el){
  
}
//Mouseout Function
function out (el){
  
}
//Mousedown Function
function activeState (el){
  
  if(el.customProperties.team == activeTeam){
    el.customProperties.active = !el.customProperties.active;

    console.log(el);

    console.log('You\'ve clicked on stone: ' , el.customProperties);

    if(el.customProperties.active){
      if(activeElement!=null){
        activeElement.material.color = activeElement.customProperties.last_color;
        last_color = null;
        activeElement = null;
        resetGameFields();
      }
      el.customProperties.last_color = el.material.color;
      el.material.color = new THREE.Color(0x0000ff);
      activeElement = el;
      var _id = parseFloat(el.customProperties.gameID);
      gameOptions.potentials = getPotentials(_id);

       
      
    }else{
      if(activeElement!=null){
        activeElement.material.color = activeElement.customProperties.last_color;
        last_color = null;
        activeElement = null;
        resetGameFields();
      }
      el.material.color = el.customProperties.last_color;
    }  
  }else{//activeTeam
      console.log('Please select a stone in your team');

    }
}


//__________________________________________ KICK OFF

render();



//}()); //__eof

