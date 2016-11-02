/*
	Basic Setup
*/
/*
Ludovico Einaudi - Una Mattina
*/
var musicData = [
  ["a0"],["e1"],["a1"],["a0"],["e1"],["a1"],["a0"],["e1"],["a1"],["a0"],["e1"],["a1"],["e1"],["a0"],["e1"],["a1"],["a0"],["e1"],["a1"],["a0"],["e1"],["a1"],["b0"],["c1"],["e1"],["g1"],["b1"],["a0"],["e1"],["a1"],["a0"],["e1"],["a1"],["a0"],["e1"],["a1"],["a0"],["e1"],["b1"],["a0"],["e1"],["b1"], ["e1"], ["a0"],["e1"],["b1"], ["a0"],["e1"],["b1"], ["a0"],["e1"],["b1"], ["b0"],["c1"],["e1"],["g1"],["b1"], ["f0"],["e1"],["a1"],["a0"],["e1"],["a1"],["f0"],["e1"],["a1"],["a0"],["e1"],["a1"],["f0"],["e1"],["b1"],["e1"],["g0"],["e1"],["a1"], ["b0"],["e1"],["a1"],["g0"],["e1"],["a1"],["b0"],["c1"],["e1"],["g1"],["b1"],["a0"],["e1"],["a1"],["a0"],["e1"],["a1"],["a0"],["e1"],["a1"],["a0"],["e1"],["a1"],["a0"],["e1"],["b1"],["e1"],["a0"],["e1"],["a1"],["a0"],["e1"],["a1"],["a0"],["e1"],["a1"],["b0"],["c1"],["e1"],["g1"],["b1"],["f0"],["e1"],["a1"], ["a0"],["e1"],["a1"],["f0"],["e1"],["a1"], ["a0"],["e1"],["a1"],["f0"],["a0"],["e1"],["b1"],["d0"],["e1"],["a1"], ["a0"],["e1"],["a1"], ["a0"],["e1"],["a1"], ["b0"],["c1"],["e1"],["g1"],["b1"],["a-1"],["e1"],["a1"],["a0"],["e1"],["a1"],["a0"],["e1"],["a1"],["a0"],["e1"],["a1"],["e1"], ["a0"],["e1"],["a1"],["a0"],["e1"],["a1"],["a0"],["e1"],["a1"],["b0"],["c1"],["e1"],["g1"],["b1"],["f-1","a1"],["c0"],["a0"],["c0","e1"],["a0"],["c0"],["a0"],["c0"],["g-1"],["d0"],["b0"],["d0","b1"],["b0","a1"],["d0","b1"],["b0","a1"],["d0","b1"],["b0","a1"],["d0","b1"],["a-1"],["e0","a1"], ["c0"], ["e-1","e0"], ["c0"], ["e-1"], ["c0"], ["e-1"], ["c0"], ["b1"],["a1"],["b1"],["a1"],["b1"], ["f-1","a1"],["c0"],["a0"],["c0","e1"],["a0"],["c0"],["a0"],["c0"],["g-1"],["d0"],["b0"],["d0","b1"],["b0","b1"], ["d0","b1"], ["b0","b1"], ["d0","b1"], ["a0","b1"], ["e0","a1"], ["a0"], ["e0","e1"],["a0"],["e0"],["a0"],["e0"],["a0"],["b0"],["c1"],["e1"],["g1"],["b1"], ["f-1","a1"], ["c0"],["f0"], ["c0","e1"], ["f0"], ["c0"],["f0"], ["c0"],["g-1"], ["d0"],["g0"], ["d0","b1"], ["g0","a1"], ["d0","b1"],  ["g0","a1"], ["d0","b1"], ["a-1"],  ["e0","a1"], ["a0"], ["e0","e1"], ["a0"], ["e0"],["a0"], ["e0"],["a0"], ["e0"],["a0"], ["b1"],["a1"], ["b1"],["a1"], ["b1"],["f-1","a1"], ["c0"],["a0"], ["c0","e1"], ["a0"], ["c0"], ["a0"], ["c0"], ["g-1"], ["d0"], ["g0"], ["d0","b1"], ["g0","b1"], ["d0","b1"], ["g0","c2"], ["d0","b1"], ["a-1","b1"], ["e0","a1"], ["a0"], ["e0","e1"], ["a0"], ["e0"], ["a0"], ["e0"], ["a0"], ["__"], ["__"], ["__"], ["c1"],["g1"],["c2"],["c1"],["g1"],["c2"],["c1"],["g1"],["c2"],["c1"],["g1"],["c2"],["g1"],["f0"],["g1"],["b1"],["f0"],["g1"],["b1"],["f0"],["g1"],["b1"],["f0"],["g1"],["b1"],["f0"],["g1"],["b1"],["a0"],["e1"],["a1"],["a0"],["e1"],["a1"],["a0"],["e1"],["a1"],["a0"],["e1"],["a1"],["a0"],["e1"],["b1"],["e1"],["a0"],["e1"],["a1"],["a0"],["e1"],["a1"],["a0"],["e1"],["a1"],["a0"],["e1"],["a1"],["a0"],["e1"],["b1"],["e1"],["c1"],["g1"],["c2"], ["c0"],["g1"],["c2"],["c0"],["g1"],["c2"],["c0"],["g1"],["c2"],["c0"],["g1"],["c2"],["g1"],["e1"],["g1"],["b1"],["e1"],["g1"],["b1"],["e1"],["g1"],["b1"],["e1"],["g1"],["b1"],["e1"],["g1"],["b1"],["g1"],["a0"],["e1"],["a1"],["a0"],["e1"],["a1"],["a0"],["e1"],["a1"],["b0"],["c1"],["e1"],["g1"],["b1"],["f0"],["g1"],["b1"],["f0"],["g1"],["b1"],["f0"],["g1"],["b1"],["b0"],["c1"],["e1"],["g1"],["b1"],["c0"],["e1"],["c1"], ["c0"],["e1"],["c1"], ["c0"],["e1"],["c1"], ["c0"],["e1"],["c1"], ["c0"],["e1"],["c1"], ["e1"], ["g0"],["d1"],["b1"], ["g0"],["d1"],["b1"], ["g0"],["d1"],["b1"], ["g0"],["d1"],["b1"], ["g0"],["d1"],["b1"], ["d1"], ["a0"],["c1"],["a1"], ["a0"],["c1"],["a1"], ["a0"],["c1"],["a1"], ["a0"],["c1"],["a1"], ["c1"], ["a0"],["c1"],["a1"], ["a0"],["c1"],["a1"], ["__"], ["b0"],["c1"],["e1"],["g1"],["b1"], ["f0"],["e1"],["a1"],["a0"],["e1"],["a1"],["f0"],["e1"],["a1"],["a0"],["e1"],["a1"],["a0"],["e1"],["a1"],["e1"],["d0"],["e1"],["a1"],["a0"],["e1"],["a1"],["a0"],["e1"],["a1"],["__"],["e0"],["a1"],["a0"],["e1"],["a1"],["a0"],["e1"],["a1"],["__"],["__"],["a0"],["e1"],["a1"],["a0"],["e1"],["a1"],["a0"],["e1"],["a1"],["b0"],["c1"],["e1"],["g1"],["b1"],["f-1","a1"], ["c0"],["f0"], ["f1"],["f1"],["f1"], ["g-1"],["d0"],["g0"], ["b1"],["a1"], ["b1"],["a1"], ["b1"],["a0","b1"], ["a1"], ["e1"], ["a0"],["e1"],["a1"], ["a0"],["e1"],["a1"], ["b1"],["a1"], ["b1"],["a1"], ["b1"],["f-1","a1"], ["f0"],["e1"],["a1"], ["f0"],["e1"],["a1"], ["e1"], ["g-1"],["g0"],["e1"], ["b1"], ["b1"], ["b1"], ["c2"], ["b1"],["a-1","b1"], ["a1"],["e1"], ["a0"],["e1"],["a1"], ["a0"],["e1"],["a1"], ["b1"],["a1"], ["b1"],["a1"], ["b1"],["a1"], ["b1"],["f-1","a1"], ["f0"],["e0"],["e1"],["a1"], ["e0"],["e1"],["a1"], ["e1"],["g-1"],["g0"],["e1"],["b1"], ["a1"],["b1"], ["a1"],["b1"], ["a-1"],["b1"], ["a1"],["e1"], ["a0"],["e1"],["a1"],["a0"],["e1"],["a1"], ["b0"],["c1"],["e1"],["g1"],["b1"],["f-1","a1"], ["f0"],["e1"],["a1"], ["f0"],["e1"],["a1"], ["e1"], ["f-1"],["f0"],["e1"], ["b1"],["b1"],["b1"],["c2"],["b1"],["a-1","b1"],["a1"],["e1"], ["a0"],["e1"],["a1"], ["a0"],["e1"],["a1"], ["__"],["__"], ["f0"],["e1"],["a1"], ["a0"],["e1"],["a1"], ["f0"],["e1"],["a1"], ["a0"],["e1"],["a1"], ["f0"],["a0"],["e1"],["a1"],["g0"],["e1"],["a1"],["b0"],["e1"],["a1"],["g0"],["e1"],["a1"],["b0"],["c1"],["e1"],["g1"],["b1"],["a0"],["e1"],["a1"],["a0"],["e1"],["a1"],["a0"],["e1"],["a1"],["a0"],["e1"],["a1"],["e1"],["a0"],["e1"],["a1"],["a0"],["e1"],["a1"],["__"],["__"],["b0"],["c1"],["e1"],["g1"],["b1"],["f0"],["e1"],["a1"],["a0"],["e1"],["a1"],["f0"],["e1"],["a1"], ["a0"],["e1"],["a1"], ["f0"],["e1"],["a1"], ["a0"],["e1"],["a1"],  ["b0"],["e1"],["a1"], ["b0"],["e1"],["a1"], ["b0"],["c1"],["e1"],["g1"],["b1"],["__"],["__"]
]

