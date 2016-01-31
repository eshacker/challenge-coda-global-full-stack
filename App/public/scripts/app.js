(function($){ // auto executed
  $(function(){ // when jQuery is available

    var jsonURI = "public/data/LearnHub.json", 
      data = null,
      courseCountTracker$ = $('#course-count .count'),
      searchButton$ = $('button#search.btn');

    courseCountTracker$.on('course-available', function(e, data){
      $(this).html(data);
    });

/* searching for courses */

    var searchCourses = function(){
      var criterion = $('#searchCriterion').val();
      var items = data.items.filter(function(x){
        return x.title.contains(criterion);
      });
      generateView(items);
    };

    searchButton$.on('click', searchCourses);
    $('#searchCriterion').on('change input', searchCourses);

/* Note: input in case of #searchCriterion would have become too much, if we were actually sending request to server. */
/* course search ends */

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
          data.items[i].detail = data.details[x];
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

      courseContainer$.html(''); // cleanup first

      var generateLeftContainer = function(item){
        var leftContainer$ = $('<div class="col-md-3"><div class="container-fluid"></div></div>');
        var imageContainer$ = $('<div class="row image"></div>');
        var ratingAndLinkContainer$ = $('<div class="row"><div class="container-fluid"><div class="row ratingAndLink"></div></div></div>');
        var rating$ = $('<div class="col-md-6 rating"></div>');
        var extLink$ = $('<div class="col-md-6 extLink"></div>');
        var image$ = $('<img src="'+item.image+'"/>');
        image$.appendTo(imageContainer$);
        rating$.text(item.rating);
        rating$.appendTo(ratingAndLinkContainer$);
        extLink$.html('<a href="'+item.extLink+'">Link</a>');
        extLink$.appendTo(ratingAndLinkContainer$);
        imageContainer$.appendTo(leftContainer$);
        ratingAndLinkContainer$.appendTo(leftContainer$);
        return leftContainer$;
      },
      generateCourseDetails = function(item){
        var courseDetailContainer$ = $('<div class="col-md-7 course-details"><div class="container-fluid"></div></div>');
        var courseTitle$ = $('<div class="row"><div class="title"></div></div>');
        var courseDetail$ = $('<div class="row"><div class="detail"></div></div>');
        courseDetail$.text(item.detail);
        courseTitle$.text(item.title);
        courseTitle$.appendTo(courseDetailContainer$);
        courseDetail$.appendTo(courseDetailContainer$);
        return courseDetailContainer$;
      },
      generateRightContainer = function(item){
        var rightContainer$ = $('<div class="col-md-2"><div class="container-fluid"></div></div>');
        var expertiseLevel$ = $('<div class="row expertise-level"></div>');
        expertiseLevel$.text(item.level);
        var cost$ = $('<div class="row cost"></div>');
        cost$.text(item.cost);
        expertiseLevel$.appendTo(rightContainer$);
        cost$.appendTo(rightContainer$);
        return rightContainer$;
      };

      var courseGenerator = function(item){
        var course$ = $('<div class="row course"></div>');
        generateLeftContainer(item).appendTo(course$);
        generateCourseDetails(item).appendTo(course$);
        generateRightContainer(item).appendTo(course$);
        return course$;
      };
      
      for(var i = 0, len = items.length; i < len; i++){
        courseGenerator(items[i]).appendTo(courseContainer$);
      }
      courseCountTracker$.trigger('course-available', [len]);
    }
  });
})(jQuery);

