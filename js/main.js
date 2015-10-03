var camera;
var controls;
var scene,scene2;
var light;
var renderer;
var div;
$(document).ready(function(){
    
    var tags = function(){
        var $thumbs = $('.thumb');
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
            var $span = $('<span>');
          

            var attr = c;

            if(c=='twoD'){
                c = '2D';
                attr = 'twoD';
            }

            if(c=='threeD'){
                c = '3D';
                attr = 'threeD';
            }


            if(c!='thumb'){
               $span.attr('data-tag',attr).append(c);
                $tag_holder.append($span);
            }
            
        });
        return tags;
    }();

   $('.tags span').click(function(){
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

        console.log($('body').attr('class').length);
     if($('body').attr('class').length == 6){
        $('body').removeClass('filter');
     }
   });
   

   $('#view_experiment').css({
       width : window.innerWidth,
       height : window.innerHeight
   });


   $('.thumb a').click(function(e){
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