document.body.classList.add('loading');


function Player(data,recorded){
  var music = data.slice(0);
  var that = this;
  var currentNote = [];
  this.play = true;

  this.playNote = function(m){
    setTimeout(function(){

      if(!that.play){
        m = [];
      }
        currentNote.forEach(function(m,index){
          m.rotation.x = 0 * Math.PI / 180;
          currentNote.splice(index,1);
        });

        if(m.length>0){
          if(m[0] != "__"){
            m[0].forEach(function(n){
              var direction = recorded ? 0 : 3;
              if(n.indexOf('-') > -1){
                n = n.replace('-','');
                var num = parseInt(n.match(/\d+/),10);
                direction =  direction - num - num;
              }
              var num = parseInt(n.match(/\d+/),10);
              var noteToPlay = n.toLowerCase().replace(num, (num) + direction );


              pianoNotes[noteToPlay].rotation.x = 4 * Math.PI / 180;
              currentNote.push(pianoNotes[noteToPlay]);
              
              playSound(sounds[noteToPlay].buffer,false);
            });

          }
          m.shift();
          that.playNote(m);
      }else{
        pianoNotes.isPlaying = false;
        currentNote.forEach(function(m,index){
          m.rotation.x = 0 * Math.PI / 180;
          currentNote.splice(index,1);
        });
      }
    },250);
  };

  this.stopMusic = function(){

    this.play = false;
    document.body.classList.add('paused');

  }

  this.playNote(music);

};


