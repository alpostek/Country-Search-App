import "../sass/style.scss"


$(function(){

  var button = $("#btn");


// var countriesVal = {
//   url: function (phrase) {
//     if (phrase !== ""){
//       return "https://restcountries.eu/rest/v2/name/" + phrase
//     }
//   },
//
//   ajaxSettings: {
//     dataType: "json",
//   },
//
//   getValue: "name",
//
//   list:{
//     match: {
//       enabled: true
//     }
//   }
// }
//
//   $("#inpt").easyAutocomplete(countriesVal);




$("#inpt").autocomplete({
  source: function(request, response){
    $.ajax({
      url: "https://restcountries.eu/rest/v2/name/" + request.term,
      type: "GET",
      success: function(data){
      response ($.map(data, function(item){
        return item.name;
      }))
    }
  })
},
minLength: 2,
select: function(event, ui){
},


appendTo: $(".ui-widget")

})



function loadData(){
  var country = $("#inpt").val();
  var countryWiki = country.replace(/ /g, "_");

  var toClear = $(".clear");

  toClear.text("");
  $(".flag").css("background-image", "none");
  $("table").removeClass("hide");
  $(".tableinfo").css("height", "auto");
  // $(".tableinfo").addClass(".tableinfo_height");


  var countriesUrl = `https://restcountries.eu/rest/v2/name/${country}`

  $.ajax({
    url: countriesUrl,
    dataType: "json",
    type: "GET"
  }).done(function(data){
    $.each(data, function(index, element){
      $(".tablecountry").find("th:first-child").append(`<p>${element.name}</p>`)
      $("tbody").find("tr:first-of-type").find("td:nth-child(2)").append(`<p>${element.capital}</p>`)
      $("tbody").find("tr:nth-of-type(2)").find("td:nth-child(2)").append(`<p>${element.languages[0].name}</p>`)
      $("tbody").find("tr:nth-of-type(3)").find("td:nth-child(2)").append(`<p>${element.region}</p>`)
      $("tbody").find("tr:nth-of-type(4)").find("td:nth-child(2)").append(`<p>${element.subregion}</p>`)
      $("tbody").find("tr:nth-of-type(5)").find("td:nth-child(2)").append(`<p>${element.topLevelDomain}</p>`)
      $("tbody").find("tr:nth-of-type(6)").find("td:nth-child(2)").append(`<p>${element.population}</p>`)
      $("tbody").find("tr:nth-of-type(7)").find("td:nth-child(2)").append(`<p>${element.currencies[0].name}</p>`)
      $(".flag").css("background-image", "url(" + `${element.flag}` + ")");
    })
  }).fail(function(){
    // $(".tablecountry").find("th:first-child").append(`<p>Request failed</p>`)
    $(".fail").append("<p>Request failed</p>");
    $("table").addClass("hide");
    $(".tableinfo").css("height", "75%");
  })

  var wikiUrl = "https://wikipedia.org/w/api.php?action=query&prop=extracts&exintro&exsentences=4&exlimit=5&format=json&titles=" + countryWiki + "&indexpageids=";

  $.ajax({
    url: wikiUrl,
    dataType: "jsonp",
    type: 'GET'
  }).done(function(wikiData){
    console.log(wikiData)
    $.each(wikiData, function(index, wikiElement){
      var wikiPage = wikiElement.pages;
      $.each(wikiPage, function(index, element){
        $(".wikiinfo").append(`<p>${element.extract}</p>`);
      })
    })
  }).fail(function(){
        $(".tablecountry").find("th:first-child").append(`<p>Request to Wikipedia failed</p>`)
      });

}

button.on("click", function(event){
  event.preventDefault();
  loadData();

})

})
