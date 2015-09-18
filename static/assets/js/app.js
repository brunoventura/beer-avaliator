(function(){
  $( document ).ready(function() {
    $.getJSON('http://192.168.0.46:8000/api-v1/beer', {crossDomain : true})
    .done(function(data) {
      var block = $('.header');
      $(block).find('.beer-photo-item').attr('src', data.img);
      $(block).find('.name').text(data.nome);
    });
  });
}());
