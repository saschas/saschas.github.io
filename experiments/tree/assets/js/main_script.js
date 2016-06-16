window.onload = function() {
var main_color = 0xffffff;
var canvas_height = window.innerHeight;
var canvas_width = window.innerWidth;


var clock = new THREE.Clock();
var time = 0;
var opt = {
  textures : {
    tree : null,
    gras : null,
    stones : null,

  },
  mod: {
    schaukel : null,
    gras : null,
    sun : null,
    man:null,
    groundPlane : null
  },
  urls : {
    tex: {
      clouds : 'assets/textures/clouds.png',
      sun : 'assets/textures/sun.png',
      schaukel : 'assets/textures/schaukel.jpg',
      stones : 'assets/textures/stones.jpg',
      man : 'assets/textures/man.jpg',
      tree : 'assets/textures/tree.jpg',
      gras : 'assets/textures/gras.jpg',
      butterfly : {
        left : 'assets/textures/butterfly_left.png',
        right : 'assets/textures/butterfly_right.png',

      }
    },
    model : {
      man : 'assets/json/man.json',
      stones : 'assets/json/stones.json',
      tree : 'assets/json/tree.json'


    }
  }
}

var cloud_origin = {
  x : 0,
  y : 0,
  z : 0
}

//_________________________________________

function randNum(min,max,bool){
  
  var num = Math.floor(Math.random()*max) + min; // this will get a number between 1 and 99;
  if(bool || typeof bool == "undefined"){
    num *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
  }
  return num;
}



//////////////////////////////////////////
    //   Scene
//////////////////////////////////////////
var scene = new THREE.Scene();
var sunScene = new THREE.Scene();

scene.fog = new THREE.Fog(0xf1ba46,1,10000);

//////////////////////////////////////////
    //   Camera
//////////////////////////////////////////
var camera = new THREE.PerspectiveCamera( 65, canvas_width/canvas_height, 0.1, 1000 );
var sunCamera = new THREE.PerspectiveCamera( 65, canvas_width/canvas_height, 0.1, 1000 );

  camera.position.set(-16,6.8,-19.85);
  scene.add(camera);
sunScene.add(sunCamera);
//////////////////////////////////////////
    //   Renderer
//////////////////////////////////////////

var renderer = new THREE.WebGLRenderer({ alpha: true, antialias:true,transparent:true });
var sunRenderer = new THREE.WebGLRenderer({ alpha: true, antialias:true });
    renderer.setSize( canvas_width, canvas_height );
    sunRenderer.setSize( canvas_width, canvas_height );
    renderer.domElement.className += 'renderer';
    sunRenderer.domElement.className += 'sunRenderer';
    
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    document.body.appendChild( sunRenderer.domElement );
    document.body.appendChild( renderer.domElement );


//_________________________________________________________________

var composer = new THREE.EffectComposer(renderer);
    composer.addPass(new THREE.RenderPass(scene, camera));

// depth        
//var depthShader = THREE.ShaderLib[ "depthRGBA" ];
//var depthUniforms = THREE.UniformsUtils.clone( depthShader.uniforms );
//
//var depthMaterial = new THREE.ShaderMaterial;
//var depthTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat } );

//composer.setSize(window.innerWidth, window.innerHeight);


var effectOutline = new THREE.ShaderPass({

    uniforms: {
      tDiffuse:{ 
        type: "t", 
        value: 0, 
        texture: null 
      },
      uScreenWidth: { 
        type: "f", 
        value: window.innerWidth
      },
      uScreenHeight: { 
        type: "f", 
        value: window.innerHeight
      }
    },
    vertexShader:   document.getElementById('outline-vertex').textContent,
    fragmentShader: document.getElementById('outline-frag').textContent
    } );
    effectOutline.renderToScreen = true;
    composer.addPass( effectOutline );


//_____________________________________ resize

window.onresize = function(){
  canvas_height = window.innerHeight;
  canvas_width = window.innerWidth;
  camera.aspect = canvas_width / canvas_height;
  camera.updateProjectionMatrix();
  renderer.setSize( canvas_width, canvas_height );
  sunRenderer.setSize( canvas_width, canvas_height );
}
//_____________________________________ controls

  controls = new THREE.OrbitControls( camera );
  controls.target = new THREE.Vector3(-8,7.5,-1.5);
  controls.damping = 0.2;
  controls.maxPolarAngle = 110 * Math.PI / 180;
  //controls.minPolarAngle = -90 * Math.PI / 180;
  controls.minDistance = 20;
  controls.maxDistance = 30;

  controls.update();

//_____________________________________ light

var ambient = new THREE.AmbientLight(0x999999,1);
    scene.add(ambient);
var spotLight = new THREE.SpotLight(0xffcf6e);
    spotLight.position.set(0,100, 150 );
    spotLight.intensity = 2;
    spotLight.castShadow = true;
    spotLight.shadowMapWidth = 1024;
    spotLight.shadowMapHeight = 1024;
    scene.add(spotLight);


var backLight = new THREE.SpotLight(0xb3d5dd,.5);
    backLight.position.z = -200;
    scene.add(backLight);


//_____________________________________ loader
var loader = new THREE.JSONLoader();
var tex_loader = new THREE.TextureLoader();
//_____________________________________ treeMat

tex_loader.load(opt.urls.tex.tree,function(texture){
  opt.textures.tree[0].color = new THREE.Color(0xffffff);
  opt.textures.tree[0].map = texture;
  opt.textures.tree[0].bumpMap = texture;
  opt.textures.tree[0].side = THREE.DoubleSide;
  opt.textures.tree[0].needsUpdate = true;
});

//_____________________________________ tree

loader.load(opt.urls.model.tree,function(geo,mat){
  mat[0].side = THREE.DoubleSide;
  opt.textures.tree = mat;
  var tree = new THREE.Mesh(geo,new THREE.MeshFaceMaterial(opt.textures.tree));
      tree.castShadow = true;
      tree.receiveShadow = true;
      scene.add(tree);
});


//________________________________ Butterfly

function createButterFly(){
  var butterfly = new THREE.Object3D();
  this.count = 0;
  var that = this;

    tex_loader.load(opt.urls.tex.butterfly.left,function(texture){

      var mat = new THREE.MeshPhongMaterial({
        color : 0xffffff,
        map : texture,
        transparent : true,
        depthTest: true,
        depthWrite: true,
        alphaTest: .8,

        side : THREE.DoubleSide
      });

      var planeGeo = new THREE.PlaneGeometry(1,1,1,1);
      planeGeo.vertices.forEach(function(p,index){
        p.x -= .5
      })
      var mesh = new THREE.Mesh(planeGeo,mat);
      mesh.update = function(time){
        this.rotation.y = Math.sin( 0.025 * time);
      }
      butterfly.add(mesh);

      that.count++;
    });

    tex_loader.load(opt.urls.tex.butterfly.right,function(texture){

      var mat = new THREE.MeshPhongMaterial({
        color : 0xffffff,
        map : texture,
        transparent : true,
        depthTest: true,
        depthWrite: true,
        alphaTest: .9,
        side : THREE.DoubleSide

      });

      var planeGeo = new THREE.PlaneGeometry(1,1,1,1);
      planeGeo.vertices.forEach(function(p,index){
        p.x += .5
      });
      var mesh = new THREE.Mesh(planeGeo,mat);

      mesh.update = function(time){
        this.rotation.y = Math.sin( -0.025 * time);
      }
      butterfly.add(mesh);

       that.count++;

    });

    butterfly.castShadow = true;
    butterfly.rotation.x = -90*Math.PI / 180;
    butterfly.rotation.z = 90*Math.PI / 180;



    butterfly.update = function(time){

      this.position.x = Math.sin(0.0002 * time) * 20;
      this.position.z = Math.cos(-0.0002 * time) * 20;
      this.position.y = 10 + Math.sin(-0.0002 * time) * 5;

      this.rotation.z = -(2 * Math.PI / 20 * 360 / time * -0.0002) * Math.PI / 180;
      //this.rotation.x = (time * -0.0002) * Math.PI / 2;

      this.children.forEach(function(f,i){
        f.update(time);
      })

    }

    return butterfly;
}

var schwarm = [];


schwarm.push(createButterFly());

schwarm.forEach(function(b,index){
  scene.add(b);
});



//___________________________________ Ground
tex_loader.load(opt.urls.tex.stones,function(texture){
  opt.textures.stones = texture;

  loader.load(opt.urls.model.stones,function(geo,mat){    

    var mesh = new THREE.Mesh(geo,new THREE.MeshFaceMaterial(mat));




  console.log(opt.textures.stones,mat,mesh)


    mesh.material.materials[0].color = new THREE.Color(0xffffff);
    mesh.material.materials[0].map = opt.textures.stones;
    mesh.material.materials[0].bumpMap = opt.textures.stones;
    mesh.material.materials[0].side = THREE.DoubleSide;
    //mat.color = new THREE.Color(0xffffff);
    mesh.material.materials[0].needsUpdate = true;
    var stones = new THREE.Group();
    var st = 0;
    for(var s=0;s<opt.mod.groundPlane.geometry.vertices.length;s++){

      if(s% 8 == 0 && opt.mod.groundPlane.geometry.vertices[s].z > 1){

        stones.children[st] = mesh.clone();

        var scaler = randNum(.28,0.5,false);
        stones.children[st].scale.set(scaler,scaler,scaler);
        stones.children[st].position.x = opt.mod.groundPlane.geometry.vertices[s].x +randNum(0,5.0,false);
        stones.children[st].position.y = 1.2 - opt.mod.groundPlane.geometry.vertices[s].z;
        stones.children[st].position.z = opt.mod.groundPlane.geometry.vertices[s].y + randNum(0,2.0,false);
        stones.children[st].rotation.y = randNum(0,360,false);
      st++;
    }
      

    }

    scene.add(stones);

  });

});


//____________________________________________________
var helper;
var skel_animation;
tex_loader.load(opt.urls.tex.schaukel,function(texture){
  opt.textures.schaukel = texture;
  tex_loader.load(opt.urls.tex.man,function(texture){

    opt.textures.man = texture;

    loader.load(opt.urls.model.man,function(geometry,mat){

      console.log(mat)
      mat[0].skinning = true;
      mat[0].map = opt.textures.schaukel;
      mat[0].shading = THREE.FlatShading;
      mat[0].color = new THREE.Color(0xffffff);
      mat[1].specular = new THREE.Color(0x333333);

      mat[1].skinning = true;
      mat[1].map = opt.textures.man;
      mat[1].shading = THREE.FlatShading;
      mat[1].color = new THREE.Color(0xffffff);
      mat[1].specular = new THREE.Color(0x333333);
      

      opt.mod.man = new THREE.SkinnedMesh(geometry,new THREE.MeshFaceMaterial(mat));
      console.log(opt.mod.man.geometry,opt.mod.man);

      opt.mod.man.position.set( -9.5,12.65,-0.15);
      opt.mod.man.castShadow = true;


      opt.mod.man.update = function(time){
        this.rotation.x = Math.sin(0.002 * time) * .25; 
      };
      skel_animation = new THREE.Animation( opt.mod.man, geometry.animations[1] );
          skel_animation.interpolationType = THREE.AnimationHandler.CATMULLROM_FORWARD;
          skel_animation.play();
          skel_animation.timeScale = 1;
      helper = new THREE.SkeletonHelper( opt.mod.man );
      helper.material.linewidth = 1;
      helper.visible = false;
      scene.add( helper );
      scene.add(opt.mod.man);
    });

  });
});



//____________________________________________________
tex_loader.load(opt.urls.tex.sun,function(texture){
  var plane = new THREE.PlaneGeometry(100,100);

  opt.mod.sun = new THREE.Mesh(plane,new THREE.MeshBasicMaterial({
    map :texture,
    color : new THREE.Color(0xffffff),
    transparent : true,
    transparent:true,
    depthTest: true,
    depthWrite: true,
    alphaTest: .05,
    fog: false,
    side : THREE.DoubleSide
  }));

  opt.mod.sun.position.z += 200;
  opt.mod.sun.position.y += 10;
  opt.mod.sun.update = function(time){
    this.rotation.copy(camera.rotation);
  }
  sunScene.add(opt.mod.sun);


});
//___________________________________ Cloud

tex_loader.load(opt.urls.tex.clouds,function(texture){

    var cMaterial = new THREE.PointsMaterial({
          color : new THREE.Color(0xffffff),
          size: 150,
          
          transparent:true,
          depthTest: true,
          depthWrite: true,
          alphaTest: .8,
          map : texture,
          fog : false
        });
    var clouds_particles = new THREE.Geometry();

    for(var c=0;c<50;c++){
      var c_x = randNum(50,200,true); 
      var c_y = randNum(50,200,false);
      var c_z = randNum(50,200,true);
      
      clouds_particles.vertices.push(new THREE.Vector3(c_x,c_y,c_z));
      
    }

    var clouds = new THREE.Points(clouds_particles,cMaterial);
  
    sunScene.add(clouds);
});



//___________________________________ Ground
tex_loader.load(opt.urls.tex.gras,function(texture){

  var planeGeo = new THREE.PlaneGeometry(100,100,64,64);
  opt.textures.gras = texture;
  opt.textures.gras.wrapS = opt.textures.gras.wrapT = THREE.Repeat;
  opt.textures.gras.repeat = new THREE.Vector2(10,10);
  var groundMat = new THREE.MeshPhongMaterial({
    color : 0x4c6921,
    side : THREE.DoubleSide,
    shading : THREE.FlatShading,
    shininess : 1,
    specular : new THREE.Color(0xa77e71),
    vertexColors: THREE.VertexColors,
    map : texture,
    bumpMap : opt.textures.gras,
    bumpScale : 0.2   
  });

    
  var colors = [];
  opt.mod.groundPlane = new THREE.Mesh(planeGeo,groundMat);
  opt.mod.groundPlane.rotation.x = 90 * Math.PI / 180;

  opt.mod.groundPlane.geometry.vertices.forEach(function(p,index){
    p.z += .5 - (Math.random() * ( (p.x + p.y) * .04) - randNum(0,1.05,false) ) + ((Math.abs(p.x) + Math.abs(p.y)) * .05 );

    colors.push(new THREE.Color(0x000000));

    if(p.y > 49 || p.y < -49 || p.x < -49 || p.x > 49){
      p.z = 20;
    }else{
    }

  });
  opt.mod.groundPlane.position.y += 1;
  opt.mod.groundPlane.geometry.colors = colors;
  opt.mod.groundPlane.geometry.colorsNeedUpdate = true;
  opt.mod.groundPlane.receiveShadow = true;
  opt.mod.groundPlane.geometry.verticesNeedsUpdate = true;
  scene.add(opt.mod.groundPlane);


});


//////////////////////////////////////////
    //   Render
//////////////////////////////////////////
var render = function (time) { 
  animation(time);
  controls.update();
  renderer.clear();
  composer.render();

  sunCamera.position.copy(camera.position);
  sunCamera.rotation.copy(camera.rotation);
  sunRenderer.render(sunScene, sunCamera);
  requestAnimationFrame( render ); 
};

//////////////////////////////////////////
    //    Animation
//////////////////////////////////////////
function animation(time){

  if(schwarm.length > 0){
    schwarm.forEach(function(b,index){
      b.update(time);
    })
  }
  if( opt.mod.schaukel != null){
     opt.mod.schaukel.update(time);
  }
  if( opt.mod.man != null){
     opt.mod.man.update(time);
  }
  if( opt.mod.sun != null){
     opt.mod.sun.update(time);
  }


        var delta = .75 * clock.getDelta();

   THREE.AnimationHandler.update( delta );

        if ( helper !== undefined ){
              helper.update();
        }
  // if(grasObject.children.length > 0){

  //   grasObject.children.forEach(function(c,index){
  //     c.update(time);
  //   });
  // }
  
  // scene.rotation.y  -= .0005;
};

//_________________________________

render(time);

}();