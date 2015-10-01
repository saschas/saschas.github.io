var camera;
var controls;
var scene,scene2;
var light;
var renderer;
var div;
$(document).ready(function(){
    
    var tags = function(){
        var $thumbs = $('.thumb');
        var $tag_holder = $('.tags');
        var tags = []
        $thumbs.each(function(index,el){
            var that = $(this);
            var $own_tags = $('<div class="own_tags"/>')
            var current_class = $(this).attr('class')
                current_class = current_class.split(' ');
                current_class.forEach(function(c,index){
                    if(tags.indexOf(c) == -1){
                        tags.push(c);
                    }

                    var $span = $('<span/>');
                        $span.append(c).appendTo($own_tags);
                         
                });
                that.append($own_tags); 
        });

        tags = tags.sort();
        console.log(tags);
        $.each(tags,function(index,c){
            var $span = $('<span>');
          

            var attr = c;

            if(c=='twoD'){
                c = '2D';
                attr = 'twoD';
            }

            if(c=='threeD'){
                c = '3D';
                attr = 'threeD';
            }


            if(c!='thumb'){
               $span.attr('data-tag',attr).append(c);
                $tag_holder.append($span);
            }
            
        });
        return tags;
    }();

   $('.tags span').click(function(){
       var tag = $(this).data('tag');
     
     if($('body').hasClass(tag)){
         $('body').removeClass(tag);
         $(this).removeClass('active');
     }  
     else{
         $('body').addClass(tag);
         $(this).addClass('active');
         $('body').addClass('filter');
     }

        console.log($('body').attr('class').length);
     if($('body').attr('class').length == 6){
        $('body').removeClass('filter');
     }
   });
   

   $('#view_experiment').css({
       width : window.innerWidth,
       height : window.innerHeight
   });


   $('.thumb a').click(function(e){
       e.preventDefault(e);

        $('#preview').addClass('open_iframe');

       var link = $(this).attr('href');
       $('#new_tab_iframe').attr('href',link).attr('target','_blank');
        $('#view_experiment').unbind('load').attr('src',link).bind({
            load : function(){
                $(this).show().addClass('complete');
            }
        });       
   });

    



});

//init();
//animate();

$('#close_iframe').click(function(){

    $('#view_experiment').hide().removeClass('complete').attr('src','');
    $('.open_iframe').removeClass('open_iframe');
});

window.onresize = function(){
    $('#view_experiment').css({
       width : window.innerWidth,
       height : window.innerHeight
   });
}

function init() {
    //_______________________________________camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 100, 0);
    
    //_______________________________________controls
    controls = new THREE.OrbitControls(camera);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    
    //_______________________________________Scene
    scene = new THREE.Scene();
    
    //TorusGeometry
    torus = new THREE.Mesh(new THREE.TorusGeometry(120, 60, 40, 40),
                           new THREE.MeshNormalMaterial());
    torus.position.set(0, 0, 0);
    scene.add(torus);
    
    //HemisphereLight
    light = new THREE.HemisphereLight(0xffbf67, 0x15c6ff);
    scene.add(light);
    
    //WebGL Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true,transparent:true });
    //renderer.setClearColor(0xffffff, 1)
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.zIndex = 5;
    document.body.appendChild(renderer.domElement);
    
    //CSS3D Scene
    scene2 = new THREE.Scene();

    var $thumbs = $('.experiments');

    console.log($thumbs.length);
    var dom_elements = [];

    $.each($thumbs,function(index,el){
        dom_elements[index] = new THREE.CSS3DObject($(this).get(0));
        dom_elements[index].position.x = 0;
        dom_elements[index].position.y = 0;
        dom_elements[index].position.z = index;
       // dom_elements[index].rotation.x = 90 * Math.PI / 180;
        //dom_elements[index].rotation.y = Math.PI;
        scene2.add(dom_elements[index]);
    });
    
    
    
    //CSS3D Renderer
    renderer2 = new THREE.CSS3DRenderer();
    renderer2.setSize(window.innerWidth, window.innerHeight);
    renderer2.domElement.style.position = 'absolute';
    renderer2.domElement.style.top = 0;
    document.body.appendChild(renderer2.domElement);
}

function animate() {
    requestAnimationFrame(animate);
    renderer2.render(scene2, camera);
    renderer.render(scene, camera);
    //controls.update();
}