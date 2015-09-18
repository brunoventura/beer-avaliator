(function(){
  var api = "http://192.168.25.7:8000/api-v1/beer/"
  var globalBeer = null;

  var printVotes = function(votes) {
    var likes =  $('[data-value="likes"]');
    var dislikes =  $('[data-value="dislikes"]');
    $(likes).text("+" + ((votes && votes.up) || 0));
    $(dislikes).text("-" + ((votes && votes.down) || 0));
  };

  var renderBeer = function(beer) {
    var block = $("#main header");
    $(block).find(".avatar img").one('load', function() {
      $(block).find(".name").text(beer.nome);
      printVotes(beer.votes);
      globalBeer = beer;
    }).attr('src', beer.img);
  };

  var getBeer = function() {
    $.getJSON(api, {crossDomain : true}).done(renderBeer);
  };

  var postVote = function(vote) {
    if (!globalBeer.votes) globalBeer.votes = {up: 0, down: 0};
    globalBeer.votes[vote]++;
    printVotes();
    $.ajax({
      url: api + globalBeer._id + "/vote",
      contentType: 'application/json',
      data: JSON.stringify({vote: vote}),
      processData: false,
      type: 'POST',
    }).done(function(data) {
      getBeer();
    });
  }

  var bindActions = function() {
    $("[data-action='vote']").click(function() {
      postVote($(this).attr("data-value"));
    });
    $("[data-action='refresh']").click(function() {
      getBeer();
    });
  }

  $( document ).ready(function() {
    getBeer();
    bindActions();
  });
}());
