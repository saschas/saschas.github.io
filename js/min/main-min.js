function init(){camera=new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,1,1e4),camera.position.set(0,100,0),controls=new THREE.OrbitControls(camera),controls.rotateSpeed=1,controls.zoomSpeed=1.2,controls.panSpeed=.8,scene=new THREE.Scene,torus=new THREE.Mesh(new THREE.TorusGeometry(120,60,40,40),new THREE.MeshNormalMaterial),torus.position.set(0,0,0),scene.add(torus),light=new THREE.HemisphereLight(16760679,1427199),scene.add(light),renderer=new THREE.WebGLRenderer({antialias:!0,transparent:!0}),renderer.setSize(window.innerWidth,window.innerHeight),renderer.domElement.style.zIndex=5,document.body.appendChild(renderer.domElement),scene2=new THREE.Scene;var e=$(".experiments");console.log(e.length);var n=[];$.each(e,function(e,t){n[e]=new THREE.CSS3DObject($(this).get(0)),n[e].position.x=0,n[e].position.y=0,n[e].position.z=e,scene2.add(n[e])}),renderer2=new THREE.CSS3DRenderer,renderer2.setSize(window.innerWidth,window.innerHeight),renderer2.domElement.style.position="absolute",renderer2.domElement.style.top=0,document.body.appendChild(renderer2.domElement)}function animate(){requestAnimationFrame(animate),renderer2.render(scene2,camera),renderer.render(scene,camera)}var camera,controls,scene,scene2,light,renderer,div;$(document).ready(function(){var e=function(){var e=$(".thumb"),n=$(".tags"),t=[];return e.each(function(e,n){var r=$(this),i=$('<div class="own_tags"/>'),a=$(this).attr("class");a=a.split(" "),a.forEach(function(e,n){-1==t.indexOf(e)&&t.push(e);var r=$("<span/>");r.append(e).appendTo(i)}),r.append(i)}),t=t.sort(),console.log(t),$.each(t,function(e,t){var r=$("<span>"),i=t;"twoD"==t&&(t="2D",i="twoD"),"threeD"==t&&(t="3D",i="threeD"),"thumb"!=t&&(r.attr("data-tag",i).append(t),n.append(r))}),t}();$(".tags span").click(function(){var e=$(this).data("tag");$("body").hasClass(e)?($("body").removeClass(e),$(this).removeClass("active")):($("body").addClass(e),$(this).addClass("active"),$("body").addClass("filter")),console.log($("body").attr("class").length),6==$("body").attr("class").length&&$("body").removeClass("filter")}),$("#view_experiment").css({width:window.innerWidth,height:window.innerHeight}),$(".thumb a").click(function(e){e.preventDefault(e),$("#preview").addClass("open_iframe");var n=$(this).attr("href");$("#new_tab_iframe").attr("href",n).attr("target","_blank"),$("#view_experiment").unbind("load").attr("src",n).bind({load:function(){$(this).show().addClass("complete")}})})}),$("#close_iframe").click(function(){$("#view_experiment").hide().removeClass("complete").attr("src",""),$(".open_iframe").removeClass("open_iframe")}),window.onresize=function(){$("#view_experiment").css({width:window.innerWidth,height:window.innerHeight})};