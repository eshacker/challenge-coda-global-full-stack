(function($){
  var jsonURI = "../data/LearnHub.json", 
    data = null;

  $.getJSON(jsonURI)
    .done(function (json) {
      data = json;
      console.log(data);
    })
    .fail(function (jqxhr, textStatus, error) {
      console.error("ERROR: " + textStatus + ", " + error);
    })
    .always(function () {
      console.log("Finished.");
    });
})(jQuery);

