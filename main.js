var camera;
var controls;
var scene,scene2;
var light;
var renderer;
var div;

init();
animate();

function init() {
    //_______________________________________camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 0, -1000);
    
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
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0xffffff, 1)
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.zIndex = 5;
    document.body.appendChild(renderer.domElement);
    
    //CSS3D Scene
    scene2 = new THREE.Scene();

    $('.thumb').each(function(el,index){
        dom_element = new THREE.CSS3DObject(el);
        dom_element.position.x = 0;
        dom_element.position.y = 0;
        dom_element.position.z = -185;
        dom_element.rotation.z = Math.PI;
        scene2.add(dom_element);
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
    controls.update();
}