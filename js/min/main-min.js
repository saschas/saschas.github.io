function getData(e,t,n){var a=new XMLHttpRequest;a.open("GET",e,!0),a.onreadystatechange=function(e){4==a.readyState&&(200==a.status?t(a.responseText):n())},a.send(null)}function handler(e){e.preventDefault(e),e.stopPropagation(e),window.location.hash=this._hash,old_frame=createIframe(this.href,this._own[0],this._hash)}function createIframe(e,t,n){function a(){c.classList.toggle("open"),l.classList.toggle("open"),opt.commentsOpen||opt.commentsloaded||(opt.commentsloaded=!0,opt.commentsScriptLoaded?DISQUS.reset({reload:!0,config:function(){this.page.url=e,this.page.identifier=n,this.page.title=n.replace("_"," ")}}):(s=d.createElement("script"),s.src="//saschasgithubio.disqus.com/embed.js",s.setAttribute("data-timestamp",+new Date),(d.head||d.body).appendChild(s),opt.commentsScriptLoaded=!0)),opt.commentsOpen=!opt.commentsOpen}opt.commentsOpen=!1,opt.commentsloaded=!1;var o=document.createElement("div");o._own=t;var i=document.createElement("button");i.innerHTML="view source",i.classList.add("closer"),i.title="view source",i.addEventListener("click",viewSource.bind(o));var l=document.createElement("button");l.innerHTML="comments",l.title="comments",l.classList.add("disqus");var r=document.createElement("button");r.classList.add("close-comments"),r.innerHTML="close comments";var c=document.createElement("aside");c.classList.add("comments");var m=document.createElement("div");m.setAttribute("id","disqus_thread"),o.appendChild(c),c.appendChild(m),c.appendChild(r),disqus_config=function(){this.page.url=e,this.page.identifier=n,this.page.title=n.replace("_"," ")},l.addEventListener("click",a),r.addEventListener("click",a),o.classList.add("iFrameHolder"),o.style.position="fixed",o.style.top=0,holder.appendChild(o);var p=document.createElement("iframe");return p.src=e,p.style.background="#fff",p.setAttribute("id","framer"),framer=p,o.appendChild(p),o.appendChild(l),o.appendChild(i),p.contentWindow.focus(),setFrameSize(o,p),null!=old_frame&&closeiFrame(old_frame),o}function viewSource(){var e=document.createElement("div");e.classList.add("source"),this.appendChild(e);var t=document.createElement("div");t.classList.add("closeSource"),t.addEventListener("click",closeSourceHandler.bind(e),!1),e.appendChild(t),getData(this._own,function(t){var n=CodeMirror(e,{value:t,mode:"javascript",theme:"monokai",readOnly:!0,lineNumbers:!0});n.setSize(e.offsetWidth,e.offsetHeight),n.refresh()},function(){console.log("Error loading page\n")})}function closeSourceHandler(){var e=this;e.classList.add("remove"),setTimeout(function(){e.parentNode.removeChild(e)},1e3)}function closeiFrame(e){e.classList.add("remove"),setTimeout(function(){e.parentNode.removeChild(e)},1500),old_frame=null,framer=null}function handleData(e){opt.data=e.data;var t=document.createElement("div");t.classList.add("dataHolder"),opt.data.forEach(function(e,n){var a=document.createElement("button");a.classList.add("single"),a.title=e.title;var o=document.createElement("div");o.classList.add("content");var i=document.createElement("a");i.setAttribute("href",e.link),i.classList.add("linkIMG"),i._own=e.jsSRC;var s=document.createElement("a");s.classList.add("link"),s.innerHTML=e.title,s.setAttribute("href",e.link),s._own=e.jsSRC;var d=document.createElement("p");d.innerHTML=e.content;var l=document.createElement("h2"),r=new Image;r.src=e.img,i.appendChild(r),l.appendChild(s),o.appendChild(l),o.appendChild(d),a.appendChild(i),a.appendChild(o),e.link=s,e.linkIMG=i,e.hash=e.title.split(" ").join("_"),t.appendChild(a),i._hash=e.hash,s._hash=e.hash});var n=window.location.hash.replace("#",""),a=0;opt.data.forEach(function(e,t){n==e.hash&&(a=t)}),old_frame=createIframe(e.data[a].link,e.data[a].jsSRC,e.data[a].hash),infoPanel.appendChild(t)}function setFrameLinks(){window.innerWidth>800?opt.size="large":opt.size="small",opt.data.forEach(function(e,t){"small"===opt.size?(e.link.removeEventListener("click",handler,!1),e.linkIMG.removeEventListener("click",handler,!1),e.link.setAttribute("target","_blank"),e.linkIMG.setAttribute("target","_blank")):(e.link.addEventListener("click",handler,!1),e.linkIMG.addEventListener("click",handler,!1),e.link.setAttribute("target","_self"),e.linkIMG.setAttribute("target","_self"))})}function setFrameSize(e,t){setFrameLinks(),e.style.width=window.innerWidth-infoPanel.offsetWidth+"px",e.style.height=window.innerHeight+"px",t.style.width=window.innerWidth-infoPanel.offsetWidth+"px",t.style.height=window.innerHeight+"px"}!function(e,t,n){function a(e,t){return typeof e===t}function o(){var e,t,n,o,i,s,d;for(var l in c){if(e=[],t=c[l],t.name&&(e.push(t.name.toLowerCase()),t.options&&t.options.aliases&&t.options.aliases.length))for(n=0;n<t.options.aliases.length;n++)e.push(t.options.aliases[n].toLowerCase());for(o=a(t.fn,"function")?t.fn():t.fn,i=0;i<e.length;i++)s=e[i],d=s.split("."),1===d.length?p[d[0]]=o:(!p[d[0]]||p[d[0]]instanceof Boolean||(p[d[0]]=new Boolean(p[d[0]])),p[d[0]][d[1]]=o),r.push((o?"":"no-")+d.join("-"))}}function i(e){var t=f.className,n=p._config.classPrefix||"";if(h&&(t=t.baseVal),p._config.enableJSClass){var a=new RegExp("(^|\\s)"+n+"no-js(\\s|$)");t=t.replace(a,"$1"+n+"js$2")}p._config.enableClasses&&(t+=" "+n+e.join(" "+n),h?f.className.baseVal=t:f.className=t)}function s(){return"function"!=typeof t.createElement?t.createElement(arguments[0]):h?t.createElementNS.call(t,"http://www.w3.org/2000/svg",arguments[0]):t.createElement.apply(t,arguments)}function d(){var e=t.body;return e||(e=s(h?"svg":"body"),e.fake=!0),e}function l(e,n,a,o){var i,l,r,c,m="modernizr",p=s("div"),u=d();if(parseInt(a,10))for(;a--;)r=s("div"),r.id=o?o[a]:m+(a+1),p.appendChild(r);return i=s("style"),i.type="text/css",i.id="s"+m,(u.fake?u:p).appendChild(i),u.appendChild(p),i.styleSheet?i.styleSheet.cssText=e:i.appendChild(t.createTextNode(e)),p.id=m,u.fake&&(u.style.background="",u.style.overflow="hidden",c=f.style.overflow,f.style.overflow="hidden",f.appendChild(u)),l=n(p,e),u.fake?(u.parentNode.removeChild(u),f.style.overflow=c,f.offsetHeight):p.parentNode.removeChild(p),!!l}var r=[],c=[],m={_version:"3.1.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,t){var n=this;setTimeout(function(){t(n[e])},0)},addTest:function(e,t,n){c.push({name:e,fn:t,options:n})},addAsyncTest:function(e){c.push({name:null,fn:e})}},p=function(){};p.prototype=m,p=new p;var u=m._config.usePrefixes?" -webkit- -moz- -o- -ms- ".split(" "):[];m._prefixes=u;var f=t.documentElement,h="svg"===f.nodeName.toLowerCase(),v=m.testStyles=l;p.addTest("touchevents",function(){var n;if("ontouchstart"in e||e.DocumentTouch&&t instanceof DocumentTouch)n=!0;else{var a=["@media (",u.join("touch-enabled),("),"heartz",")","{#modernizr{top:9px;position:absolute}}"].join("");v(a,function(e){n=9===e.offsetTop})}return n}),o(),i(r),delete m.addTest,delete m.addAsyncTest;for(var g=0;g<p._q.length;g++)p._q[g]();e.Modernizr=p}(window,document);var d=document,base_url="https://saschas.github.io/",holder=document.getElementById("holder"),infoPanel=document.getElementById("infoPanel"),old_frame=null,framer=null,opt={data:null,size:"small",commentsScriptLoaded:!1,commentsOpen:!1,commentsloaded:!1},disqus_config;console.log("ready"),getData("data.json",function(e){handleData(JSON.parse(e))},function(){console.log("Error loading page\n")}),window.onresize=function(){null!=framer?setFrameSize(old_frame,framer):setFrameSize(old_frame,document.getElementById("framer"))};