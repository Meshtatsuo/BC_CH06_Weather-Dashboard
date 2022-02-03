// GUI MANAGER
// This script manages the displaying of elements
// on the page. Keeping the OpenWeather API requests
// seperate from the updating and displaying of elements

// Global Variables
var input = $("#citySearch");
var searchButton = $("#searchButton");
var weatherInfo = "";
var currentCity = "";
var bodyEl = $("body");

// for storing recent searches
var cityInfo = {
  name: "",
  latitude: 0,
  longitude: 0,
};

var recentSearches = [];

// API FETCH REQUESTS

var retrieveWeatherInfo = async function (lat, lon) {
  let apiWeatherCall =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&exclude=minutely,hourly&units=imperial&appid=9c332cd8337bfb2e9e7bb90c7456414d";

  fetch(apiWeatherCall).then(function (response) {
    //request was successful
    if (response.ok) {
      response.json().then(function (data) {
        weatherInfo = data;
        updateWeatherGUI(weatherInfo);
      });
    }
    //request was unsuccesful
    else {
      alert("There was a problem with your request!");
    }
  });
};

var getCityCoordinates = async function (cityName) {
  let apiGeoCoding =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    cityName +
    "&appid=9c332cd8337bfb2e9e7bb90c7456414d";
  fetch(apiGeoCoding).then(function (response) {
    //request was successful
    if (response.ok) {
      response.json().then(function (data) {
        // if successful data retrieved, add
        // data to recent searches
        recentSearches.push({
          name: cityName,
          latitude: data[0].lat,
          longitude: data[0].lon,
        });
        currentCity = cityName;
        console.log(recentSearches);
        retrieveWeatherInfo(data[0].lat, data[0].lon);
      });
    }
    //request was unsuccessful
    else {
      alert("There was a problem with your request!");
    }
  });
};

// GUI MANAGEMENT FUNCTIONS
const updateWeatherGUI = function (data) {
  // Update current condition display
  let locationDisplay = $("#location-date");
  let currentTemp = $("#currentTemp");
  let currentWind = $("#windInfo");
  let currentHumidity = $("#humidityInfo");
  let currentUV = $("#uvIndex");
  console.log(data);

  // set location and date header
  locationDisplay.text(
    currentCity + "    " + new Date(data.current.dt * 1000).toLocaleString()
  );

  // set current weather stats
  currentTemp.text("Temperature: " + data.current.temp + "°F");
  currentWind.text("Wind Speed: " + data.current.wind_speed + " MPH");
  currentHumidity.text("Humidity: " + data.current.humidity + "%");
  currentUV.text("UV Index:  " + data.current.uvi);

  // set 5 day forecast
  
};

// When search button hit (or form submitted)
// validate text in input
searchButton.on("click", function (e) {
  e.preventDefault();
  getCityCoordinates(input.val());
});
