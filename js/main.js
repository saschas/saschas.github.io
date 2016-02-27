/*! modernizr 3.1.0 (Custom Build) | MIT *
 * http://modernizr.com/download/?-touchevents !*/
!function(e,n,t){function o(e,n){return typeof e===n}function s(){var e,n,t,s,a,i,r;for(var l in c){if(e=[],n=c[l],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(t=0;t<n.options.aliases.length;t++)e.push(n.options.aliases[t].toLowerCase());for(s=o(n.fn,"function")?n.fn():n.fn,a=0;a<e.length;a++)i=e[a],r=i.split("."),1===r.length?Modernizr[r[0]]=s:(!Modernizr[r[0]]||Modernizr[r[0]]instanceof Boolean||(Modernizr[r[0]]=new Boolean(Modernizr[r[0]])),Modernizr[r[0]][r[1]]=s),f.push((s?"":"no-")+r.join("-"))}}function a(e){var n=p.className,t=Modernizr._config.classPrefix||"";if(h&&(n=n.baseVal),Modernizr._config.enableJSClass){var o=new RegExp("(^|\\s)"+t+"no-js(\\s|$)");n=n.replace(o,"$1"+t+"js$2")}Modernizr._config.enableClasses&&(n+=" "+t+e.join(" "+t),h?p.className.baseVal=n:p.className=n)}function i(){return"function"!=typeof n.createElement?n.createElement(arguments[0]):h?n.createElementNS.call(n,"http://www.w3.org/2000/svg",arguments[0]):n.createElement.apply(n,arguments)}function r(){var e=n.body;return e||(e=i(h?"svg":"body"),e.fake=!0),e}function l(e,t,o,s){var a,l,f,c,d="modernizr",u=i("div"),h=r();if(parseInt(o,10))for(;o--;)f=i("div"),f.id=s?s[o]:d+(o+1),u.appendChild(f);return a=i("style"),a.type="text/css",a.id="s"+d,(h.fake?h:u).appendChild(a),h.appendChild(u),a.styleSheet?a.styleSheet.cssText=e:a.appendChild(n.createTextNode(e)),u.id=d,h.fake&&(h.style.background="",h.style.overflow="hidden",c=p.style.overflow,p.style.overflow="hidden",p.appendChild(h)),l=t(u,e),h.fake?(h.parentNode.removeChild(h),p.style.overflow=c,p.offsetHeight):u.parentNode.removeChild(u),!!l}var f=[],c=[],d={_version:"3.1.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var t=this;setTimeout(function(){n(t[e])},0)},addTest:function(e,n,t){c.push({name:e,fn:n,options:t})},addAsyncTest:function(e){c.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=d,Modernizr=new Modernizr;var u=d._config.usePrefixes?" -webkit- -moz- -o- -ms- ".split(" "):[];d._prefixes=u;var p=n.documentElement,h="svg"===p.nodeName.toLowerCase(),m=d.testStyles=l;Modernizr.addTest("touchevents",function(){var t;if("ontouchstart"in e||e.DocumentTouch&&n instanceof DocumentTouch)t=!0;else{var o=["@media (",u.join("touch-enabled),("),"heartz",")","{#modernizr{top:9px;position:absolute}}"].join("");m(o,function(e){t=9===e.offsetTop})}return t}),s(),a(f),delete d.addTest,delete d.addAsyncTest;for(var v=0;v<Modernizr._q.length;v++)Modernizr._q[v]();e.Modernizr=Modernizr}(window,document);
//_______________________________________________
var camera;
var controls;
var scene,scene2;
var light;
var renderer;
var div;
$(document).ready(function(){
    console.log(!Modernizr.touchevents ,window.innerWidth > 700);
        var tags = function(){
            var $thumbs = $('.webGL');
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
            $.each(tags,function(index,c){
                var $span = $('<button>');


                var attr = c;

                if(c=='twoD'){
                    c = '2D';
                    attr = 'twoD';
                }

                if(c=='threeD'){
                    c = '3D';
                    attr = 'threeD';
                }


                if(c!='webGL'){
                   $span.attr('data-tag',attr).append(c);
                    $tag_holder.append($span);
                }

            });

            $tag_holder.addClass('tags-complete');

            return tags;
        }();

    
   //$('.experiments-tags').click(function(){
   //    $(this).toggleClass('tags-open');
   //    $(this).toggleClass('tags-visible');
   //});

   $('.tags button').click(function(){
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

     if($('body').attr('class').length == 6){
        $('body').removeClass('filter');
     }
   });
   

   $('#view_experiment').css({
       width : window.innerWidth,
       height : window.innerHeight
   });


   $('.webGL a').click(function(e){
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

