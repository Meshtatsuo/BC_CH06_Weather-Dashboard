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
        recentSearches.unshift({
          name: cityName,
          latitude: data[0].lat,
          longitude: data[0].lon,
        });
        if (recentSearches.length > 8) {
          recentSearches.splice(recentSearches.length - 1, 1);
        }
        saveRecentSearches();
        currentCity = cityName;
        retrieveWeatherInfo(data[0].lat, data[0].lon);
      });
    }
    //request was unsuccessful
    else {
      alert("There was a problem with your request!");
    }
  });
};

const loadRecentSearches = function () {
  recentSearches = JSON.parse(localStorage.getItem("Recent Searches"));
  console.log(recentSearches);
};

const saveRecentSearches = function () {
  localStorage.setItem("Recent Searches", JSON.stringify(recentSearches));
};
// GUI MANAGEMENT FUNCTIONS
const updateWeatherGUI = function (data) {
  // Update current condition display
  let locationDisplay = $("#location-date");
  let currentTemp = $("#currentTemp");
  let currentWind = $("#windInfo");
  let currentHumidity = $("#humidityInfo");
  let currentUV = $("#uvIndex");

  // set location and date header
  locationDisplay.text(
    currentCity +
      "    " +
      "(" +
      new Date(data.current.dt * 1000).toLocaleString().split(",")[0] +
      ")"
  );

  // set current weather stats
  currentTemp.text("Temperature: " + data.current.temp + "°F");
  currentWind.text("Wind Speed: " + data.current.wind_speed + " MPH");
  currentHumidity.text("Humidity: " + data.current.humidity + "%");
  currentUV.text("UV Index:  " + data.current.uvi);

  // set 5 day forecast
  for (i = 0; i <= 4; i++) {
    // get vars ready for displaying
    let container = $(".fiveDayForecast");
    let cardEl = $("<div>");
    let cardListEl = $("<ul>");
    let liDate = $("<li>");
    let liIcon = $("<li>");
    let liTemp = $("<li>");
    let liWind = $("<li>");
    let liHumid = $("<li>");
    let forecastDateEl = $("<h4>");
    let forecastTempEl = $("<p>");
    let forecastIcon = $("<img>");
    let forecastWind = $("<p>");
    let forecastHumidity = $("<p>");

    // assign classes and IDs
    cardEl.addClass("forecastCard glossy");
    cardEl.attr("id", "day-" + (i + 1));
    cardListEl.addClass("forecastList");
    liDate.attr("id", "forecastDate");
    liIcon.attr("id", "forecastEmoji");
    liTemp.attr("id", "forecastTemp");
    liWind.attr("id", "forecastWind");
    liHumid.attr("id", "forecastHumidity");

    // assign proper values
    let date = new Date(data.daily[i].dt * 1000).toLocaleString().split(",")[0];
    forecastDateEl.text(date);
    forecastIcon.attr(
      "src",
      "http://openweathermap.org/img/w/" +
        data.daily[i].weather[0].icon +
        ".png"
    );
    forecastTempEl.text("High: " + data.daily[i].temp.max + "°F");
    forecastWind.text("Wind: " + (data.daily[i].wind_speed + " MPH"));
    forecastHumidity.text("Humidity: " + data.daily[i].humidity + "%");

    // add appropriate list item parents
    liDate.append(forecastDateEl);
    liIcon.append(forecastIcon);
    liTemp.append(forecastTempEl);
    liWind.append(forecastWind);
    liHumid.append(forecastHumidity);

    // append items to new card item
    cardListEl.append(liDate);
    cardListEl.append(liIcon);
    cardListEl.append(liTemp);
    cardListEl.append(liWind);
    cardListEl.append(liHumid);
    cardEl.append(cardListEl);

    // add new card to card container
    container.append(cardEl);
  }
};

// When search button hit (or form submitted)
// validate text in input
searchButton.on("click", function (e) {
  e.preventDefault();
  getCityCoordinates(input.val());
});