//__________ Variables

var sounds = {
  c : {
    sound : "Piano.ff.C",
    shape : 2,
    buffer : null,
    color : "w",
  },
  bd : {
    sound : "Piano.ff.Db",
    shape : 3,
    buffer : null,
    color : "b",
  },
  d : {
    sound : "Piano.ff.D",
    shape : 1,
    buffer : null,
    color : "w",
  },
  be : {
    sound : "Piano.ff.Eb",
    shape : 3,
    buffer : null,
    color : "b",
  },
  e : {
    sound : "Piano.ff.E",
    shape : 0,
    buffer : null,
    color : "w",
  },
  f : {
    sound : "Piano.ff.F",
    shape : 2,
    buffer : null,
    color : "w",
  },
  bg : {
    sound : "Piano.ff.Gb",
    shape : 3,
    buffer : null,
    color : "b",
  },
  g : {
    sound : "Piano.ff.G",
    shape : 1,
    buffer : null,
    color : "w",
  },
  ba : {
    sound : "Piano.ff.Ab",
    shape : 3,
    buffer : null,
    color : "b",
  },
  a : {
    sound : "Piano.ff.A",
    shape : 1,
    buffer : null,
    color : "w",
  },
  bb : {
    sound : "Piano.ff.Bb",
    shape : 3,
    buffer : null,
    color : "b",
  },
  b : {
    sound : "Piano.ff.B",
    shape : 0,
    buffer : null,
    color : "w",
  }
}
var cubeCamera;
var white_material,black_material;
var main_color = 0xaaaaaa;
var time = 0;
var canvas_height = window.innerHeight;
var canvas_width = window.innerWidth;
var basepath = "assets/sounds/";
var bufferLoader;

