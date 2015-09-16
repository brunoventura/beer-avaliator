(function(){
  $( document ).ready(function() {
    $.getJSON( "http://10.0.0.105:8000/api-v1/beer", {crossDomain : true})
    .done(function(data) {
      var block = $("#main header");
      $(block).find(".avatar img").attr('src', data.img);
      $(block).find(".name").text(data.nome);
    });

  });
}());
