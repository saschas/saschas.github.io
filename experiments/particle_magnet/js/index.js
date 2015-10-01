    //_________________________________ Options
var canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

var c = canvas.getContext('2d');

function Å(){
    var that = this;
    this.active_attractor = null;
    this.center = {
      x : window.innerWidth/2,
      y : window.innerHeight/2
    }
    this.attractor = function(){
      var attraction_points = []
      for(var i=0;i<1;i++){
        attraction_points[i] = {
          bool : {
            move :false,
            off : 0,
            resize : false
          } ,
          x : window.innerWidth/2 - 100, 
          y : window.innerHeight/2 - 100,
          damping : 0.98,
          radius : 40,
          strength : 0.9,
          color : 'rgba(0,0,0,1)'
        }
        attraction_points[i].el = attractor_element(i,attraction_points);
            //return element;
      }
     return attraction_points;
    }();
    this.count = 1000;
    this.points = function(){
      var points = [];
      for(var i=0;i<1000;i++){
        points.push({
          x : window.innerWidth/2 + Math.sin(.05*i),
          y : window.innerHeight/2 + Math.cos(.05*i),
          vel : {
            x : Math.sin(i)*10,
            y : Math.cos(i)*10,
            max : {
              x : 15,
              y : 15
            }
          },
          speed : {
            x : .1,
            y : .1
          },
          direction :{
            x : 1,
            y : 1
          },
          lifetime : 1,
          in_attractor : {
            size : 2,
            bool : false,
            color : 'rgba(0,0,0,1)'
          }
        })
      }
      return points;
    }();
    this.update_points = function(){
      this.points;
      this.attractor;
    };
    this.updateSize = function(){
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      that.center = {
        x : window.innerWidth/2,
        y : window.innerHeight/2
      }
      that.update_points();
    };
    this.point_in_radius = function (x,y,cx, cy, radius) {
      var distsq = (x - cx) * (x - cx) + (y - cy) * (y - cy);
      return distsq <= radius * radius;
    }
    
    //___________________________________ DRAW EACH FRAME
    this.draw = function(time){
      var distance_x,distance_y;
      var fac_x,fac_y;
      var is_in_attractor;
      var speed_x,speed_y;
      var max_strength,fac_x,fac_y,max_x,max_y;
      for(var i=0;i<this.count;i++){        
        this.points[i].in_attractor.bool = false;
        for(var j=0;j<this.attractor.length;j++){
          
         
          
          is_in_attractor = this.point_in_radius(this.attractor[j].x,this.attractor[j].y,this.points[i].x,this.points[i].y,this.attractor[j].radius);
        
          if(is_in_attractor){
              this.points[i].speed.x *= this.attractor[j].damping;
              this.points[i].speed.y *= this.attractor[j].damping;
            if(this.points[i].speed.x > 0){
            }
            if(this.points[i].speed.y > 0){
            }
            
            this.points[i].in_attractor = {
              size : 2,
              bool : true,
              color : this.attractor[j].color
            }
          
            if(this.attractor[j].x > this.points[i].x){              
              this.points[i].vel.x += this.attractor[j].strength*this.points[i].direction.x;
            }
            else{
             this.points[i].vel.x -= this.attractor[j].strength*this.points[i].direction.x;
            }
            
            if(this.attractor[j].y > this.points[i].y){  
             this.points[i].vel.y += this.attractor[j].strength*this.points[i].direction.y;
            }
            else{
             this.points[i].vel.y -= this.attractor[j].strength*this.points[i].direction.y;
            }
          }
          else if(!this.points[i].in_attractor.bool){
            this.points[i].in_attractor = {
              size : 2,
              bool : false,
              color : '#f92672'
            }
            this.points[i].vel.x = Math.cos(i) * 2;
            this.points[i].vel.y = Math.sin(i) * 2;
            this.points[i].speed.x = 1.01;
            this.points[i].speed.y = 1.01;
          }
        }//end of for j
        
    //____________ IF Point is not in Attractor
      
        this.points[i].x += this.points[i].vel.x * this.points[i].speed.x * this.points[i].direction.x;
        this.points[i].y += this.points[i].vel.y * this.points[i].speed.y * this.points[i].direction.y; 
        
        //}
    //____________ is NOT radius of attractor
        if(this.points[i].x > window.innerWidth ||
          this.points[i].x < 0){
          this.points[i].direction.x *= (-1)
        }
        if(this.points[i].y > window.innerHeight ||
          this.points[i].y < 0){
          this.points[i].direction.y *= (-1)
        }
      
        c.fillStyle = this.points[i].in_attractor.color;
       c.fillRect(this.points[i].x,this.points[i].y,this.points[i].in_attractor.size,this.points[i].in_attractor.size);
        c.fillStyle = 'rgba(0,0,0,.1)';
       }//end of for i

    }
    this.update = function(time){
      c.clearRect(0,0,window.innerWidth,window.innerHeight);
    }
  }

