/*
  PointCloud
*/
function PointCloud(element,opt){
  var that = this;
  this.points = [];
  this.context = element.getContext("2d");
  this.element = element;
  this.stage = {
    x : element.offsetWidth,
    y : element.offsetHeight
  }
  var options = {
    count : 50,
    radius : 150,
    mouseAdd : true,
    mouseAddPointCount : 5,
    circleRadius : 2,
    autoClear : true,
    drawCircle : true,
    circleColor : '#666',
    drawLines : true,
    drawBackground : true,
    background : '#222',
    speed : 1,
    setLineColor : function(normalizedDistance){
      return 'hsl(' + (255 - (normalizedDistance * 255)) + ', 100%,50%)';
    }
  }
  if(typeof opt != "undefined"){
    for(key in opt){
      if(key in options){
        options[key] = opt[key];
      }else{
        console.warn('Option with value:' + key + ' does not exist!');
      }
    }
  }


  this.count = options.count;
  this.radius = options.radius;
  this.mouseAdd = options.mouseAdd;
  this.mouseAddPointCount= options.mouseAddPointCount;
  this.circleRadius = options.circleRadius;
  this.autoClear = options.autoClear;
  this.drawCircle = options.drawCircle;
  this.circleColor = options.circleColor;
  this.drawLines = options.drawLines;
  this.drawBackground = options.drawBackground;
  this.background = options.background;
  this.speed = options.speed;

  this.getDir = function(){
    var rand = -.5 + Math.random();
        rand = rand <= 0 ?  -1 : 1;
    return rand;

  }

  this.getColor = options.setLineColor;
  this.checkRadius = function (point, target, radius) {
    var distsq = (point.x - target.x) * (point.x - target.x) + (point.y - target.y) * (point.y - target.y);
    return [distsq <= radius * radius, distsq];
  }

  this.generateSinglePoint = function(pos){
    var p = {
      pos : {
        x : Math.random() * this.stage.x,
        y : Math.random() * this.stage.y,
      },
      vel : {
        x : Math.random()* 2,
        y : Math.random()* 2
      },
      dir : {
        x : this.getDir(),
        y : this.getDir()
      }
    }
    if(typeof pos != "undefined"){
      p.pos.x = pos.x;
      p.pos.y = pos.y;
    }

    return p;
  }

  this.generateCloud = function() {
    this.points = [];
    for( var i=0;i<this.count;i++){
      this.points.push(this.generateSinglePoint());
    }
  };

  this.generateCloud();

  this.update = function(){
    if(this.autoClear){
      this.context.clearRect(0,0,this.stage.x,this.stage.y);
    }

    if(this.drawBackground){
      this.context.fillStyle = this.background;
      this.context.fillRect(0,0,this.stage.x,this.stage.y);
    }

    this.points.forEach(function(p,index){

      if(p.pos.x <=0 || p.pos.x >= that.stage.x){
        p.dir.x *= -1;
      }
      if(p.pos.y <=0 || p.pos.y >= that.stage.y){
        p.dir.y *= -1;
      }
      p.pos.x += p.vel.x * that.speed * p.dir.x;
      p.pos.y += p.vel.y * that.speed * p.dir.y;
    that.context.fillRect(p.pos.x,p.pos.y,1,1);

      that.points.forEach(function(interPoint,i){
        var checker = that.checkRadius(p.pos,interPoint.pos,that.radius);
        if(i != index && checker[0]){
          var dist = (1 - (checker[1] * .01) / (that.radius - 20));
          dist = dist > 0 ? dist : 0 ;
          dist = dist < 1 ? dist : 1 ;

          that.context.strokeStyle = that.getColor(dist);
          that.context.fillStyle = that.getColor(dist);
          that.context.globalAlpha = dist;

          if(that.drawLines){
            that.context.beginPath();
            that.context.moveTo(p.pos.x,p.pos.y);
            that.context.lineTo(interPoint.pos.x,interPoint.pos.y);
            that.context.stroke();
          }
          if(that.drawCircle){
            that.context.beginPath();
            if(that.circleColor != null){
              that.context.fillStyle = that.circleColor;
            }
            that.context.arc(p.pos.x,p.pos.y,that.circleRadius, 0, 2 * Math.PI, false);
            that.context.fill();
          }

          that.context.closePath();
          that.context.globalAlpha = 1;
        }
      });
    });
  }

  window.addEventListener('mousedown',function(event){
    if(that.mouseAdd){
      var pos = {
        x : event.clientX,
        y : event.clientY
      }
      for(var i=0;i<that.mouseAddPointCount;i++){
        that.points.push(that.generateSinglePoint(pos));
      }
    }
  });

  this.resize = function(){
    that.stage.x = that.element.offsetWidth;
    that.stage.y = that.element.offsetHeight;
  };


}


