(function(){
  var api = "http://localhost:8000/api-v1/beer/"
  var globalBeer = null;

  var printVotes = function(votes) {
    var likes =  $('[data-value="like"] span');
    var dislikes =  $('[data-value="dislike"] span');
    $(likes).text("+" + (votes.like || 0));
    $(dislikes).text("-" + (votes.dislike || 0));
  };

  var renderBeer = function(beer) {
    var block = $(".header");
    $(block).find(".beer-photo-item").one('load', function() {
      $(block).find(".name").text(beer.nome);
      // printVotes({like: beer.like, dislike: beer.dislike});
      globalBeer = beer;
    }).attr('src', beer.img);
  };

  var renderRank = function(rank) {
    for(var i = 0; i < rank.length; i++) {
      console.log(rank[i].like);
      $('#rank ul').append("<li>"+(i+1)+". votes: "+(rank[i].like || 0)+" | nome: "+rank[i].nome+"</li>");
    }
  }

  var getRank = function() {
    $.getJSON("http://localhost:8000/api-v1/beer/rank").done(renderRank);
  };

  var getBeer = function() {
    $.getJSON(api, {crossDomain : true}).done(renderBeer);
  };


  var postVote = function(vote) {
    if (!globalBeer[vote]) globalBeer[vote] = 0;
    globalBeer[vote]++;
    // printVotes({
    //   like: globalBeer.like,
    //   dislike: globalBeer.dislike
    // });
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
    getRank();
  });
}());
