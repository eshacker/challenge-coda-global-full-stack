(function($){ // auto executed
  $(function(){ // when jQuery is available

/* I could have fetched data everytime a category, search or sort was required.
 * but, instead I have taken low road of putting a global `data` variable out.
 * Whenever code is accessing data to fetch data.items, think it is making a
 * request to database via ajax. 
 */

    var jsonURI = "public/data/LearnHub.json", 
      data = null,
      courseCountTracker$ = $('#course-count .count'),
      searchButton$ = $('button#search.btn'),
      courseContainer$ = $('.course-container');

    courseCountTracker$.on('course-available', function(e, data){
      $(this).html(data);
    });

/* checkbox */

    var itemsInSelectedCategories = function(){
      var checked$ = $('form#category-form :checkbox');
      var values = [];
      var allUnchecked = true;
      checked$.each(function(i, e){
        if($(checked$[i]).is(':checked')){
          allUnchecked = false;
          values.push($(checked$[i]).val());
        }
      });
      var items = [];
      data.items.forEach(function(item){
        values.forEach(function(x){
          if(item.category.toLowerCase().contains(x.toLowerCase())){
            items.push(item);
          }
        });
      });
      items = allUnchecked ? data.items : items;
      console.log(items.length);
      return items;
    };

    $('form#category-form').on('click', ':checkbox', function(){ 
      generateView(itemsInSelectedCategories());
    });

/* category code ends */

/* Sorting */
/* Sorting is dependent upon categories selected */

    var sortRating$ = $('#sort-by-ratings'),
      sortCost$ = $('#sort-by-cost');

    sortRating$.on('click', function(){
      var items = itemsInSearch();
      var nitems = items.sort(function(a, b){
        return b.rating - a.rating;
      });
      generateView(nitems);
    });

    sortCost$.on('click', function(){
      var items = itemsInSearch();
      var nitems = items.sort(function(a, b){
        var aCost = a.cost,
          bCost = b.cost;

        if(aCost == 0){
          aCost = 0;
        } else {
          aCost = aCost.replace(/^\D+|\D+$/g, "").split('.')[0].split(',');
          aCost = parseInt(aCost[0] + aCost[1]);
        }
        if(bCost == 0){
          bCost = 0;
        } else {
          bCost = bCost.replace(/^\D+|\D+$/g, "").split('.')[0].split(',');  
          bCost = parseInt(bCost[0] + bCost[1]);
        }
        return aCost - bCost;
      });
      generateView(nitems);
    });

/* sorting ends */

/* searching for courses */
/* Search is dependent upon categories selected */
    var itemsInSearch = function(){
       var criterion = $('#searchCriterion').val().toLowerCase();
       var items = itemsInSelectedCategories();
       items = items.filter(function(x){
         return x.title.toLowerCase().contains(criterion);
       });
      return items;
    },
    searchCourses = function(){
      generateView(itemsInSearch());
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
      courseContainer$.html(''); // cleanup first

      var generateLeftContainer = function(item){
        var leftContainer$ = $('<div class="col-md-3"><div class="container-fluid"></div></div>');
        var imageContainer$ = $('<div class="row image"></div>');
        var ratingAndLinkContainer$ = $('<div class="row"><div class="container-fluid"><div class="row ratingAndLink"></div></div></div>');
        var rating$ = $('<div class="col-md-6 rating"></div>');
        var extLink$ = $('<div class="col-md-6 extLink"></div>');
        var image$ = $('<img src="'+item.image+'"/>');
        image$.appendTo(imageContainer$);
        for(var i = 0; i < 5; i++){
          if(i < Math.floor(item.rating)){
            rating$.append('<i class="fa fa-star"></i>');
          } else if(i === Math.floor(item.rating) && item.rating*2 %2 === 1){
            rating$.append('<i class="fa fa-star-half-o"></i>');            
          } else {
            rating$.append('<i class="fa fa-star-o"></i>');
          }
        }
        rating$.data('rating', item.rating);
        rating$.appendTo(ratingAndLinkContainer$);
        extLink$.html('<a href="'+item.extLink+'" title="'+item.extLink+'">Link <i class="fa fa-external-link"></i></a>');
        extLink$.appendTo(ratingAndLinkContainer$);
        imageContainer$.appendTo(leftContainer$);
        ratingAndLinkContainer$.appendTo(leftContainer$);
        return leftContainer$;
      },
      generateCourseDetails = function(item){
        var courseDetailContainer$ = $('<div class="col-md-7 course-details"><div class="container-fluid"></div></div>');
        var courseTitle$ = $('<div class="row course-title"><div class="title"></div></div>');
        var courseDetail$ = $('<div class="row course-detail"><div class="detail"></div></div>');
        courseDetail$.text(item.detail);
        courseTitle$.text(item.title);
        courseTitle$.appendTo(courseDetailContainer$);
        courseDetail$.appendTo(courseDetailContainer$);
        return courseDetailContainer$;
      },
      generateRightContainer = function(item){
        var rightContainer$ = $('<div class="col-md-2"><div class="container-fluid"></div></div>');
        var expertiseLevel$ = $('<div class="row expertise-level ribbon"></div>');
        expertiseLevel$.text(item.level);
        var cost$ = $('<div class="row cost"></div>');
        if(item.cost == 0){ cost$.text("Free"); } else { cost$.text(item.cost); }
        expertiseLevel$.appendTo(rightContainer$);
        cost$.appendTo(rightContainer$);
        return rightContainer$;
      };

      var courseGenerator = function(item){
        var course$ = $('<div class="row course" id="'+item.id+'"></div>');
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

