// WEATHER QUERY SCRIPT
// This script handles the fetching,
// receiving, validating, and parsing
// data from the OpenWeather API
var apiWeatherCall =
  "https://api.openweathermap.org/data/2.5/onecall?appid=9c332cd8337bfb2e9e7bb90c7456414d";

var apiGeoCoding =
  "http://api.openweathermap.org/geo/1.0/direct?q=" +
  cityName +
  "&appid=9c332cd8337bfb2e9e7bb90c7456414d";

var cityName = "";

var cityInfo = {
  name: "",
  latitude: 0,
  longitude: 0,
};

var recentCities = [];

var retrieveWeatherInfo = function (lat, lon) {
  let apiWeatherCall =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=9c332cd8337bfb2e9e7bb90c7456414d";

  fetch(apiGeoCoding).then(function (response) {
    //request was successful
    if (response.ok) {
      response.json().then(function (data) {
        // pass data to dom function
        console.log(data);

        // check if API has paginated issues
        if (response.headers.get("Link")) {
          console.log(response);
        }
      });
    } else {
      alert("There was a problem with your request!");
    }
  });
};
