$(document).ready(function() {
    
    var game = false;
    var myContent = [];
    	  myContent[0] = 'Snake';
	  myContent[1] = 'Use your keyboard left,right,top,down or WADS to control the circle. ESC for pause. Have Fun : )';
	  myContent[2] = "Start"
	      
   function Game(){
    
    //Detect the device
    var iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false );
    
   // set timeout
    var repeater = setTimeout(timer, 1);
    var currTime = 0;

    var container = document.createElement('div');
    	  container.id = 'container'
        $('body').append(container);

    var clientX = $('#container').width() - 30;
    var clientY = $('#container').height() - 30;

    window.addEventListener('keydown', controller, false);
         
    var windowDimension = [clientX, clientY];
    var winDx = windowDimension[0];
    var winDy = windowDimension[1];

    var particle;
    var food;

    var speedX = 0;
    var speedY = 0;

    var vX = 0;
    var vY = 0;

    var currPosBox = [];
    var currFoodPos = [];
    var currEnemiePos = [];
    var level = 1;
    var levelHelper = 5 * level;
    var anHangNum = 0;

    var lastPx = [];
    var lastPy = [];
    var pause = 1;
    var usrPoints = 0;
    var usrLevel = 1;
    var lebensArray = [];
    var lebenAnzahl = 5;
    var currTimer = [];
    ////console.log(clientY,clientX)
	var bounce = false;
	
    var randColor;
    var usedColors= [];
    
     var currKeyCode =0;   
    
    //Generiert den Player
    function particleClass(ID, color) {
        particle = document.createElement('div');
        $('#container').append(particle);
        particle.id = ID;
        jID = '#player';

    }
   
   //Egalize Firefox KeyCode Problem
   document.body.addEventListener('keydown', function showKeyCode(e) {
	currKeyCode = e.keyCode
},false)

   //Prevent iOS devices from scrolling or tabbing
   document.ontouchmove = function(event){
    		event.preventDefault();
	}

   //Multitouch Event - Pause
   document.ontouchstart = function(event){
	   if (event.targetTouches.length == 2) {
		   if (pause == 1) {
                pause = 0;
		    stopTimer();
            } else {
                pause = 1;
		    timer()
            }
		   }
	   }
//Creates the actual TouchController
    function touchController(){
	    var e = document.createElement('div');
	    	e.id="touchControlls";
		document.body.appendChild(e);
	    
	    var touchCont = $('#touchControlls');
	    var leftKey = document.createElement('div');
	    	leftKey.id="left";
		leftKey.setAttribute('class','touchButton');
	    var rightKey = document.createElement('div');
	    	rightKey.id="right";
		rightKey.setAttribute('class','touchButton');
	    var topKey = document.createElement('div');
	    	topKey.id="top";
		topKey.setAttribute('class','touchButton');
	    var bottomKey = document.createElement('div');
	    	bottomKey.id="bottom";
		bottomKey.setAttribute('class','touchButton');
		
	    touchCont.append(leftKey, rightKey, topKey,bottomKey)
	    }
	
	if(iOS==true){
	//create it - no really 
		var touchControlls = new touchController();
	}
	
	//get the touch Controller - Left - Right - Top - Bottom
	$('.touchButton').bind('touchstart',function(){
		
		var currID = $(this).attr('id');
		//console.log(currID);
		
		if(currID == 'left'){
			//console.log('left');
			vX = -1;
			vY = 0;
			}
		if(currID == 'right'){
			//console.log('right');
			vX = 1;
			vY = 0;
			}
		if(currID == 'top'){
			//console.log('top');
			vY = -1;
			vX = 0;
			}
		if(currID == 'bottom'){
			//console.log('bottom');
			vY = 1;
			vX = 0;
			}
		});
		
    //Steuert den Player mit Hilfe des KeyCodes
    function controller() {
        

        if (currKeyCode == 87 || currKeyCode == 38) {//---W
            ////console.log('W')
            vX = 0;
            vY = -1;
        }
        if (currKeyCode == 83 || currKeyCode == 40) {//---S
            ////console.log('S');
            vX = 0;
            vY = 1;
        }
        if (currKeyCode == 65 || currKeyCode == 37) {//---A
            ////console.log('A')
            vX = -1;
            vY = 0;
        }
        if (currKeyCode == 68 || currKeyCode == 39) {//---D
            ////console.log('D')
            vX = 1;
            vY = 0;
        }
        if (currKeyCode == 27) {//---Esc
		
            if (pause == 1) {
                pause = 0;
		    stopTimer()
            } else {
                pause = 1
		    timer()
            }
        }
    }
   
    //Bewegt den Player
    function bewegung() {
        $(jID).animate({
            left : '+=' + speedX,
            top : '+=' + speedY
        }, 1)
    }

    function get_random_color() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.round(Math.floor(Math.random() * 5) + 10)];
        }
        return color;
    }
    
    //Generiert das Futter
    function foodClass(currLevel) {
        
        var el = document.createElement('div');
        $('#container').append(el);
        var food = $(el);
        food.attr('id', 'food');

        //generiert jedes Mal wenn ein FutterstÃ¼ck erstellt wird eine zufÃ¤llige Position
        var randNumX = Math.floor((Math.random() * clientX - 30) + 30);
        var randNumY = Math.floor((Math.random() * clientY - 30) + 30);

        randColor = get_random_color();
        usedColors.push(randColor);
        currTimer.push(currTime);
        //console.log(currTimer);
        //Speichert die aktuelle Futterposition
        currFoodPos = [randNumX, randNumY];
        //positioniert das Futterstueck
        food.css({
            top : randNumY,
            left : randNumX,
            opacity : 1,
            background : randColor,
            'box-shadow' : '0 0 15px ' + randColor
        })
    }

    function leben(counter) {
        var leben = 1;
        var el = document.createElement('li');
        el.id = 'heart' + counter;
        el.setAttribute('class', 'heart')
        $('#heartContainer ul').append(el)
    }

    //erstellt den Anhang
    function anHangClass() {

        anHangNum += 1
        anHang = document.createElement('div');
        $('#container').append(anHang);
        anHang.setAttribute('id', 'anhang' + anHangNum);
        anHang.setAttribute('class', 'anhang');

    }

    function menuBuilder() {
        var menu = document.createElement('div');
        menu.setAttribute('id', 'menu');

        $('#container').append(menu);
        $('#menu').html('<div id="heartContainer"><ul></ul></div><div id="info"><span>' + usrPoints + '</span></div>')
    }

    function Result() {
        pause = 0;
        var el = document.createElement('div');
        el.id = 'resultMenu';
        $('#container').append(el);
        var resultMenu = $('#resultMenu');
        resultMenu.html('<div id="textResult">Your score is <br />' + usrPoints + '</div>');
       
        for(i=0;i<usedColors.length;i++){
            var el = document.createElement('div');
            el.id = 'color' + i;
            $('#resultMenu').append(el)
            var lastTime = currTimer[currTimer.length-1];
            //console.log(lastTime)
            elColor = $('#color' + i);
            elColor.css({
                background:usedColors[i],
                height:100/usedColors.length + '%'
            })
            
        }

    }

    function Splash() {
        var el = document.createElement('div');
        el.id = "splash";
        $('#container').append(el);
    }

    
    
    //For Desktop
    function normPos() {
        var currPos = $(particle).position();
        currPosBox = [currPos];

        var currPosX = currPosBox[0]['left'];
        var currPosY = currPosBox[0]['top'];

        lastPx.push(currPosX)
        lastPy.push(currPosY)

        var currFoodPosX = currFoodPos[0];
        var currFoodPosY = currFoodPos[1];
        var enemies = [];

        //wenn der Player das Futter beruehrt
        if (currPosX > currFoodPosX - 50 && currPosX < currFoodPosX + 50 && currPosY > currFoodPosY - 50 && currPosY < currFoodPosY + 50) {

            usrPoints += 200;

            //Loescht das Futter
            $('#food').remove();
            //Fuegt das neue Futter hinzu
            new foodClass();
            //Verlaengert den Player
            new anHangClass();

            //Erhoeht die Geschwindigkeit
            level += 1
            var lH = level / 5
            if (lH % 1 === 0) {
                levelHelper += 1
            }
            usrLevel = levelHelper - 4;
            $('#menu span').text(usrPoints)
            $('#menu span').animate({
                'font-size' : '+=40px',
                'box-shadow' : '20px 20px 5px 5px #333',
                top : '+=50px',
                left : '-=40px'
            }, 200, function() {
                $('#menu span').animate({
                    'font-size' : '30px',
                    'text-shadow' : '0 0 5px #222',
                    top : 0,
                    left : 0
                }, 300)
            });

        }

        for (var i = -1; i < anHangNum + 1; i++) {

            //varopAc = i / (anHangNum)

            $('#anhang' + i).css({
                left : lastPx[lastPx.length - i],
                top : lastPy[lastPy.length - i],
               // opacity : 1 / varopAc / 10,
                background : randColor
            })

       
        }

        $('#player').css({
            background : randColor
        });
	
        //Reduziert das Leben um eins wenn die Seitenwand beruehrt wird
        function lebenReducer() {
		lebenAnzahl--
            if (lebenAnzahl == 0) {
                $('#heart0').remove();
                var result = new Result();

            } else {
                $('#heart' + lebenAnzahl).remove();
            }
        }

        function splasher() {
            
            $('#splash').animate({
                'opacity' : '1'
            },0, function() {
                $('#splash').animate({
                    'opacity' : '0'
                })
            })
        }

        //Checkt die moegliche Collision mit dem fensterrahmen
        ////console.log(currPosX,currPosY,wianDx,winDy)
        if (currPosX > winDx) {
		//Set the bounce to true 
		 bounce = true;
		 if(bounce==true && vX==1){
			 vX =-1;
            	lebenReducer();
			splasher();
			bounce=false;
		}
        }
        if (currPosY > winDy) {
            //Set the bounce to true 
		 bounce = true;
		 if(bounce==true && vY==1){
			 vY =-1;
            	lebenReducer();
			splasher();
			bounce=false;
		}
        }
        if (currPosX < 40) {
           //Set the bounce to true 
		 bounce = true;
		 if(bounce==true && vX==-1){
			 vX =1;
            	lebenReducer();
            	splasher();
			bounce=false;
		}
        }
        if (currPosY < 40) {
           //Set the bounce to true 
		 bounce = true;
		 if(bounce==true && vY==-1){
			 vY =1;
            	lebenReducer();
			 splasher();
			bounce=false;
		}
        }
	  
        speedX = 2 * levelHelper * vX * pause;
        speedY = 2 * levelHelper * vY * pause;
    }
	

    function timer() {

        currTime++;
        //Speed
        bewegung();

        normPos();

        repeater = setTimeout(timer, 17);
        // repeat myself
    }

    var menu = new menuBuilder();
    new Splash();
    var player = new particleClass('player');
    var food = new foodClass();

    for ( i = 0; i < lebenAnzahl; i++) {
        lebensArray[i] = new leben(i);
    }

    function stopTimer() {// to be called when you want to stop the timer
        clearTimeout(repeater);
    }
    
} //End of Game//End of Game


function Start(){
	
	var e = document.createElement('div');
        e.id = "startMenu";
        $('body').append(e);
	
	var cont = document.createElement('div');
		cont.id='content';
		cont.innerHTML = '<h1>' + myContent[0] + '</h1><p>' + myContent[1] + '</p><div id="startButton">' + myContent[2] + '</div>';
		$('#startMenu').append(cont);
	}

//var start = new Start();
var game = new Game();
$('#startButton').click(function(){
	
	$('#startMenu').remove();
	var game = new Game();
	
	})


});