function load_indication(e){loading_icon.style.width=100*e/14+"%",100*e/14==100&&load_complete()}function load_audio_indication(e){loading_audio_icon.style.width=100*e/100+"%"}function load_complete(){load_holder.className="complete",play_button.className="ready_to_play",å.complete.audio=!0}function getRandomColor(){for(var e="0123433333000ccc".split(""),a="#",t=0;6>t;t++)a+=e[Math.floor(16*Math.random())];return a}function randomNumber(e,a,t){var n=Math.floor(Math.random()*a)+e;return(t||"undefined"==typeof t)&&(n*=1==Math.floor(2*Math.random())?1:-1),n}function get_intensity(e){return 100*e/255}function clamp(e,a,t){return a>e&&(e=a),e>t&&(e=t),e}function init_stage(e){renderTarget=new THREE.WebGLRenderTarget(512,512,{format:THREE.RGBFormat}),videoTexture=new THREE.Texture(audio_canvas_visualizer),videoTexture.crossOrigin="Anonymous",videoTexture.minFilter=THREE.LinearFilter,videoTexture.magFilter=THREE.LinearFilter,videoTexture.wrapS=videoTexture.wrapT=THREE.ClampToEdgeWrapping,topTexture=new THREE.Texture(audio_canvas_visualizer_top),topTexture.crossOrigin="Anonymous",topTexture.minFilter=THREE.LinearFilter,topTexture.magFilter=THREE.LinearFilter,topTexture.wrapS=topTexture.wrapT=THREE.ClampToEdgeWrapping,renderTarget.wrapS=renderTarget.wrapT=THREE.RepeatWrapping,renderTarget.repeat.y=-1,renderTarget.repeat.x=-1;var a=new THREE.MeshLambertMaterial({color:16777215,side:THREE.DoubleSide,map:videoTexture,overdraw:!0}),t=new THREE.MeshBasicMaterial({color:16777215,side:THREE.DoubleSide,map:renderTarget}),n=new THREE.MeshLambertMaterial({color:16777215,side:THREE.DoubleSide,map:topTexture,overdraw:!0}),r=new THREE.MeshFaceMaterial([a,t,n]);stage=new THREE.Mesh(e,r),stage.receiveShadow=!0,stage.castShadow=!0,scene.add(stage)}function init_piano(e){piano=new THREE.Mesh(e,new THREE.MeshPhongMaterial({side:THREE.DoubleSide,map:å.texture.piano,shininess:500})),piano.receiveShadow=!0,piano.castShadow=!0,scene.add(piano)}function init_man_piano(e){man_piano=new THREE.SkinnedMesh(e,new THREE.MeshPhongMaterial({side:THREE.DoubleSide,map:å.texture.man,bumpMap:å.texture.man,shininess:0,skinning:!0})),man_piano.receiveShadow=!0,man_piano.castShadow=!0,piano_animation=new THREE.Animation(man_piano,e.animation),piano_animation.play(),piano_animation.loop=!0,piano_animation.timeScale=200,piano_helper=new THREE.SkeletonHelper(man_piano),piano_helper.material.linewidth=1,piano_helper.visible=!1,scene.add(piano_helper),scene.add(man_piano)}function init_man_drum(e){var a=new THREE.MeshPhongMaterial({side:THREE.DoubleSide,map:å.texture.man,bumpMap:å.texture.man,shininess:0,skinning:!0}),t=new THREE.MeshPhongMaterial({side:THREE.DoubleSide,map:å.texture.drum,shininess:0,skinning:!0}),n=new THREE.MeshFaceMaterial([a,t]);man_drum=new THREE.SkinnedMesh(e,n),man_drum.receiveShadow=!0,man_drum.castShadow=!0,drum_animation=new THREE.Animation(man_drum,e.animation),drum_animation.play(),drum_animation.loop=!0,drum_animation.timeScale=200,drum_helper=new THREE.SkeletonHelper(man_drum),drum_helper.material.linewidth=1,drum_helper.visible=!1,scene.add(drum_helper),scene.add(man_drum)}function init_man_kontrabass(e){var a=new THREE.MeshPhongMaterial({side:THREE.DoubleSide,map:å.texture.man,bumpMap:å.texture.man,shininess:0,skinning:!0}),t=new THREE.MeshPhongMaterial({side:THREE.DoubleSide,map:å.texture.kontrabass,skinning:!0}),n=new THREE.MeshFaceMaterial([a,t]);man_kontrabass=new THREE.SkinnedMesh(e,n),man_kontrabass.position.set(-4,0,-8),man_kontrabass.receiveShadow=!0,man_kontrabass.castShadow=!0,kontrabass_animation=new THREE.Animation(man_kontrabass,e.animation),kontrabass_animation.play(),kontrabass_animation.loop=!0,kontrabass_animation.timeScale=150,kontrabass_helper=new THREE.SkeletonHelper(man_kontrabass),kontrabass_helper.material.linewidth=1,kontrabass_helper.visible=!1,scene.add(kontrabass_helper),scene.add(man_kontrabass)}function init_man_trumpet(e){var a=new THREE.MeshPhongMaterial({side:THREE.DoubleSide,map:å.texture.man,bumpMap:å.texture.man,shininess:0,skinning:!0}),t=new THREE.MeshPhongMaterial({side:THREE.DoubleSide,map:å.texture.saxo,skinning:!0}),n=new THREE.MeshFaceMaterial([a,t]);man_trumpet=new THREE.SkinnedMesh(e,n),man_trumpet.receiveShadow=!0,man_trumpet.castShadow=!0,trumpet_animation=new THREE.Animation(man_trumpet,e.animation),trumpet_animation.play(),trumpet_animation.loop=!0,trumpet_animation.timeScale=100,trumpet_helper=new THREE.SkeletonHelper(man_trumpet),trumpet_helper.material.linewidth=1,trumpet_helper.visible=!1,scene.add(trumpet_helper),scene.add(man_trumpet)}function init_man_saxo(e){var a=new THREE.MeshPhongMaterial({side:THREE.DoubleSide,map:å.texture.man,bumpMap:å.texture.man,shininess:0,skinning:!0}),t=new THREE.MeshPhongMaterial({side:THREE.DoubleSide,map:å.texture.trumpet,skinning:!0}),n=new THREE.MeshFaceMaterial([a,t]);man_saxo=new THREE.SkinnedMesh(e,n),man_saxo.receiveShadow=!0,man_saxo.castShadow=!0,saxo_animation=new THREE.Animation(man_saxo,e.animation),saxo_animation.play(),saxo_animation.loop=!0,saxo_animation.timeScale=100,saxo_helper=new THREE.SkeletonHelper(man_saxo),saxo_helper.material.linewidth=1,saxo_helper.visible=!1,scene.add(saxo_helper),scene.add(man_saxo)}function start_scene(){container=document.getElementById("container"),renderer=new THREE.WebGLRenderer({antialias:!0,transparent:!0,alpha:!0}),renderer.setSize(window.innerWidth,window.innerHeight),container.appendChild(renderer.domElement),renderer.shadowMap.enabled=!0,scene=new THREE.Scene,scene_renderTarget=new THREE.Scene,camera=new THREE.PerspectiveCamera(85,window.innerWidth/window.innerHeight,.1,1e4),camera.position.x=99,camera.position.y=40,camera.position.z=-16,scene.add(camera)}function init(){var e;"undefined"!=typeof AudioContext?e=new AudioContext:"undefined"!=typeof webkitAudioContext&&(e=new webkitAudioContext);var a=document.getElementById("jazz_song");a.onprogress=function(){var e=this.buffered.end(0)/this.duration;1==e&&(å.complete.audio=!0)};var t=e.createMediaElementSource(a);analyser=e.createAnalyser(),analyser.fftSize=32,t.connect(analyser),analyser.connect(e.destination),frequencyData=new Uint8Array(analyser.frequencyBinCount),audio_canvas_visualizer=document.createElement("canvas"),audio_canvas_visualizer.setAttribute("class","texture_canvas"),audio_canvas_visualizer.width=300,audio_canvas_visualizer.height=300,document.body.appendChild(audio_canvas_visualizer),c=audio_canvas_visualizer.getContext("2d"),c.fillStyle="#ff0000",c.fillRect(0,0,600,600);for(var n=[],r=0;32>r;r++)n.push({x:randomNumber(0,300,!1),y:randomNumber(0,300,!1)});c.update=function(e){for(this.clearRect(0,0,300,300),this.fillStyle="#000000",this.fillRect(0,0,300,300),this.fillStyle="#C02942",f=0;f<frequencyData.length;f++)this.fillRect(600/frequencyData.length*f,0,600/frequencyData.length,frequencyData[f]),this.beginPath(),this.arc(n[f].x,n[f].y,.5*frequencyData[f],0,2*Math.PI,!1),this.lineWidth=6,this.fillStyle="#542437",this.fill(),this.strokeStyle="#C02942",this.stroke()},audio_canvas_visualizer_top=document.createElement("canvas"),audio_canvas_visualizer_top.width=200,audio_canvas_visualizer_top.height=200,audio_canvas_visualizer_top.setAttribute("class","texture_canvas"),document.body.appendChild(audio_canvas_visualizer_top),c_top=audio_canvas_visualizer_top.getContext("2d"),c_top.fillStyle="#542437",c_top.update=function(e){this.clearRect(0,0,200,200);for(var a=0;a<frequencyData.length;a++)this.beginPath(),this.arc(100,100,.5*frequencyData[a],0,2*Math.PI,!1),this.fill(),this.lineWidth=5,this.strokeStyle="#F79D60",this.stroke()},kontrabass_camera=new THREE.PerspectiveCamera(55,700/300,.1,1e4),kontrabass_camera.position.x=30,kontrabass_camera.position.y=15,kontrabass_camera.position.z=-30,kontrabass_camera.lookAt(new THREE.Vector3(22,7,-14)),scene.add(kontrabass_camera),trumpet_camera=new THREE.PerspectiveCamera(35,700/300,.1,1e4),trumpet_camera.position.x=40,trumpet_camera.position.y=25,trumpet_camera.position.z=20,trumpet_camera.lookAt(new THREE.Vector3(20,20,14)),scene.add(trumpet_camera),piano_camera=new THREE.PerspectiveCamera(55,700/300,.1,1e4),piano_camera.position.x=12,piano_camera.position.y=25,piano_camera.position.z=-20,piano_camera.lookAt(new THREE.Vector3(0,18,-24)),scene.add(piano_camera),drum_camera=new THREE.PerspectiveCamera(55,700/300,.1,1e4),drum_camera.position.x=12,drum_camera.position.y=25,drum_camera.position.z=0,drum_camera.lookAt(new THREE.Vector3(0,18,0)),scene.add(drum_camera),controls=new THREE.OrbitControls(camera),controls.damping=.2,controls.addEventListener("change",render),controls.maxPolarAngle=Math.PI/2,controls.maxDistance=110;var i=new THREE.AmbientLight(16777215,1),o=new THREE.PointLight(16777215,2,250);scene.add(o),rim_light=new THREE.SpotLight(5514295,10,150,Math.PI/2),rim_light.position.set(70,50,-20).multiplyScalar(1),rim_light.castShadow=!0,rim_light.shadowMapWidth=204.8,rim_light.shadowMapHeight=204.8,rim_light.exponent=.5;var s=35;rim_light.shadowCameraLeft=-s,rim_light.shadowCameraRight=s,rim_light.shadowCameraTop=s,rim_light.shadowCameraBottom=-s,rim_light.shadowCameraNear=.01,scene.add(rim_light),back_light=new THREE.SpotLight(5470074,5,150,Math.PI/2),back_light.position.set(-70,50,-20).multiplyScalar(1),scene.add(back_light),trumpet_light=new THREE.SpotLight(å.light.trumpet.color,å.light.trumpet.intensity,150,Math.PI/2),trumpet_light.position.set(70,50,-20).multiplyScalar(1),trumpet_light.castShadow=!0,trumpet_light.shadowMapWidth=1024,trumpet_light.shadowMapHeight=1024,trumpet_light.exponent=100,trumpet_light.target.position.set(0,0,25),trumpet_light.target.updateMatrixWorld();var s=35;trumpet_light.shadowCameraLeft=-s,trumpet_light.shadowCameraRight=s,trumpet_light.shadowCameraTop=s,trumpet_light.shadowCameraBottom=-s,trumpet_light.shadowCameraNear=.01,scene.add(trumpet_light),kontrabass_light=new THREE.SpotLight(å.light.kontrabass.color,å.light.kontrabass.intensity,150,Math.PI/2),kontrabass_light.position.set(70,50,-20).multiplyScalar(1),kontrabass_light.exponent=100,kontrabass_light.target.position.set(22,5,-14),kontrabass_light.target.updateMatrixWorld(),scene.add(kontrabass_light),drum_light=new THREE.SpotLight(å.light.drum.color,å.light.drum.intensity,150,Math.PI/2),drum_light.position.set(30,50,-10).multiplyScalar(1),drum_light.exponent=70,drum_light.target.position.set(-15,10,0),drum_light.target.updateMatrixWorld(),scene.add(drum_light),piano_light=new THREE.SpotLight(å.light.piano.color,å.light.piano.intensity,150,Math.PI/2),piano_light.position.set(30,50,-10).multiplyScalar(1),piano_light.castShadow=!0,piano_light.exponent=70,piano_light.shadowMapWidth=1024,piano_light.shadowMapHeight=1024,piano_light.target.position.set(-5,15,-25),piano_light.target.updateMatrixWorld();var s=35;piano_light.shadowCameraLeft=-s,piano_light.shadowCameraRight=s,piano_light.shadowCameraTop=s,piano_light.shadowCameraBottom=-s,piano_light.shadowCameraNear=.01,scene.add(piano_light);var m=new THREE.CylinderGeometry(50,500,20,8),d=new THREE.MeshBasicMaterial({color:0}),l=new THREE.MeshLambertMaterial({color:5514295}),p=new THREE.Mesh(m,d);p.position.set(0,-50,0),scene.add(p),master_ground=[];for(var u,_=0,h=0;100>h;h++){_>32&&(_=0),u=randomNumber(5,20,!1);var g=new THREE.CylinderGeometry(u,u,20,10);master_ground[h]=new THREE.Mesh(g,l),master_ground[h].position.set(randomNumber(25,100,!0),-30,randomNumber(25,100,!0)),master_ground[h].receiveShadow=!0,master_ground[h].castShadow=!0,master_ground[h].master_id=_,master_ground[h].update=function(e){this.scale.y=1+.015*frequencyData[this.master_id]},_++,scene.add(master_ground[h])}}function onWindowResize(){camera.aspect=window.innerWidth/window.innerHeight,camera.updateProjectionMatrix(),renderer.setSize(window.innerWidth,window.innerHeight)}function animate(){requestAnimationFrame(animate),å.animate?(analyser.getByteFrequencyData(frequencyData),render()):(load_indication(å.complete.percentage),å.complete.texture&&å.complete.models&&å.complete.audio&&(å.touch||(å.animate=!0,jazz_song.play(),load_holder.setAttribute("class","playing"))))}function render(e){theta+=.1;var a=.75*clock.getDelta();c.update(e),c_top.update(e),videoTexture.needsUpdate=!0,topTexture.needsUpdate=!0,master_ground.forEach(function(a,t){a.update(e)}),"undefined"!=typeof jazz_song&&"undefined"!=typeof å.timestamps[curr_cam]&&jazz_song.currentTime>å.timestamps[curr_cam].time&&(å.active_camera=å.timestamps[curr_cam].type+"_camera",curr_cam++,curr_cam>=å.timestamps.length&&(curr_cam=0));var t=Math.floor(e/interpolation)+animOffset;switch(THREE.AnimationHandler.update(a/interpolation),piano_helper.update(),drum_helper.update(),trumpet_helper.update(),saxo_helper.update(),kontrabass_helper.update(),å.active_camera){case"drum_camera":renderer.render(scene,drum_camera,renderTarget,!0);break;case"piano_camera":renderer.render(scene,piano_camera,renderTarget,!0);break;case"kontrabass_camera":renderer.render(scene,kontrabass_camera,renderTarget,!0);break;case"trumpet_camera":renderer.render(scene,trumpet_camera,renderTarget,!0);break;default:renderer.render(scene,piano_camera,renderTarget,!0)}renderer.render(scene,camera)}var container,camera,scene,controls,raycaster=new THREE.Raycaster,renderer,clock=new THREE.Clock,time=0,duration=100,keyframes=4,interpolation=duration/keyframes,currentKeyframe=0,lastKeyframe=0,animOffset=1,radius=600,theta=0,prevTime=Date.now(),piano_animation,drum_animation,trumpet_animation,saxo_animation,kontrabass_animation,lamp_light,light,fake_light,rim_light,back_light,video,videoImage,videoImageContext,videoTexture,topTexture,c,mouseX=0,mouseY=0,trumpet_helper,piano_helper,saxo_helper,drum_helper,kontrabass_helper,trumpet_camera,piano_camera,saxo_camera,drum_camera,kontrabass_camera,audio_canvas_visualizer,audio_canvas_visualizer_top,analyser,frequencyData,renderTarget,kontrabass_camera,trumpet_camera,scene_renderTarget,mesh,circle,controller_animation,helper,morph_logic,master_ground,texture_man=document.getElementById("texture_man"),texture_stage=document.getElementById("texture_stage"),texture_piano=document.getElementById("texture_piano"),texture_drum=document.getElementById("texture_drum"),texture_trumpet=document.getElementById("texture_trumpet"),texture_kontrabass=document.getElementById("texture_kontrabass"),texture_saxo=texture_trumpet,url_base="assets/model/export_mesh/jazz/",tv_screen,tv_context,å={animate:!1,play:!1,ready:{count:0},mouse:{x:0,y:0,z:.5},touch:Modernizr.touch,complete:{percentage:0,texture:!1,models:!1,audio:!1},models:{stage:url_base+"stage.json",piano:url_base+"piano.json",man_piano:url_base+"man_piano.json",man_drum:url_base+"man_drum.json",man_trumpet:url_base+"man_trumpet.json",man_kontrabass:url_base+"man_kontrabass.json",man_saxo:url_base+"man_saxo.json"},loaded:{stage:{geometry:null,material:null},piano:{geometry:null,material:null},man_piano:{geometry:null,material:null},man_drum:{geometry:null,material:null},man_trumpet:{geometry:null,material:null},man_kontrabass:{geometry:null,material:null},man_saxo:{geometry:null,material:null}},texture:{man:new THREE.Texture(texture_man),stage:new THREE.Texture(texture_stage),piano:new THREE.Texture(texture_piano),drum:new THREE.Texture(texture_drum),kontrabass:new THREE.Texture(texture_kontrabass),trumpet:new THREE.Texture(texture_trumpet),saxo:new THREE.Texture(texture_saxo)},targetList:[],light:{piano:{intensity:2,color:new THREE.Color(16777215)},drum:{intensity:2,color:new THREE.Color(16777215)},kontrabass:{intensity:2,color:new THREE.Color(16777215)},trumpet:{intensity:2,color:new THREE.Color(16777215)}},active_camera:"piano_camera",timestamps:[{time:0,type:"piano"},{time:7,type:"drum"},{time:13,type:"piano"},{time:23,type:"kontrabass"},{time:33,type:"piano"},{time:42,type:"trumpet"},{time:50,type:"piano "},{time:80,type:"drum"},{time:90,type:"trumpet"},{time:118,type:"drum"},{time:124,type:"piano"},{time:140,type:"drum"},{time:145,type:"piano"},{time:160,type:"trumpet"},{time:174,type:"piano"},{time:195,type:"trumpet"},{time:200,type:"drum"},{time:215,type:"trumpet"},{time:240,type:"kontrabass"},{time:250,type:"trumpet"},{time:266,type:"drum"},{time:280,type:"piano"},{time:290,type:"kontrabass"},{time:305,type:"trumpet"},{time:325,type:"piano"},{time:340,type:"trumppet"},{time:360,type:"drum"},{time:370,type:"trumpet"},{time:390,type:"piano"},{time:401,type:"drum"},{time:420,type:"piano"},{time:440,type:"trumpet"},{time:450,type:"drum"},{time:470,type:"drum"},{time:485,type:"piano"},{time:490,type:"trumpet"},{time:495,type:"stop"}]},body_el=document.getElementsByTagName("body"),load_holder=document.getElementById("loader"),loading_icon=document.getElementById("loader_bar"),loading_audio_icon=document.getElementById("loader_audio_bar"),play_button=document.getElementById("play_button");play_button.addEventListener("click",function(){this.hasClass("ready_to_play")&&(jazz_song.play(),jazz_song.pause(),jazz_song.onprogress=function(){var e=this.buffered.end(0)/this.duration;load_audio_indication(100*e)},jazz_song.oncanplaythrough=function(){å.animate=!0,jazz_song.play();for(t in å.texture)å.texture[t].needsUpdate=!0;load_holder.setAttribute("class","playing")})});var imgLoad=imagesLoaded("#texture_holder");imgLoad.on("always",function(){for(var e=0,a=imgLoad.images.length;a>e;e++){var t=imgLoad.images[e],n=t.isLoaded?"loaded":"broken";å.complete.percentage++}}),imgLoad.on("done",function(e){for(t in å.texture)å.texture[t].minFilter=THREE.NearestFilter,å.texture[t].needsUpdate=!0;å.complete.texture=!0}),start_scene(),init(),animate();var manager=new THREE.LoadingManager;manager.onProgress=function(e,a,t){å.complete.percentage++,a==t&&(å.complete.models=!0)};var loader=new THREE.JSONLoader(manager);for(asset in å.models)loader.load(å.models[asset],function(e,a){var t;switch(e.vertices.length){case 232:t="stage",init_stage(e);break;case 224:t="piano",init_piano(e);break;case 1658:t="man_trumpet",init_man_trumpet(e);break;case 1782:t="man_saxo",init_man_saxo(e);break;case 2068:t="man_drum",init_man_drum(e);break;case 1299:t="man_kontrabass",init_man_kontrabass(e);break;case 1378:t="man_piano",init_man_piano(e)}å.loaded[t].geometry=e,å.loaded[t].material=a});Element.prototype.hasClass=function(e){return this.className&&new RegExp("(^|\\s)"+e+"(\\s|$)").test(this.className)},window.addEventListener("resize",onWindowResize,!1);var curr_cam=0;