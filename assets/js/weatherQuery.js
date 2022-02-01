// WEATHER QUERY SCRIPT
// This script handles the fetching,
// receiving, validating, and parsing
// data from the OpenWeather API
var apiCall =
  "https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&exclude=hourly&appid=9c332cd8337bfb2e9e7bb90c7456414d";

fetch(apiCall).then(function (response) {
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
