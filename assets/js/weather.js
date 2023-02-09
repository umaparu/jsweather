// OPenWeatherMap
var APPID = "f07bf58d218143ec8ee0c51754d37a7c";

// Array of cities
var cityArr= [];

// Flag to check if City is already in search history
var inStore= false;

// variable to store weather details
var weather;

// Function to load City list from Local history on page load
$(document).ready(function() {
  // If no data is there then hide the weather divs
  if (weather == null) {
    $("#citytoday").hide();
    $("#forecast").hide();
  }  

  // Get all the cities searched earlier from Local storage
  checkCities();
});




 // Get all the cities searched earlier from Local storage
function checkCities(){
  // Check if localstorage is not empty, then find cities stored in it
  if (localStorage.length >0)
  {
    // Get all objects from localstorage having key as "wcities" and add to an array. This array will later appended with new cities searched
    for ( var i = 0, len = localStorage.length; i < len; ++i ) {
      var key1 =localStorage.key(i);
      if (key1.substring(0,7)== "wcities") {
        
        keyVal = localStorage.getItem( key1 );
        cityArr.push(keyVal);
      }
    }
  }
  // Display all the cities added to cityArr to history DIV
  //IF there are spaces in city name replace that with "%20" to avoid link issues
  for (i=0; i<cityArr.length; i++) {
    let selCity =  (cityArr[i] +"").trim();
    var x = selCity.indexOf(' ');
    if (x> -1) {
      let arr1 = selCity.split(" ");
      let selCity1 =arr1[0] +"%20" +arr1[1];
    } else {
      selCity1=selCity;
    }

    // Building a string for the function, since having issues directly adding in tags
    cityURL="javascript:searchCity('"+ selCity1 +"')";
    // $('#weather-list').append("<li class='list-group-item list-group-item-action list-group-item-dark mt-2 p-0 border-1 rounded-lg w-100 text-dark'><a href=" + cityURL + ">"+  selCity +"</href></li>");
    $('#weather-list').append("<li class='list-group-item list-group-item-action list-group-item-dark mt-2 p-0 border-1 rounded-lg w-100' onmousedown="+ cityURL +">"+  selCity +"</li>");
  }
}


// JQuery function for search button click
$("#search-button").click(function(){
  var txtVal = $('#search-input').val().trim();
  if ((txtVal !=null) && (txtVal != ""))
  {

    // If new city searched is already in the list enable flag
    for ( var i = 0; i< cityArr.length;  i++ ) {
      if (txtVal.toLowerCase()== cityArr[i].toLowerCase()) {
       inStore =true;
       break;
    }
      else
        inStore =false;
    }
    // If flag enabled, city is already in list, so dont add again
    if (inStore == false) {
      var key;

      if ((cityArr == null) || (cityArr.length ==0)) {
        var key="wcities1"
      } else {
        var key="wcities"+ (cityArr.length+1) +"";

      }
      localStorage.setItem(key,txtVal)
      cityArr.push(txtVal);
      inStore =true;
      //alert(inStore);
      var selCity =  txtVal.trim();
      console.log(":"+selCity);
      cityURL="javascript:searchCity('"+ selCity +"')";
     // $('#weather-list').append("<li class='list-group-item p-3 rounded-lg'><a href=" + cityURL + ">"+  selCity +"</href></li>");
      $('#weather-list').append("<li class='list-group-item list-group-item-action list-group-item-dark mt-2 p-0 border-1 rounded-lg w-100' onmousedown="+ cityURL +">"+  selCity +"</li>");
     
    }
    // Invoke function to get the City weather details 
    getCityWeather(txtVal);
    // Get forecase details
    getWeatherDetails(txtVal);

    // Display the DIVs for weather details and forecast
    $("#citytoday").show();
    $("#forecast").show();
    return false;
  }

});

// Function to search weather details when city link is clicked from history
function searchCity(city1){
  getCityWeather(city1);
  getWeatherDetails(city1);

  $("#citytoday").show();
  $("#forecast").show();
  return false;
}

// Function to invoke Weather API and get weather details
function getCityWeather(city) {

  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + APPID;

  $.ajax({
  url: queryURL,
  method: "GET"
  }).then(function(response) {

    var cityName=response.name+"";
    var currDate=response.dt+"";
    var temp=response.main.temp+"";
    var wind=response.wind.speed+"";
    var humid=response.main.humidity+"";
    var icon=response.weather[0].icon+"";

    weather = {
      name: cityName,
      dt: currDate,
      temp: temp,
      wind: wind,
      humidity: humid,
      icon: icon
    };

    // Display weather details
    var currDate = moment().format("DD/MM/YYYY");
    var iconURL= "https://openweathermap.org/img/wn/" + icon +"@2x.png"
    var placeHead= weather.name + " ( " + currDate + " ) <img src='" + iconURL + "'>";
    $("#city").html(placeHead);
    $("#temp").html( "Temp : " + weather.temp + " °C");
    $("#wind").html( "Wind : " +weather.wind+ " kmph");
    $("#humidity").html("Humidity : " +weather.humidity+ " %");
  });

}

// Get forecast details for the city
function getWeatherDetails(city) {

  var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q="+ city + "&units=metric&appid=" + APPID;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    var forecast=response.list;
    var i=4;
    var divText="";

    while (i < forecast.length) {
      var weather = forecast[i]
      var currDate=weather.dt_txt+"";
      var temp=weather.main.temp+"";
      var wind=weather.wind.speed+"";
      var humidity=weather.main.humidity+"";
      var icon=weather.weather[0].icon+"";

      var weatherDate = moment(currDate.substring(0,10)).format('DD/MM/YYYY');
      var iconURL= "https://openweathermap.org/img/wn/" + icon +"@2x.png"

      // Display forecast details
      divText =  divText + '<div class="col gx-4 p-3 mb-2 ">';
      divText =  divText + '<div class="p-3 bg-dark text-white">'+  weatherDate + '</div>';
      divText =  divText + '<div class="p-3 bg-dark text-white"><img src="'+ iconURL +'"></icon></div>';
      divText =  divText + '<div class="p-3 bg-dark text-white">' + temp + ' °C </div>';
      divText =  divText + '<div class="p-3 bg-dark text-white">' + wind + ' kmph </div>';
      divText =  divText + '<div class="p-3 bg-dark text-white">'+ humidity +' %</div></div>';
      i=i+8;
  }

  $("#forecast-div").html( divText);

  });
  
}