var spotLight;
window.AudioContext = window.AudioContext||window.webkitAudioContext;
var audioContext = new AudioContext();
var bufferLoader = new AudioBufferLoader( audioContext );
var scene,camera,renderer,controls;
var maxNotes = 84;
var manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total ) {
      console.log( item, loaded, total );

      if(loaded == total){
        init();
      }
    };

var loader = new THREE.JSONLoader(manager);
var textureLoader = new THREE.TextureLoader(manager);

var pianoNotes = {
  ready : false,
  isPlaying : false,
  recording : false
}
var playBoard = [];


var assets = {
  shapes : {},
  texture : {},
  geometry : {},
  materials : {}
}

var stage = {
  x : window.innerWidth,
  y : window.innerHeight
}

var notenOptions = {
  violinPos : 50,
  bassPos : 100,
  violinOrigin : 83,
  violineBase : 5,
  bassBase : 2,
  lineHeight : 6,
}


loader.load('assets/json/w_l.json',function(geometry,material){
  assets.shapes.w_l = geometry;
});
loader.load('assets/json/w_r_l.json',function(geometry,material){
  assets.shapes.w_r_l = geometry;
});
loader.load('assets/json/w_r.json',function(geometry,material){
  assets.shapes.w_r = geometry;
});
loader.load('assets/json/b.json',function(geometry,material){
  assets.shapes.b = geometry;
});
loader.load('assets/json/pianoGeometry.json',function(geometry,material){
  assets.geometry.piano = geometry;
  assets.materials.piano = material;
});
loader.load('assets/json/skyBox.json',function(geometry,material){
   assets.geometry.sky = geometry;
});

textureLoader.load("dist/textures/sky_texture.jpg",function(t){
  assets.texture.sky = t;
});
textureLoader.load("dist/textures/ground_albedo.jpg",function(t){
  assets.texture.ground_albedo = t;
});
textureLoader.load("dist/textures/ground_heightmap.jpg",function(t){
  assets.texture.ground_heightmap = t;
});
textureLoader.load("dist/textures/ground_normal.jpg",function(t){
  assets.texture.ground_normal = t;
});


//____________________________________________________________________________

function over (element, detail){}
//Mouseout Function
function out (element, detail){
  element.rotation.x = 0 * Math.PI / 180;
}
//Mousedown Function
function activeState (element, detail){
  element.rotation.x = 3 * Math.PI / 180;
  playSound(sounds[element._own.note].buffer,false);
  if(pianoNotes.recording){
    playBoard.push([element._own.note]);
  }
  console.log(element._own);  
}


