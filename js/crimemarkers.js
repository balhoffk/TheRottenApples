////Crime markers
// Creating map object
var myMap = L.map("map", {
    center: [33.7490, -84.3880],
    zoom: 11
  });
  
  // Adding tile layer
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(myMap);


//create function that determines the crime marker to popup
function chooseMarker(crime) {
  switch (crime) {
    case "larceny":
      return "pink";
    case "AUTO THEFT":
      return "red";
    case "robbery":
      return "orange";
    case "burglary":
      return "black";
    case "HOMICIDE":
      return "purple";
    case "MANSLAUGHTER":
      return "blue";
    case "AGG ASSAULT":
      return "green";
    default:
      return "white";
  }
}

//read in crime data
var path = "../raw_data/crime_weather.csv"

d3.csv(path).then(function(data) {

  //create the filter function
  function filterDates(date) {
    return date.date == "2009-02-28";
  }
  
  //filter on the date to narrow down the data
  data = data.filter(filterDates);
  console.log(data);

  //loop through the data and create a marker for each crime on the Atlanta map
  data.forEach(function(crime) {
    console.log(crime.lat);

    L.marker([crime.lat, crime.lon])
      .bindPopup("<h1>" + crime.All_Crime + "</h1>")
      .addTo(myMap);
    })




});


  //Loop through the crimes and create one marker for each, bind a pop-up to the marker
