!function(e,n,t){function a(e,n){return typeof e===n}function o(){var e,n,t,o,s,i,r;for(var d in c){if(e=[],n=c[d],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(t=0;t<n.options.aliases.length;t++)e.push(n.options.aliases[t].toLowerCase());for(o=a(n.fn,"function")?n.fn():n.fn,s=0;s<e.length;s++)i=e[s],r=i.split("."),1===r.length?p[r[0]]=o:(!p[r[0]]||p[r[0]]instanceof Boolean||(p[r[0]]=new Boolean(p[r[0]])),p[r[0]][r[1]]=o),l.push((o?"":"no-")+r.join("-"))}}function s(e){var n=u.className,t=p._config.classPrefix||"";if(v&&(n=n.baseVal),p._config.enableJSClass){var a=new RegExp("(^|\\s)"+t+"no-js(\\s|$)");n=n.replace(a,"$1"+t+"js$2")}p._config.enableClasses&&(n+=" "+t+e.join(" "+t),v?u.className.baseVal=n:u.className=n)}function i(){return"function"!=typeof n.createElement?n.createElement(arguments[0]):v?n.createElementNS.call(n,"http://www.w3.org/2000/svg",arguments[0]):n.createElement.apply(n,arguments)}function r(){var e=n.body;return e||(e=i(v?"svg":"body"),e.fake=!0),e}function d(e,t,a,o){var s,d,l,c,f="modernizr",p=i("div"),h=r();if(parseInt(a,10))for(;a--;)l=i("div"),l.id=o?o[a]:f+(a+1),p.appendChild(l);return s=i("style"),s.type="text/css",s.id="s"+f,(h.fake?h:p).appendChild(s),h.appendChild(p),s.styleSheet?s.styleSheet.cssText=e:s.appendChild(n.createTextNode(e)),p.id=f,h.fake&&(h.style.background="",h.style.overflow="hidden",c=u.style.overflow,u.style.overflow="hidden",u.appendChild(h)),d=t(p,e),h.fake?(h.parentNode.removeChild(h),u.style.overflow=c,u.offsetHeight):p.parentNode.removeChild(p),!!d}var l=[],c=[],f={_version:"3.1.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var t=this;setTimeout(function(){n(t[e])},0)},addTest:function(e,n,t){c.push({name:e,fn:n,options:t})},addAsyncTest:function(e){c.push({name:null,fn:e})}},p=function(){};p.prototype=f,p=new p;var h=f._config.usePrefixes?" -webkit- -moz- -o- -ms- ".split(" "):[];f._prefixes=h;var u=n.documentElement,v="svg"===u.nodeName.toLowerCase(),m=f.testStyles=d;p.addTest("touchevents",function(){var t;if("ontouchstart"in e||e.DocumentTouch&&n instanceof DocumentTouch)t=!0;else{var a=["@media (",h.join("touch-enabled),("),"heartz",")","{#modernizr{top:9px;position:absolute}}"].join("");m(a,function(e){t=9===e.offsetTop})}return t}),o(),s(l),delete f.addTest,delete f.addAsyncTest;for(var w=0;w<p._q.length;w++)p._q[w]();e.Modernizr=p}(window,document);var camera,controls,scene,scene2,light,renderer,div;$(document).ready(function(){function e(e){var n=$("<div />",{html:"&shy;<style>"+e+"</style>"}).appendTo("body")}console.log(!Modernizr.touchevents,window.innerWidth>700);var n=function(){var n=$(".webGL"),t=$(".tags"),a=[];n.each(function(e,n){var t=$(this),o=$('<div class="own_tags"/>'),s=$(this).attr("class");s=s.split(" "),s.forEach(function(e,n){-1==a.indexOf(e)&&a.push(e);var t=$("<span/>");t.append(e).appendTo(o)}),t.append(o)}),a=a.sort();var o=[];$.each(a,function(e,n){var a=$("<button>"),i=n;"twoD"==n&&(n="2D",i="twoD"),"threeD"==n&&(n="3D",i="threeD"),"webGL"!=n&&(a.attr("data-tag",i).append(n),t.append(a)),a.click(function(){console.log("click",$(this).data("tag"));var e=$(this).data("tag");$("body").hasClass(e)?($("body").removeClass(e),$(this).removeClass("active")):($("body").addClass(e),$(this).addClass("active"),$("body").addClass("filter"))}),o.push(".filter."+n+" ."+n+"{display:block!important;}"),$("body").append(s)});var s=$("<style>");return s.type="text/css",s.append(o.join("")),$("body").prepend(s),e(o.join(",")),t.addClass("tags-complete"),a}();$("#view_experiment").css({width:window.innerWidth,height:window.innerHeight}),$(".webGL a").click(function(e){e.preventDefault(e),$("#preview").addClass("open_iframe");var n=$(this).attr("href");$("#new_tab_iframe").attr("href",n).attr("target","_blank"),$("#view_experiment").unbind("load").attr("src",n).bind({load:function(){$(this).show().addClass("complete")}})})}),$("#close_iframe").click(function(){$("#view_experiment").hide().removeClass("complete").attr("src",""),$(".open_iframe").removeClass("open_iframe")}),window.onresize=function(){$("#view_experiment").css({width:window.innerWidth,height:window.innerHeight})};