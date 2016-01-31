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
        i++;
      }
      generateView(data.items);
    })
    .fail(function (jqxhr, textStatus, error) {
      console.error("ERROR: " + textStatus + ", " + error);
    })
    .always(function () {
      console.log("Finished.");
    });

  var generateView = function(items){
    var courseContainer$ = $('.course-container');
    var courseGenerator = function(item){
      var course$ = $('<div class="row course"></div>');
      var leftContainer$ = $('<div class="col-md-3"><div class="container-fluid"></div></div>');
      var imageContainer$ = $('<div class="row image"></div>');
      var ratingAndLinkContainer$ = $('<div class="row"><div class="container-fluid"><div class="row ratingAndLink"></div></div></div>');
      var rating$ = $('<div class="col-md-6 rating"></div>');
      var extLink$ = $('<div class="col-md-6 extLink"></div>');
      rating$.text(item.rating);
      rating$.appendTo(ratingAndLinkContainer$);
      extLink$.html('<a href="'+item.extLink+'">Link</a>');
      extLink$.appendTo(ratingAndLinkContainer$);
      imageContainer$.appendTo(leftContainer$);
      ratingAndLinkContainer$.appendTo(leftContainer$);
      leftContainer$.appendTo(course$);      
      return course$;
    };
    
    for(var i = 0, len = items.length; i < len; i++){
      var c$ = courseGenerator(items[i]);
      c$.appendTo(courseContainer$);
    }
  }
})(jQuery);

