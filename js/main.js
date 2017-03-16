/*! modernizr 3.1.0 (Custom Build) | MIT *
 * http://modernizr.com/download/?-touchevents !*/
!function(e,n,t){function o(e,n){return typeof e===n}function s(){var e,n,t,s,a,i,r;for(var l in c){if(e=[],n=c[l],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(t=0;t<n.options.aliases.length;t++)e.push(n.options.aliases[t].toLowerCase());for(s=o(n.fn,"function")?n.fn():n.fn,a=0;a<e.length;a++)i=e[a],r=i.split("."),1===r.length?Modernizr[r[0]]=s:(!Modernizr[r[0]]||Modernizr[r[0]]instanceof Boolean||(Modernizr[r[0]]=new Boolean(Modernizr[r[0]])),Modernizr[r[0]][r[1]]=s),f.push((s?"":"no-")+r.join("-"))}}function a(e){var n=p.className,t=Modernizr._config.classPrefix||"";if(h&&(n=n.baseVal),Modernizr._config.enableJSClass){var o=new RegExp("(^|\\s)"+t+"no-js(\\s|$)");n=n.replace(o,"$1"+t+"js$2")}Modernizr._config.enableClasses&&(n+=" "+t+e.join(" "+t),h?p.className.baseVal=n:p.className=n)}function i(){return"function"!=typeof n.createElement?n.createElement(arguments[0]):h?n.createElementNS.call(n,"http://www.w3.org/2000/svg",arguments[0]):n.createElement.apply(n,arguments)}function r(){var e=n.body;return e||(e=i(h?"svg":"body"),e.fake=!0),e}function l(e,t,o,s){var a,l,f,c,d="modernizr",u=i("div"),h=r();if(parseInt(o,10))for(;o--;)f=i("div"),f.id=s?s[o]:d+(o+1),u.appendChild(f);return a=i("style"),a.type="text/css",a.id="s"+d,(h.fake?h:u).appendChild(a),h.appendChild(u),a.styleSheet?a.styleSheet.cssText=e:a.appendChild(n.createTextNode(e)),u.id=d,h.fake&&(h.style.background="",h.style.overflow="hidden",c=p.style.overflow,p.style.overflow="hidden",p.appendChild(h)),l=t(u,e),h.fake?(h.parentNode.removeChild(h),p.style.overflow=c,p.offsetHeight):u.parentNode.removeChild(u),!!l}var f=[],c=[],d={_version:"3.1.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var t=this;setTimeout(function(){n(t[e])},0)},addTest:function(e,n,t){c.push({name:e,fn:n,options:t})},addAsyncTest:function(e){c.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=d,Modernizr=new Modernizr;var u=d._config.usePrefixes?" -webkit- -moz- -o- -ms- ".split(" "):[];d._prefixes=u;var p=n.documentElement,h="svg"===p.nodeName.toLowerCase(),m=d.testStyles=l;Modernizr.addTest("touchevents",function(){var t;if("ontouchstart"in e||e.DocumentTouch&&n instanceof DocumentTouch)t=!0;else{var o=["@media (",u.join("touch-enabled),("),"heartz",")","{#modernizr{top:9px;position:absolute}}"].join("");m(o,function(e){t=9===e.offsetTop})}return t}),s(),a(f),delete d.addTest,delete d.addAsyncTest;for(var v=0;v<Modernizr._q.length;v++)Modernizr._q[v]();e.Modernizr=Modernizr}(window,document);
//_______________________________________________
var d = document;
var base_url = 'https://saschas.github.io/';
var holder = document.getElementById("holder");
var infoPanel = document.getElementById('infoPanel');
var singleExperiment = document.getElementById('single-experiment');
var close_single_experiment = document.getElementById('close_single_experiment');
var singleExperimentFrame = document.getElementById('single-experiment-frame');
var old_frame = null;
var framer = null;
var opt = {
  data : null,
  size : "small",
  commentsScriptLoaded : false,
  commentsOpen : false,
  commentsloaded : false
};
var disqus_config;

console.log('%c v_0.02' , 'font-weight: bold; color: #4caf50');

close_single_experiment.addEventListener('click',function(event){
  event.preventDefault(event);
  singleExperimentFrame.setAttribute('src','');
  singleExperiment.classList.remove('open');

});

function getData(url,callback,err){

var req = new XMLHttpRequest();
    req.open('GET',url , true);
    req.onreadystatechange = function (aEvt) {
      if (req.readyState == 4) {
        if(req.status == 200){
          callback(req.responseText);
        }
        else{
          err();
        }
      }
    };
    req.send(null);
}

getData('data.json',function(d){

  handleData(JSON.parse(d));
},function(){
  console.log("Error loading page\n");
});


function handler(event) {
  event.preventDefault(event);
  event.stopPropagation(event);
  window.location.hash = this._hash;

  old_frame = createIframe(this.href,this._own[0],this._hash);
}

function createIframe(url,src,hash){

  console.log(url,src,hash);
  //url.replace('http', 'https');
  opt.commentsOpen = false;
  opt.commentsloaded = false;


  var iFrameHolder = document.createElement("div");
      iFrameHolder._own = src;
  
  var closer = document.createElement("button");
      closer.innerHTML = "view source";
      closer.classList.add("closer");
      closer.title = "view source";
      closer.addEventListener("click",viewSource.bind(iFrameHolder));

  var disqusButton = document.createElement('button');
      disqusButton.innerHTML = 'comments';
      disqusButton.title = "comments";
      disqusButton.classList.add('disqus');

  var closeDisqus = document.createElement('button');
      closeDisqus.classList.add('close-comments');
      closeDisqus.innerHTML = "close comments";

  var aside = document.createElement('aside');
      aside.classList.add('comments');
  var commentsThread = document.createElement('div');
      commentsThread.setAttribute('id', 'disqus_thread');
        iFrameHolder.appendChild(aside);

  //comment Count
  // var commentCount = document.createElement('span');
  //     commentCount.classList.add('disqus-comment-count');
  //     commentCount.setAttribute('data-disqus-url', url);

  //     disqusButton.appendChild(commentCount);
  // var commentScript = d.createElement('script');
  //     commentScript.src = "//saschasgithubio.disqus.com/count.js";
  //     commentScript.setAttribute("id", "dsq-count-scr" );
  //     (d.head || d.body).appendChild(commentScript);

      aside.appendChild(commentsThread);
      aside.appendChild(closeDisqus);
        

      //set disqus_options on start iframe
      disqus_config = function () {      
        this.page.url = url;
        this.page.identifier = hash;  
        this.page.title = hash.replace('_', ' ');
      };

//Toggle
      function toggleComments(){
        aside.classList.toggle("open");
        disqusButton.classList.toggle("open");


        if(!opt.commentsOpen && !opt.commentsloaded){
          opt.commentsloaded = true;
          if(!opt.commentsScriptLoaded){

            //disqus
            
                s = d.createElement('script');
                s.src = '//saschasgithubio.disqus.com/embed.js';
                s.setAttribute('data-timestamp', +new Date());
                (d.head || d.body).appendChild(s);
                opt.commentsScriptLoaded = true;
            

          }else{
            DISQUS.reset({
              reload: true,
              config: function () {  
                this.page.url = url;
                this.page.identifier = hash;  
                this.page.title = hash.replace('_', ' ');
              }
            });
          }
        }

        opt.commentsOpen = !opt.commentsOpen;
      }
      //toggle sidebar with comments
      disqusButton.addEventListener('click',toggleComments);
      closeDisqus.addEventListener('click',toggleComments);

      iFrameHolder.classList.add("iFrameHolder");
      iFrameHolder.style.position = "fixed";
      iFrameHolder.style.top = 0;
      holder.appendChild(iFrameHolder);

console.log(url);
  var iFrame = document.createElement('iframe');
      iFrame.src = url;
      iFrame.style.background = "#fff";
      iFrame.setAttribute("id","framer");
      framer = iFrame;
    
      iFrameHolder.appendChild(iFrame);
      iFrameHolder.appendChild(disqusButton);
      iFrameHolder.appendChild(closer);
      iFrame.contentWindow.focus();
      setFrameSize(iFrameHolder,iFrame);

      if(old_frame != null){
        closeiFrame(old_frame);
      }

      return iFrameHolder;
}


//____________________________________________________


function viewSource() {

  var sourceView = document.createElement("div");
      sourceView.classList.add("source");
      this.appendChild(sourceView);
  var closeSource = document.createElement("div");
      closeSource.classList.add("closeSource");

      closeSource.addEventListener("click",closeSourceHandler.bind(sourceView),false);
      sourceView.appendChild(closeSource);
  

  getData(this._own,function(d){
    var myCodeMirror = CodeMirror(sourceView, {
      value: d,
      mode:  "javascript",
      theme: "monokai",
      readOnly : true,
      lineNumbers: true
    });
    myCodeMirror.setSize(sourceView.offsetWidth, sourceView.offsetHeight);
    myCodeMirror.refresh();
  },function(){
    console.log("Error loading page\n");
  });  
}


function closeSourceHandler(){
  var source = this;
  source.classList.add("remove");
  setTimeout(function(){
    source.parentNode.removeChild(source);
  },1000);
}

function closeiFrame(frame) {

  frame.classList.add("remove");
  setTimeout(function(){
    frame.parentNode.removeChild(frame);
  },1500);
  old_frame = null;
  framer = null;
}

function handleData(d){

  opt.data = d.data;

  console.log(opt.data);

  opt.data.forEach(function(art,index){

    var article = document.createElement('article');
        article.className= "experiment";

    var link = document.createElement('a');
        link.setAttribute('href', base_url + art.link);
        link.setAttribute('target', '_self');

        link.addEventListener('click',function(event){
          event.preventDefault(event);
          singleExperiment.classList.add('open');

          console.log(base_url + art.link);
          singleExperimentFrame.setAttribute('src',base_url + art.link );
        });

    var h1 = document.createElement('h1');
        h1.innerHTML = art.title;
        

    var img = document.createElement('img');
        img.src = art.img;

        link.appendChild(img);
        link.appendChild(h1);
if(art.content != ""){
    var p = document.createElement('p');
        p.innerHTML = art.content;
        link.appendChild(p);
}


    article.appendChild(link);

    holder.appendChild(article);

  });
/*
  var dataHolder = document.createElement("div");
      dataHolder.classList.add("dataHolder");

  opt.data.forEach(function(d,index) {
    var article = document.createElement("div");
        article.classList.add("single");
        article.title = d.title;


    var contHolder = document.createElement("div");
        contHolder.classList.add("content");

    var linkIMG = document.createElement("a");
        linkIMG.setAttribute("href",d.link);
        linkIMG.classList.add("linkIMG");
        linkIMG._own = d.jsSRC;

    var link = document.createElement("a");
        link.classList.add("link");
        link.innerHTML = d.title;
        link.setAttribute("href",base_url + d.link);
        link._own = d.jsSRC;
        
    var paragraph = document.createElement("p");
        paragraph.innerHTML = d.content;

    var title = document.createElement("h2");
        
    var img = new Image();
        img.src = d.img ;

    linkIMG.appendChild(img);
    title.appendChild(link);

    contHolder.appendChild(title);
    contHolder.appendChild(paragraph);

    article.appendChild(linkIMG);
    article.appendChild(contHolder);
      
      d.link = link;
      d.linkIMG = linkIMG;
      d.hash = d.title.split(' ').join('_');
      dataHolder.appendChild(article);
      linkIMG._hash = d.hash;
      link._hash = d.hash;



  });

  //var hash = window.location.hash.replace('#','');
  var hashIndex = 0;
  // opt.data.forEach(function(d,index){
  //   if(hash == d.hash){     
  //     hashIndex = index;
  //   }
  // });

  console.log(d.data[hashIndex].link,d.data[hashIndex].jsSRC,d.data[hashIndex].hash);
  old_frame = createIframe(d.data[hashIndex].link,d.data[hashIndex].jsSRC,d.data[hashIndex].hash);

  infoPanel.appendChild(dataHolder);

  */
}
/*
function setFrameLinks(){
  if(window.innerWidth > 800){
    opt.size = "large";
  }else{
    opt.size = "small";
  }

    opt.data.forEach(function(d,index){
      if(opt.size === "small"){
        d.link.removeEventListener('click',handler,false);
        d.linkIMG.removeEventListener('click',handler,false);
        d.link.setAttribute("target","_blank");
        d.linkIMG.setAttribute("target","_blank");
      }else{
        d.link.addEventListener('click',handler,false);
        d.linkIMG.addEventListener('click',handler,false);
        d.link.setAttribute("target","_self");
        d.linkIMG.setAttribute("target","_self");
      }
    });
 }


function setFrameSize(holder,f){
  setFrameLinks();
  holder.style.width = window.innerWidth - infoPanel.offsetWidth + "px";
  holder.style.height = window.innerHeight + "px";
  f.style.width = window.innerWidth - infoPanel.offsetWidth + "px";
  f.style.height = window.innerHeight + "px";
}

window.onresize = function(){
  if(framer != null){
    setFrameSize(old_frame,framer);
  }else{
    setFrameSize(old_frame,document.getElementById('framer'));
  }
}

*/
