// v3.1.0
//Docs at http://simpleweatherjs.com

$(document).ready(function() {  
  getWeather(); //Get the initial weather.
  setInterval(getWeather, 600000); //Update the weather every 10 minutes.
});

function getWeather() {
  $.simpleWeather({
    location: 'London, England',
    woeid: '',
    unit: 'c',
    success: function(weather) {
      html = '<h2><i class="icon-'+weather.code+'"></i><p> '+weather.temp+'&deg;'+weather.units.temp+'</h2>';
      html += '<br><br>'+weather.city+', '+weather.region+'';
      html += '<br><br>'+weather.currently+'';
      html += '<br><br>'+weather.wind.direction+' '+weather.wind.speed+' '+weather.units.speed+'v2';
  
      $("#weather").html(html);
    },
    error: function(error) {
      $("#weather").html('<p>'+error+'</p>');
    }
  });
};