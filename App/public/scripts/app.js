(function($){
  var jsonURI = "public/data/LearnHub.json", 
    data = null;

  $.getJSON(jsonURI)
    .done(function (json) {
      data = json[0];
      data.items = [];
      var i = 0;
      for(var x in data.titles){
        data.items[i] = {};
        data.items[i].id = x;
        data.items[i].title = data.titles[x];
        data.items[i].rating = data.ratings[x];
        data.items[i].image = data.images[x];
        data.items[i].category = data.categories[x];
        data.items[i].level = data.levels[x];
        data.items[i].details = data.details[x];
        data.items[i].cost = data.costs[x];
        data.items[i].extLink = data.extLinks[x];
        console.log(data.items[i]);
        i++;
      }
    })
    .fail(function (jqxhr, textStatus, error) {
      console.error("ERROR: " + textStatus + ", " + error);
    })
    .always(function () {
      console.log("Finished.");
    });
})(jQuery);

