
var APIKey = process.env.WEATHER_API_KEY;

$(document).ready(function() {
  $("#currentDay").html((moment().format("dddd, MMMM Do")));
  $("#currentDate").val((moment().format("DDMMYYYY")));

  var currentHour = moment().format("H");
  var currentDateStr = moment().format("DDMMYYYY");
  
  //alert(typeof currentDate);

  // For testing ..
  //if (currentHour > 17) currentHour = 16;
  //alert(typeof currentHour);

  if (weather == null) {

    $("#citytoday").hide();
    $("#forecast").hide();
  }  



});

var weather;

$("#search-button").click(function(){
var txtVal = $('#search-input').val();
//alert(txtVal);
if (txtVal !=null)
{


localStorage.setItem("inputtext", txtVal);

$('#weather-list').append('<li class="list-group-item">'+ txtVal +'</li>');

getCityWeather(txtVal);

getWeatherDetails(txtVal);

//console.log(weatherTxt);
$("#citytoday").show();
$("#forecast").show();
//var placeHead= cityWeather.cityName + " ( " + cityWeather.dt + " ) ";
//alert(placeHead);
//$("#city").html(placeHead);


//alert(localStorage.getItem("inputtext"));
return false;
}

});

//-----------------------------
function getCityWeather(city) {

  //var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + APIKey;
  console.log(queryURL);

  //var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=London,UnitedKingdom&appid=" + APIKey;


  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
  
    // Create CODE HERE to Log the queryURL
    // Create CODE HERE to log the resulting object
    // Create CODE HERE to calculate the temperature (converted from Kelvin)
    // Create CODE HERE to transfer content to HTML
    // Hint: To convert from Kelvin to Celsius: C = K - 273.15
    // Create CODE HERE to dump the temperature content into HTML

    
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
  
  var currDate = moment().format("DD/MM/YYYY");
  var iconURL= "https://openweathermap.org/img/wn/" + icon +"@2x.png"
  //alert(iconURL);
    var placeHead= weather.name + " ( " + currDate + " ) <img src='" + iconURL + "'>";
    //alert(placeHead);
    $("#city").html(placeHead);
    $("#temp").html( "Temp : " + weather.temp + " °C");
    $("#wind").html( "Wind : " +weather.wind+ " kmph");
    $("#humidity").html("Humidity : " +weather.humidity+ " %");

    
   // let cityWeather = new Weather( response.name, response.dt, response.main.temp, response.wind.speed, response.main.humidity )
   //alert(cityWeather);
   //alert(cityWeather.name);
    //cityWeather = JSON.parse(weather);
  //return JSON.stringify(weather);
  });
  
}


function getWeatherDetails(city) {

  var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q="+ city + "&units=metric&appid=" + APIKey;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
  
    console.log("XXXXXXXXXXXXXXXXXXXXXXXXX");
    console.log(response);
    // Create CODE HERE to Log the queryURL
    // Create CODE HERE to log the resulting object
    // Create CODE HERE to calculate the temperature (converted from Kelvin)
    // Create CODE HERE to transfer content to HTML
    // Hint: To convert from Kelvin to Celsius: C = K - 273.15
    // Create CODE HERE to dump the temperature content into HTML

 var forecast=response.list;
 
 //var myWeather = [];
 var i=4;

 var divText="";
 while (i < forecast.length) {



  var weather = forecast[i]
  console.log(weather);

  var currDate=weather.dt_txt+"";
  var temp=weather.main.temp+"";
  var wind=weather.wind.speed+"";
  var humidity=weather.main.humidity+"";
  var icon=weather.weather[0].icon+"";

  var weatherDate = moment(currDate.substring(0,10)).format('DD/MM/YYYY');
  var iconURL= "https://openweathermap.org/img/wn/" + icon +"@2x.png"

console.log(iconURL);

console.log(temp);
console.log(wind);
console.log(humidity);
/*
  <div class="col gx-4 p-3 mb-2 bg-dark text-white">
  <div class="p-3" id="2date">Date : DATE </div>
  <div class="p-3" id="2icon">iconE </div>
  <div class="p-3" id="2temp">temp </div>
  <div class="p-3" id="2wind">wind </div>
  <div class="p-3" id="2humid">humid </div>
 </div>
 */

 divText =  divText + '<div class="col gx-4 p-3 mb-2 bg-dark text-white">';
 divText =  divText + '<div class="p-3">'+  weatherDate + '</div>';
 divText =  divText + '<div class="p-3"><img src="'+ iconURL +'"></icon></div>';
 divText =  divText + '<div class="p-3">' + temp + ' °C </div>';
 divText =  divText + '<div class="p-3">' + wind + ' kmph </div>';
 divText =  divText + '<div class="p-3">'+ humidity +' %</div></div>';




  i=i+8;
  }

  $("#forecast-div").html( divText);

});
  

}