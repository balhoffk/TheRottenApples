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

    //create the markers
    L.circleMarker([crime.lat, crime.lon], {
      radius: 13,
      fillColor: chooseMarker(crime.combo_crime),
      color: "white",
      fillOpacity: .75,
      weight: 2
    })
      //bind the popup to each marker
      .bindPopup("<h1>" + crime.All_Crime + "</h1><hr><h3> Location: "+crime.Neigborhood +"</h3><hr><h3> Temperature: "+crime.temperature+"</h3>")
      .addTo(myMap);

    })


    // Set up the legend
    //set the legend to be in the topright of the page
    var legend = L.control({position: "topright"});

    //put together the legend function
    legend.onAdd = function() {
    
    //create the "info legend" class in the html
    var div = L.DomUtil.create("div", "info legend");
    
    //list out the category lables and the colors used
    var categories = [" Larceny", " Auto Theft"," Robbery", " Burglary", " Homicide"," Manslaughter", " Agg Assault"];
    var colors = ["pink", "orange", "red","black","purple", "blue", "green"];

    //loop through the categories and push the labels and colors to the legend html
    for (i=0; i<colors.length; i++) {

      div.innerHTML +=
      '<li style=\"background:' + colors[i] +'"></li>' +(categories[i] ? categories[i] +'<br>' : '+')
    }
      return div;
  }
  //add the legend to the map   
  legend.addTo(myMap)




});


  //Loop through the crimes and create one marker for each, bind a pop-up to the marker