function createShape(note,oct,noteIndex, opt,pos){
    var shapeName = null;
    var shapeMaterial = null;
    switch(opt.shape){
      case 0:
        shapeName = "w_l";
      break;
      case 1:
        shapeName = "w_r_l";
      break;
      case 2:
        shapeName = "w_r";
      break;
      case 3:
        shapeName = "b";
      break;
    }

    switch(opt.color){
      case "w":
        shapeMaterial = white_material;
      break;
      case "b":
        shapeMaterial = black_material;
      break;
    }

    pianoNotes[note + oct] = 
    pianoNotes[note + oct] = new THREE.Mesh(assets.shapes[shapeName],shapeMaterial);

    pianoNotes[note + oct]._own = {
      note : note + oct,
      oct : oct,
      index : noteIndex
    }
    pianoNotes[note + oct].receiveShadow = true;
    pianoNotes[note + oct].castShadow = true;
    pianoNotes[note + oct].position.set(pos.x,pos.y,pos.z);
    //Add Object to activeObjects
    Adjust.addActiveObject(pianoNotes[note + oct],over,out,activeState,false);
    scene.add(pianoNotes[note + oct]);

    if(Object.keys(pianoNotes).length == maxNotes){
      pianoNotes.ready = true;

      document.body.classList.remove('loading');
    }
  }
function loadSingleBuffer(octave,noteIndex,name,opt,pos){
  bufferLoader.loadBuffer(name + octave, basepath + opt.sound+ octave + ".mp3",function(buffer) {
    sounds[name + octave] = {};
    sounds[name + octave].buffer = buffer;
    createShape(name,octave,noteIndex,opt,pos);
  });
}

function createSource(buffer) {
    var source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    return {
      source: source,
    };
}


function playSound(buffer,loop) {
  
  
  var source = createSource(buffer);
  source.source.loop = loop;
  source.playing = true;
  source.source.start ? source.source.start() : source.source.noteOn(0);

  return source;
  
}

function prepareTexture(texture,wrap){
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(wrap,wrap);
}

//__________ scene

function init(){
  scene = new THREE.Scene();
  //__________ camera
  camera = new THREE.PerspectiveCamera( 55, canvas_width/canvas_height, 0.1, 10000 );
  camera.position.set(25,12,16);
  scene.add(camera);

  //Create cube camera
  cubeCamera = new THREE.CubeCamera( 1, 100, 128 );
  cubeCamera.position.set(0,12,0);
  scene.add( cubeCamera );
  //__________ renderer
  renderer = new THREE.WebGLRenderer({ 
    alpha: true,
    antialias:true
  });
  renderer.setSize( canvas_width, canvas_height );
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(main_color,1);
  document.body.appendChild( renderer.domElement );
  //__________ resize

  Adjust.init({
    camera : camera,
    scene : scene,
    renderer : renderer
  });
  //__________ controls
  controls = new THREE.OrbitControls( camera );
  controls.target.set(20,5,-2);
  controls.enabled = true;
  controls.damping = 0.2;
  controls.maxPolarAngle = Math.PI/2;
  //controls.minPolarAngle = 1;
  controls.minDistance = 10;
  controls.maxDistance = 220;
  //__________ light

  var pointLight = new THREE.PointLight(0xffffff,.5);

  pointLight.position.set(0,80,50);
  scene.add(pointLight);

  var ambient = new THREE.AmbientLight(0xaaaaaa);
  scene.add(ambient);
  

  spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set( -100, 100, 100 );
  spotLight.castShadow = true;
  spotLight.intensity = 1;
  spotLight.penumbra = .9;
  spotLight.castShadow = true;
  var d = 50;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;

  spotLight.shadow.camera.near = 1;
  spotLight.shadow.camera.far = 800;
  spotLight.shadow.camera.left = -d;
  spotLight.shadow.camera.right = d;
  spotLight.shadow.camera.top = d;
  spotLight.shadow.camera.bottom = -d;

  scene.add(spotLight);

  //____________sky
   var sky = new THREE.Mesh(assets.geometry.sky,new THREE.MeshBasicMaterial({
    map : assets.texture.sky
  }));
  sky.scale.set(5,5,5);
  scene.add(sky);

  //____________piano
  function createPiano(geometry,material){
    var piano = new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({
      color : 0x000000,
      metalness:.8,
      roughness:0.005,
      side : THREE.DoubleSide,
      envMap : cubeCamera.renderTarget.texture,
      envMapIntensity : .15,
    }));

    piano.castShadow = true;
    piano.receiveShadow = true;
    scene.add(piano);
  };

  createPiano(assets.geometry.piano,assets.materials.piano);
  //__________ tasten
  

  white_material = new THREE.MeshStandardMaterial({
    color : 0xffffff,
    envMap: cubeCamera.renderTarget.texture,
    envMapIntensity : .5,
    metalness : .1,
    roughness : .1
  });

  black_material = new THREE.MeshStandardMaterial({
      color : 0x222222,
      envMap: cubeCamera.renderTarget.texture,
      envMapIntensity : .5,
      metalness : 1,
      roughness : .1
  });

  var pos = 0;
  var last = "w";
  var noteIndex = 1;
  for(var oct = 1;oct <= 7;oct++){
    noteIndex = 1;
    for(sound in sounds){
      if(sounds[sound].color == "w" && last != "b"){
        pos+= .65
      }else{
        pos += .325;
      }
      loadSingleBuffer(oct,noteIndex,sound,sounds[sound], {
        x : pos,
        y : 0,
        z : 0
      });

      last = sounds[sound].color;
      if(sounds[sound].color == 'w'){
        noteIndex++;
      }
    }
  }


  createRecordBar();

  prepareTexture(assets.texture.ground_albedo,10);
  prepareTexture(assets.texture.ground_normal,10);
  prepareTexture(assets.texture.ground_heightmap,10);
  var groundPlane = new THREE.Mesh(new THREE.PlaneGeometry(600,600,128,128),new THREE.MeshStandardMaterial({
    color : 0xaaaaaa,
    map : assets.texture.ground_albedo,
    bumpMap : assets.texture.ground_normal,
    displacementMap : assets.texture.ground_heightmap,
    roughness:.9,
    metalness :0
  }));

  groundPlane.rotation.x = -90 * Math.PI / 180;
  groundPlane.position.y= -17;

  groundPlane.receiveShadow = true;
  scene.add(groundPlane);

  //
  render(time);
}//end of init