var å = new Å();
//__________________________________________
var time = 0;
function animate(time){
  requestAnimationFrame(animate);
  å.update(time);
  å.draw(time);
}

animate(time);

//__________________________________________

window.onresize = å.updateSize;
/*document.addEventListener('click',function(event){
  å.center.x = event.pageX;
  å.center.y = event.pageY;
})*/


//_____________________________________ HELPER FCTs
function getRandomColor() {
    var letters = '6666656789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function attractor_element(i,attraction_points){
  var element = document.createElement('div');
      element.id = 'attractor-'+i;
  var resize_element = document.createElement('div');
      resize_element.id = 'resize-attractor-'+i;
      resize_element.setAttribute('class','resize-attractor');
  
      setStyle_el(element,attraction_points[i]);
        
      element.setAttribute('class','attractor');
      document.body.appendChild(element);  
      element.appendChild(resize_element);
      attraction_points[i].element = element;  
  return element;
}



function setStyle_el(el,style){
  var transformation = translate3d(style.x-style.radius, style.y-style.radius, 1, 0);
  var el_width = style.radius*2 + 'px';
  var el_height = style.radius*2 + 'px';
  
  el.style.cssText = '';
  el.style.cssText =transformation+'width:'+el_width+';height:'+el_height+';background-color:'+style.color+';z-index:99999';
}

function translate3d(x, y, z, t) {
        t = (typeof t === "undefined") ? 0 : t; //defaults to 0
        var tr = '-webkit-transform: translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px);-moz-transform: translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px);-ms-transform: translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px);-o-transform: translate(' + x + 'px, ' + y + 'px);transform: translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px);';

        return tr;
};


document.body.addEventListener('mousedown',function(event){
  var type = event.target.className;
  var id;
  switch(type){
    case 'attractor':
        id = event.target.id.split('attractor-');
      å.attractor[id[1]].el.setAttribute('class','attractor active');     
        å.attractor[id[1]].bool.move = true;
    break;
    case 'resize-attractor':
        id = event.target.id.split('resize-attractor-');
      å.attractor[id[1]].bool.resize = true;
    break;
  }
  å.active_attractor = id[1];
});

document.body.addEventListener('mousemove',function(event){
  if(å.active_attractor!==null){
  //______________________ RESIZE
    if(å.attractor[å.active_attractor].bool.resize){
      var n_radius =event.pageX- å.attractor[å.active_attractor].x;
      if(n_radius<0){
        n_radius=0;
      }
      å.attractor[å.active_attractor].radius = n_radius;
      setStyle_el(å.attractor[å.active_attractor].element,å.attractor[å.active_attractor]);
    }
    
    //____________ MOVE
    if(å.attractor[å.active_attractor].bool.move){
      
        å.attractor[å.active_attractor].x = event.pageX;
        å.attractor[å.active_attractor].y = event.pageY;
       setStyle_el(å.attractor[å.active_attractor].element,å.attractor[å.active_attractor]);
    }
  }
});

document.body.addEventListener('mouseup',function(event){
  var type = event.target.className; 
  for(var i=0;i<å.attractor.length;i++){
    å.attractor[i].bool.move = false;
    å.attractor[i].bool.resize = false;
    å.attractor[i].el.setAttribute('class','attractor');
  }
  å.active_attractor = null;
});