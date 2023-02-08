//var APIKey = process.env.WEATHER_API_KEY;
var APIKey = "f07bf58d218143ec8ee0c51754d37a7c";

var cityArr= [];
var inStore= false;

   function checkCities(){


    if (localStorage.length >0)
    {

      for ( var i = 0, len = localStorage.length; i < len; ++i ) {

        var key1 =localStorage.key(i);
        if (key1.substring(0,7)== "wcities") {
          
          keyVal = localStorage.getItem( key1 );
        //  console.log("ssssssssss"+ key1 + "------" + keyVal);

          cityArr.push(keyVal);
          //console.log("EEEEEEEEEEEE"+cityArr.length);
          //console.log( keyVal );
        }

      }
    }

    for (i=0; i<cityArr.length; i++) {
      //$('#weather-list').append('<li class="list-group-item">'+ cityArr[i] +'</li>');
      let selCity =  (cityArr[i] +"").trim();
      //alert(selCity.indexOf(' '));
      selCity.replace(" ", "--");
      console.log(":"+selCity);
      cityURL="javascript:searchCity('"+ selCity +"')";
      //alert(cityURL);
      //$('#weather-list').append('<li class="list-group-item"><a href="javascript:searchCity("'+cityArr[i].trim()+'")>'+  cityArr[i].trim() +'</href></li>');
      
      $('#weather-list').append("<li class='list-group-item'><a href=" + cityURL + ">"+  selCity +"</href></li>");
      }
  

  }


$(document).ready(function() {
  $("#currentDay").html((moment().format("dddd, MMMM Do")));
  $("#currentDate").val((moment().format("DDMMYYYY")));

  var currentHour = moment().format("H");
  var currentDateStr = moment().format("DDMMYYYY");

  if (weather == null) {

    $("#citytoday").hide();
    $("#forecast").hide();
  }  

  checkCities();
});

var weather;

$("#search-button").click(function(){
  var txtVal = $('#search-input').val().trim();
 // console.log("sssssssssssssssssss"+cityArr.length);
  if ((txtVal !=null) && (txtVal != ""))
  {

    for ( var i = 0; i< cityArr.length;  i++ ) {
     // alert(txtVal.toLowerCase() + "----"+ cityArr[i].toLowerCase());
      if (txtVal.toLowerCase()== cityArr[i].toLowerCase()) {
       inStore =true;
       break;
    }
      else
        inStore =false;

    }
    //console.log("xxxxxxxxxxxx"+cityArr.length);

  // alert(inStore);
    if (inStore == false) {
    //cityArr.push(txtVal);
    //console.log(cityArr.len);
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
      //$('#weather-list').append('<li class="list-group-item"><a href=searchCity("'+ txtVal +'")>'+ txtVal +'</href></li>');
      $('#weather-list').append("<li class='list-group-item'><a href=" + cityURL + ">"+  selCity +"</href></li>");
    }


    //localStorage.setItem("inputcities", cityArr);
/*
    for (i=0; i<cityArr.length; i++) {
    $('#weather-list').append('<li class="list-group-item">'+ cityArr[i] +'</li>');
    }
*/

    getCityWeather(txtVal);
    getWeatherDetails(txtVal);

    $("#citytoday").show();
    $("#forecast").show();
    return false;
  }

});

function searchCity(city1){
  getCityWeather(city1);
  getWeatherDetails(city1);

  $("#citytoday").show();
  $("#forecast").show();
  return false;
}

function getCityWeather(city) {

  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + APIKey;

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

    var currDate = moment().format("DD/MM/YYYY");
    var iconURL= "https://openweathermap.org/img/wn/" + icon +"@2x.png"
    var placeHead= weather.name + " ( " + currDate + " ) <img src='" + iconURL + "'>";
    $("#city").html(placeHead);
    $("#temp").html( "Temp : " + weather.temp + " °C");
    $("#wind").html( "Wind : " +weather.wind+ " kmph");
    $("#humidity").html("Humidity : " +weather.humidity+ " %");
  });

}


function getWeatherDetails(city) {

  var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q="+ city + "&units=metric&appid=" + APIKey;

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