function createRecordBar(){
  var player = null;
  var navi = document.createElement('nav');
      navi.classList.add('recordBar');
    
    document.body.appendChild(navi);

  //play Button

  var playButton = document.createElement('button');
      playButton.classList.add('play-button');
      playButton.innerHTML = 'play';
      playButton.addEventListener('click',function(){
        
        
        if(pianoNotes.ready){
          navi.classList.toggle('isPlaying');
          document.body.classList.remove('paused');

          if(!pianoNotes.isPlaying){

            if(playBoard.length != 0){
              player = new Player(playBoard,true);

            }else{
              
              player = new Player(musicData,false);
            }
            pianoNotes.isPlaying = true;
          
          }else{
            player.stopMusic();
          }
        }
      });
  navi.appendChild(playButton);
 
  //rec Button
  var recordButton = document.createElement('button');
      recordButton.classList.add('record-button');
      recordButton.innerHTML = 'record';
      recordButton.addEventListener('click',function(){
        navi.classList.toggle('recording');

        pianoNotes.recording = !pianoNotes.recording;
      });

  navi.appendChild(recordButton);
  pianoNotes.playButton = playButton;
  pianoNotes.nav = navi;
}


window.onresize = function(){
  canvas_height = window.innerHeight;
  canvas_width = window.innerWidth;
  camera.aspect = canvas_width / canvas_height;
  camera.updateProjectionMatrix();
  Adjust.resize();
  renderer.setSize( canvas_width, canvas_height );
}


//__________ render
var render = function (time) { 
  requestAnimationFrame( render );
  controls.update();
  animation(time);

  Adjust.update();
  cubeCamera.updateCubeMap( renderer, scene );
  renderer.render(scene, camera);
};
//__________ animation
function animation(time){
  // scene.rotation.y  -= .0005;
};


//__________

//}()); //__eof
