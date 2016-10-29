function AudioBufferLoader(context) {
  this.context = context;
  this.loadCount = 0;
  this.bufferList = {};
}

AudioBufferLoader.prototype.loadBuffer = function(name,url, cb) {

  if(name in this.bufferList){
    cb(this.bufferList[name]);
  }else{

    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    var that = this;

    request.onload = function() {
      // Asynchronously decode the audio file data in request.response
      that.context.decodeAudioData(
        request.response,
        function(buffer) {
          if (!buffer) {
            console.log('error decoding file data: ' + url);
            return;
          }

          that.bufferList[name] = buffer;
          
          cb(that.bufferList[name]);
        },
        function(error) {
          console.error('decodeAudioData error', error);
        });
    }//onload

    request.onerror = function() {
      console.log('BufferLoader: XHR error');
    }//onerror

    request.send();
  }  
}