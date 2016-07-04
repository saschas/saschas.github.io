var å = {
  data: {},
  size: 10,
  store_data : function(data){
    this.data = data;
  },
  calculate_stripes : function(count){
    if(!count){
      //console.warn('Missing Number! How many stripes do you wanna have?')
      return false;
    }
    var i,j,single_stripe,chunk = count;
      var stripes = [];

      for (i=0,j= this.data.length; i<j; i+=chunk) {
        single_stripe = this.data.slice(i,i+chunk);
        stripes.push(single_stripe);
      }
    return stripes;
  },
  stripes_count : 0,
  stripes_data : [],
  ////////////////////////////////////////
  ///// Get the audio data in smaller chunks
  ////////////////////////////////////////
  stripes : function(slice){
    if(!stripes){
      if(slice){
        if(slice != last_slice){
          last_slice = slice;
        }
        else{
          var last_slice = slice;
        }        
      }
      else{
        var last_slice = this.size;
      }
      var stripes = this.calculate_stripes(last_slice);
      this.stripes_count = stripes.length;
      this.stripes_data = stripes;
      //console.log('stripes count: '+ this.stripes_count)
      return false;
    }
    else{
      return false;
    }
  },
  loop : false,
  // Get the next stripes of data
  get_next_stripe : function () {
    var curr = 0;
    if(this.stripes_count != 0){
      curr = this.stripes_data.length - this.stripes_count;
     // console.log(curr, this.stripes_data.length,this.stripes_count,this.stripes_data[curr]);
      this.stripes_count--;
      if(this.stripes_data[curr]){
        return this.stripes_data[curr];
      }
      else{
        //console.log('there are no prev data stripes');
        return false;
      }
    }
    else{
      if(this.loop){        
        this.stripes_count = this.stripes_data.length;
        if(!this.stripes_data[0]){
          //console.warn('No stripes! Generate new .stripes() first!');
          return false;
        }
        else{
          console.log('looop')
          return this.stripes_data[0];
        }
      }
      else{
        console.log('ende');
        return false;
      }
    }   
  },
  // Get the prev stripes of data
  get_prev_stripe : function () {
    if(this.stripes_count != 0){
      if(this.stripes_count === this.stripes_data.length ){
        //console.warn('there are no prev data stripes');
      }
      else{
        this.stripes_count++;
        var curr = this.stripes_data.length-this.stripes_count;
        //console.log(this.stripes_data[curr]);
        return this.stripes_data[curr];
      }
    }
    else{
      //console.warn('run .stripes() first!');
    }   
  }
}
/*
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
$.ajax({
  dataType: "json",
  url: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/61062/audioData_4.json",
  success: function(data){
  // 1. Store data in å
  	å.store_data(data);
  // 2. split json obj array in consumable stripes
     å.stripes(10);
  // Have a look in your console 
  // you should have about 147 stripes, right?
    
 //  3. now you can call .get_next_stripe() 
 // to get the next stripe...index is 0 based
 	å.get_next_stripe();
    // Output would be stripes count: 147
    
  // 4. Or you call .get_stripe(n) function
  // to get an specific part of stripes
    å.get_stripe(2);
    
  // Of course you can call 
  // .get_prev_stripe() function as well...
  // keep in mind: if you call 
  // the get_stripe(2) function to get 
  // a specific stripe your prev and next 
  // stripe will be 1 and 3
    å.get_prev_stripe();
    
   }
});*/